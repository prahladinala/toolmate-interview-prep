import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://interview.toolmate.co.in";
  
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/dashboard', '/api/', '/practice/review'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
