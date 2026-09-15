import React, { useEffect } from 'react';
import { updateMetaTags, SEOMetaTags, defaultSEOTags } from '../utils/seo';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  author?: string;
  image?: string;
  url?: string;
}

const SEO: React.FC<SEOProps> = ({ 
  title, 
  description, 
  keywords, 
  author, 
  image, 
  url 
}) => {
  useEffect(() => {
    const seoData: SEOMetaTags = {
      title: title || defaultSEOTags.title,
      description: description || defaultSEOTags.description,
      keywords: keywords || defaultSEOTags.keywords,
      author: author || defaultSEOTags.author,
      image: image || defaultSEOTags.image,
      url: url || window.location.href
    };

    updateMetaTags(seoData);
  }, [title, description, keywords, author, image, url]);

  return null; // This component doesn't render anything
};

export default SEO;