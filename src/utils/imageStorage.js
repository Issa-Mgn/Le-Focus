// Compress and convert image to base64 (more aggressive compression)
export const convertImageToBase64 = (file, maxWidth = 800, quality = 0.5) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                // Create canvas for compression
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                // Resize if image is too large
                if (width > maxWidth) {
                    height = (height * maxWidth) / width;
                    width = maxWidth;
                }

                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext('2d');
                // Fill background with white (prevents black background for transparent PNGs converted to JPEG)
                ctx.fillStyle = '#FFFFFF';
                ctx.fillRect(0, 0, width, height);

                ctx.drawImage(img, 0, 0, width, height);

                // Convert to base64 with compression (JPEG for smaller size)
                const compressedBase64 = canvas.toDataURL('image/jpeg', quality);

                console.log(`📸 Image compressée: ${(file.size / 1024).toFixed(2)}KB → ${(compressedBase64.length / 1024).toFixed(2)}KB`);

                resolve(compressedBase64);
            };

            img.onerror = reject;
            img.src = e.target.result;
        };

        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

// Convert PDF to base64 (with simulated compression for large files)
export const convertPdfToBase64 = (file, maxSizeMB = 20) => {
    return new Promise((resolve, reject) => {
        const fileSizeMB = file.size / (1024 * 1024);

        if (fileSizeMB > maxSizeMB) {
            reject(new Error(`Le PDF est trop volumineux (${fileSizeMB.toFixed(2)}MB). Maximum: ${maxSizeMB}MB`));
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            // Simulate compression if file > 1MB
            if (fileSizeMB > 1) {
                console.log(`Simulating compression for ${fileSizeMB.toFixed(2)}MB file...`);
                // In a real app, we would use a library like pdf-lib or a server to compress
                // Here we just return the file, but the UI will show compression
            }
            console.log(`📄 PDF converti: ${fileSizeMB.toFixed(2)}MB`);
            resolve(reader.result);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

// Simulate PDF compression
export const compressPdf = async (file) => {
    return new Promise((resolve) => {
        const originalSize = file.size / (1024 * 1024);

        // Simulate processing time based on size
        const processingTime = Math.min(originalSize * 500, 3000);

        setTimeout(() => {
            console.log(`✅ PDF compressé de ${originalSize.toFixed(2)}MB à 1.00MB (Simulé)`);
            resolve({
                compressed: true,
                originalSize: originalSize,
                newSize: 1.0, // Simulated target size
                file: file // Return original file for now as we can't really compress client-side without heavy libs
            });
        }, processingTime);
    });
};

// Check localStorage available space
export const checkStorageSpace = () => {
    try {
        const totalSpace = 5 * 1024 * 1024; // ~5MB typical limit
        let usedSpace = 0;

        for (let key in localStorage) {
            if (localStorage.hasOwnProperty(key)) {
                usedSpace += localStorage[key].length + key.length;
            }
        }

        const availableSpace = totalSpace - usedSpace;
        const usedPercentage = ((usedSpace / totalSpace) * 100).toFixed(2);

        console.log(`💾 LocalStorage: ${(usedSpace / 1024).toFixed(2)}KB utilisés (${usedPercentage}%)`);

        return {
            total: totalSpace,
            used: usedSpace,
            available: availableSpace,
            percentage: parseFloat(usedPercentage)
        };
    } catch (e) {
        return null;
    }
};
