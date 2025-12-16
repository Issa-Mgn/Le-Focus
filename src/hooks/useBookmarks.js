
import { useState, useEffect } from 'react';

export const useBookmarks = () => {
    const [bookmarks, setBookmarks] = useState([]);

    useEffect(() => {
        // Load bookmarks from local storage on mount
        const saved = localStorage.getItem('focus_bookmarks');
        if (saved) {
            try {
                setBookmarks(JSON.parse(saved));
            } catch (e) {
                console.error('Failed to parse bookmarks', e);
            }
        }
    }, []);

    const toggleBookmark = (article) => {
        const isBookmarked = bookmarks.some(b => b.id === article.id);
        let newBookmarks;

        if (isBookmarked) {
            newBookmarks = bookmarks.filter(b => b.id !== article.id);
        } else {
            // Save minimal info needed for the card
            newBookmarks = [...bookmarks, {
                id: article.id,
                title: article.title,
                excerpt: article.excerpt,
                image: article.image || (article.images && article.images[0]), // Handle different image structures
                category: article.category,
                date: article.date,
                author: article.author,
                readTime: article.readTime
            }];
        }

        setBookmarks(newBookmarks);
        localStorage.setItem('focus_bookmarks', JSON.stringify(newBookmarks));
        return !isBookmarked;
    };

    const isBookmarked = (id) => {
        return bookmarks.some(b => b.id === id);
    };

    return { bookmarks, toggleBookmark, isBookmarked };
};
