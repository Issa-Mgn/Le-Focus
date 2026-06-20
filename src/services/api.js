
const API_URL = 'https://le-focus-backend.onrender.com/api';

// Helper to convert Base64 to Blob for file uploads
const base64ToBlob = (base64) => {
    if (!base64) return null;
    try {
        const arr = base64.split(',');
        const mime = arr[0].match(/:(.*?);/)[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], { type: mime });
    } catch (e) {
        console.error("Error converting base64 to blob", e);
        return null;
    }
};

const safeDate = (dateStr) => {
    if (!dateStr) return new Date().toISOString().split('T')[0];
    try {
        if (typeof dateStr === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
            return dateStr;
        }
        return new Date(dateStr).toISOString().split('T')[0];
    } catch (e) {
        console.warn("Invalid date:", dateStr);
        return new Date().toISOString().split('T')[0];
    }
};

// Optimiser les URLs d'images pour de meilleures performances
const optimizeImageUrl = (url, options = {}) => {
    if (!url) return null;

    const { width = 1200, quality = 80, format = 'auto' } = options;

    // Si c'est une URL Unsplash, ajouter les paramètres d'optimisation
    if (url.includes('unsplash.com')) {
        const separator = url.includes('?') ? '&' : '?';
        return `${url}${separator}w=${width}&q=${quality}&fm=${format}&fit=crop`;
    }

    // Si c'est une URL Cloudinary ou autre CDN, on pourrait ajouter d'autres optimisations
    // Pour l'instant, retourner l'URL telle quelle
    return url;
};


// LocalStorage Cache
const CACHE_KEY = 'focus_articles_cache';
const CACHE_DURATION = 15 * 60 * 1000; // 15 minutes - Optimisé pour de meilleures performances

export const api = {
    auth: {
        login: async (email, password) => {
            try {
                const response = await fetch(`${API_URL}/auth/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, password })
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || 'Login failed');
                }

                if (data.token) {
                    localStorage.setItem('adminToken', data.token);
                    localStorage.setItem('adminUser', JSON.stringify(data.user));
                    localStorage.setItem('adminAuth', 'true');
                }

                return data;
            } catch (error) {
                console.error("API Login Error:", error);
                throw error;
            }
        }
    },

    articles: {
        getAll: async (forceRefresh = false) => {
            const now = Date.now();

            // Try to load from localStorage cache first
            if (!forceRefresh) {
                try {
                    const cached = localStorage.getItem(CACHE_KEY);
                    if (cached) {
                        const { timestamp, data } = JSON.parse(cached);
                        if (now - timestamp < CACHE_DURATION) {
                            console.log("Chargement des articles depuis le cache STORAGE");
                            return data;
                        }
                    }
                } catch (e) {
                    console.warn("Erreur de lecture du cache", e);
                }
            }

            try {
                const response = await fetch(`${API_URL}/articles`);
                if (!response.ok) throw new Error('Échec de la récupération des articles');
                const data = await response.json();

                let articles = Array.isArray(data) ? data : (data.articles || data.data || []);

                const processedArticles = articles
                    .filter(a => a && typeof a === 'object')
                    .map(a => ({
                        ...a,
                        images: [
                            optimizeImageUrl(a.cover_image_url, { width: 1200, quality: 85 }),
                            ...(a.gallery_image_urls || []).map(url => optimizeImageUrl(url, { width: 1200, quality: 85 }))
                        ].filter(Boolean),
                        pdf: a.pdf_url,
                        views: a.views || 0,
                        date: safeDate(a.published_at || a.created_at || a.date),
                        excerpt: a.excerpt || (a.content ? a.content.substring(0, 100) + '...' : '')
                    }));

                // Update localStorage cache
                try {
                    localStorage.setItem(CACHE_KEY, JSON.stringify({
                        timestamp: now,
                        data: processedArticles
                    }));
                } catch (e) {
                    console.warn("Échec de la sauvegarde dans le cache (quota dépassé ?)", e);
                }

                return processedArticles;
            } catch (error) {
                console.error("API Error:", error);
                return [];
            }
        },

        getById: async (id) => {
            try {
                const response = await fetch(`${API_URL}/articles/${id}`);
                if (!response.ok) throw new Error('Failed to fetch article');
                const a = await response.json();

                return {
                    ...a,
                    images: [
                        optimizeImageUrl(a.cover_image_url, { width: 1600, quality: 90 }),
                        ...(a.gallery_image_urls || []).map(url => optimizeImageUrl(url, { width: 1600, quality: 90 }))
                    ].filter(Boolean),
                    pdf: a.pdf_url,
                    views: a.views || 0,
                    date: safeDate(a.published_at || a.created_at || a.date),
                    paragraphs: a.content ? a.content.split('\n\n') : [],
                };
            } catch (error) {
                console.error("API Error:", error);
                return null;
            }
        },

        create: async (articleData) => {
            const formData = new FormData();

            formData.append('title', articleData.title);
            // Generate slug if not present
            const slug = articleData.slug || articleData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
            formData.append('slug', slug);

            formData.append('excerpt', articleData.excerpt);
            formData.append('content', articleData.content);
            formData.append('category', articleData.category);
            formData.append('author', articleData.author);

            // Handle Images
            const nonEmptyImages = (articleData.images || []).filter(img => img);

            if (nonEmptyImages.length > 0) {
                // Send all images as gallery_images (backend expects this)
                nonEmptyImages.forEach((base64, index) => {
                    const blob = base64ToBlob(base64);
                    if (blob) formData.append('gallery_images', blob, `image-${index}.jpg`);
                });
            }

            // Handle PDF
            if (articleData.pdf) {
                const blob = base64ToBlob(articleData.pdf);
                if (blob) {
                    formData.append('pdf_file', blob, 'document.pdf');
                }
            }

            const token = localStorage.getItem('adminToken');

            try {
                const response = await fetch(`${API_URL}/articles`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    body: formData,
                });

                if (response.status === 401) {
                    throw new Error("Unauthorized");
                }

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.message || 'Failed to create article');
                }

                // Clear cache on new article so it appears immediately
                api.articles.clearCache();

                return await response.json();
            } catch (error) {
                console.error("API Create Article Error:", error);
                throw error;
            }
        },

        update: async (id, articleData) => {
            const formData = new FormData();

            formData.append('title', articleData.title);
            // slug update logic if needed, usually we might keep the old slug or update it
            if (articleData.slug) formData.append('slug', articleData.slug);

            formData.append('excerpt', articleData.excerpt);
            formData.append('content', articleData.content);
            formData.append('category', articleData.category);
            formData.append('author', articleData.author);

            // Handle Images
            // For updates: send only NEW images (base64) as gallery_images
            // Backend will replace all images if new ones are provided
            const nonEmptyImages = (articleData.images || []).filter(img => img);
            const newImages = nonEmptyImages.filter(img => img.startsWith('data:'));

            if (newImages.length > 0) {
                // Send all new images as gallery_images
                newImages.forEach((base64, index) => {
                    const blob = base64ToBlob(base64);
                    if (blob) formData.append('gallery_images', blob, `image-${index}.jpg`);
                });
            }

            // Handle PDF
            if (articleData.pdf && articleData.pdf.startsWith('data:')) {
                const blob = base64ToBlob(articleData.pdf);
                if (blob) {
                    formData.append('pdf_file', blob, 'document.pdf');
                }
            }

            const token = localStorage.getItem('adminToken');

            try {
                const response = await fetch(`${API_URL}/articles/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    body: formData,
                });

                if (response.status === 401) {
                    throw new Error("Unauthorized");
                }

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.message || 'Failed to update article');
                }

                // Clear cache
                api.articles.clearCache();

                return await response.json();
            } catch (error) {
                console.error("API Update Article Error:", error);
                throw error;
            }
        },

        incrementViews: async (id) => {
            try {
                await fetch(`${API_URL}/articles/${id}/views`, { method: 'POST' });
            } catch (e) {
                console.error("Error incrementing views", e);
            }
        },

        incrementDownloads: async (id) => {
            try {
                await fetch(`${API_URL}/articles/${id}/downloads`, { method: 'POST' });
            } catch (e) {
                console.error("Error incrementing downloads", e);
            }
        },

        delete: async (id) => {
            const token = localStorage.getItem('adminToken');
            try {
                const response = await fetch(`${API_URL}/articles/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.status === 401) throw new Error("Unauthorized");

                if (!response.ok) throw new Error('Failed to delete article');

                api.articles.clearCache();
                return true;
            } catch (error) {
                console.error("API Delete Error:", error);
                throw error;
            }
        },

        clearCache: () => {
            localStorage.removeItem(CACHE_KEY);
        }
    },

    orders: {
        create: async (orderData) => {
            try {
                const response = await fetch(`${API_URL}/orders`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(orderData)
                });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.message || 'Failed to submit order');
                }
                return await response.json();
            } catch (error) {
                console.error("API Order Error:", error);
                throw error;
            }
        },

        getAll: async () => {
            try {
                const response = await fetch(`${API_URL}/orders`);
                if (!response.ok) throw new Error('Failed to fetch orders');
                return await response.json();
            } catch (error) {
                console.error("API Order Fetch Error:", error);
                return [];
            }
        }
    },

    comments: {
        getByArticleId: async (articleId) => {
            try {
                const response = await fetch(`${API_URL}/articles/${articleId}/comments`);
                if (!response.ok) {
                    // If endpoint doesn't exist yet, return mock empty array to prevent crash
                    console.warn("Comments API endpoint might be missing, returning empty array.");
                    return [];
                }
                return await response.json();
            } catch (error) {
                console.error("API Get Comments Error:", error);
                return [];
            }
        },

        add: async (articleId, commentData) => {
            try {
                const response = await fetch(`${API_URL}/articles/${articleId}/comments`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(commentData)
                });
                if (!response.ok) throw new Error('Failed to add comment');
                return await response.json();
            } catch (error) {
                console.error("API Add Comment Error:", error);
                throw error;
            }
        },

        like: async (commentId) => {
            try {
                const response = await fetch(`${API_URL}/comments/${commentId}/like`, {
                    method: 'POST'
                });
                if (!response.ok) throw new Error('Failed to like comment');
                return await response.json();
            } catch (error) {
                console.error("API Like Comment Error:", error);
                throw error;
            }
        },

        reply: async (commentId, replyData) => {
            try {
                const response = await fetch(`${API_URL}/comments/${commentId}/replies`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(replyData)
                });
                if (!response.ok) throw new Error('Failed to reply to comment');
                return await response.json();
            } catch (error) {
                console.error("API Reply Comment Error:", error);
                throw error;
            }
        }
    }
};
