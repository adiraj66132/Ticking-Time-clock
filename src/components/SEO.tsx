import { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  type?: string;
  image?: string;
  url?: string;
}

const SEO = ({
  title = 'Ticking Time - Modern Clock App',
  description = 'A beautiful and feature-rich clock application with timezone support, stopwatch, and timer functionality',
  type = 'website',
  image = '/clock-preview.png',
  url = typeof window !== 'undefined' ? window.location.href : '',
}: SEOProps) => {
  useEffect(() => {
    // Update meta tags
    document.title = title;
    
    const metaTags = [
      { name: 'description', content: description },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:type', content: type },
      { property: 'og:image', content: image },
      { property: 'og:url', content: url },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: image },
    ];

    // Update existing meta tags or create new ones
    metaTags.forEach(({ name, property, content }) => {
      let element = document.querySelector(`meta[${name ? `name="${name}"` : `property="${property}"`}]`);
      
      if (!element) {
        element = document.createElement('meta');
        if (name) element.setAttribute('name', name);
        if (property) element.setAttribute('property', property);
        document.head.appendChild(element);
      }
      
      element.setAttribute('content', content);
    });

    // Add schema.org structured data
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: title,
      description: description,
      image: image,
      url: url,
      applicationCategory: 'UtilityApplication',
      operatingSystem: 'Any',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD'
      }
    };

    let scriptTag = document.querySelector('#structured-data') as HTMLScriptElement | null;
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = 'structured-data';
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }
    scriptTag.textContent = JSON.stringify(structuredData);

    return () => {
      // Cleanup structured data on unmount
      const script = document.querySelector('#structured-data');
      if (script) script.remove();
    };
  }, [title, description, type, image, url]);

  return null;
};

export default SEO; 