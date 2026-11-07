import { MetadataRoute } from 'next';
import { getAllTechStacks } from '@/lib/content';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://interview.toolmate.co.in";
  const techStacks = await getAllTechStacks();
  
  const sitemap: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/practice/quiz`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/practice/quiz/jutro`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/practice/mock`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ];

  // Add all Tech Stack Hub pages
  techStacks.forEach((stack) => {
    sitemap.push({
      url: `${baseUrl}/learn/${stack.id}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    });

    // Add all distinct Topic pages
    stack.categories.forEach((category) => {
      category.topics.forEach((topic) => {
        sitemap.push({
          url: `${baseUrl}/learn/${stack.id}/${topic.id}`,
          lastModified: new Date(),
          changeFrequency: 'monthly',
          priority: 0.6,
        });
      });
    });
  });

  return sitemap;
}
