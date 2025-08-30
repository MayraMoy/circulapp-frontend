// hooks/useImageUpload.js
import { useState } from 'react';

export const useImageUpload = (maxImages = 5, maxSizeInMB = 5) => {
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const addImages = files => {
    const fileArray = Array.from(files);

    if (images.length + fileArray.length > maxImages) {
      setError(`Máximo ${maxImages} imágenes permitidas`);
      return;
    }

    const validFiles = [];
    const newPreviews = [];

    fileArray.forEach(file => {
      // Validar tamaño
      if (file.size > maxSizeInMB * 1024 * 1024) {
        setError(`La imagen ${file.name} es muy grande. Máximo ${maxSizeInMB}MB`);
        return;
      }

      // Validar tipo
      if (!file.type.startsWith('image/')) {
        setError(`${file.name} no es una imagen válida`);
        return;
      }

      validFiles.push(file);

      // Crear preview
      const reader = new FileReader();
      reader.onload = e => {
        newPreviews.push({
          file,
          url: e.target.result,
          id: `${file.name}-${Date.now()}`,
        });

        if (newPreviews.length === validFiles.length) {
          setPreviews(prev => [...prev, ...newPreviews]);
        }
      };
      reader.readAsDataURL(file);
    });

    setImages(prev => [...prev, ...validFiles]);
    setError('');
  };

  const removeImage = index => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const clearImages = () => {
    setImages([]);
    setPreviews([]);
    setError('');
  };

  const uploadImages = async uploadFunction => {
    if (images.length === 0) return [];

    try {
      setUploading(true);
      const formData = new FormData();
      images.forEach(image => formData.append('images', image));

      const result = await uploadFunction(formData);
      return result;
    } catch (err) {
      setError('Error al subir imágenes');
      throw err;
    } finally {
      setUploading(false);
    }
  };

  return {
    images,
    previews,
    uploading,
    error,
    addImages,
    removeImage,
    clearImages,
    uploadImages,
  };
};
