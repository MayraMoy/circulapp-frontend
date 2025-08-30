// components/SEO/MetaTags.js - Metatags dinámicos
import { useEffect } from 'react';

const MetaTags = ({ title, description, keywords, image, url, type = 'website' }) => {
  useEffect(() => {
    // Título
    if (title) {
      document.title = `${title} | CirculApp`;
      updateMetaTag('og:title', title);
      updateMetaTag('twitter:title', title);
    }

    // Descripción
    if (description) {
      updateMetaTag('description', description);
      updateMetaTag('og:description', description);
      updateMetaTag('twitter:description', description);
    }

    // Keywords
    if (keywords) {
      updateMetaTag('keywords', Array.isArray(keywords) ? keywords.join(', ') : keywords);
    }

    // Imagen
    if (image) {
      updateMetaTag('og:image', image);
      updateMetaTag('twitter:image', image);
    }

    // URL
    if (url) {
      updateMetaTag('og:url', url);
      updateMetaTag('canonical', url, 'link');
    }

    // Tipo
    updateMetaTag('og:type', type);

    // Twitter Card
    updateMetaTag('twitter:card', 'summary_large_image');
  }, [title, description, keywords, image, url, type]);

  const updateMetaTag = (name, content, tagType = 'meta') => {
    if (!content) return;

    const isProperty = name.startsWith('og:') || name.startsWith('twitter:');
    const attribute = isProperty ? 'property' : 'name';

    if (tagType === 'link') {
      let tag = document.querySelector(`link[rel="${name}"]`);
      if (!tag) {
        tag = document.createElement('link');
        tag.rel = name;
        document.head.appendChild(tag);
      }
      tag.href = content;
    } else {
      let tag = document.querySelector(`meta[${attribute}="${name}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute(attribute, name);
        document.head.appendChild(tag);
      }
      tag.content = content;
    }
  };

  return null;
};

export default MetaTags;
