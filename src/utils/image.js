// utils/image.js
export const imageUtils = {
  // Redimensionar imagen
  resizeImage: (file, maxWidth = 800, maxHeight = 600, quality = 0.8) => {
    return new Promise(resolve => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Calcular nuevas dimensiones manteniendo aspect ratio
        let { width, height } = img;

        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        // Dibujar y comprimir
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(resolve, 'image/jpeg', quality);
      };

      img.src = URL.createObjectURL(file);
    });
  },

  // Generar thumbnail
  generateThumbnail: (file, size = 150) => {
    return imageUtils.resizeImage(file, size, size, 0.7);
  },

  // Validar archivo de imagen
  validateImage: (file, maxSizeMB = 5) => {
    const errors = [];

    if (!file.type.startsWith('image/')) {
      errors.push('El archivo debe ser una imagen');
    }

    if (file.size > maxSizeMB * 1024 * 1024) {
      errors.push(`El archivo debe ser menor a ${maxSizeMB}MB`);
    }

    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      errors.push('Tipo de imagen no válido (solo JPEG, PNG, GIF, WebP)');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  },
};
