import { NextResponse } from 'next/server';
import { getAllTechStacks } from '@/lib/content';

export interface SearchItem {
  techId: string;
  techTitle: string;
  topicId: string;
  topicTitle: string;
  categoryTitle: string;
  url: string;
}

let cachedSearchIndex: SearchItem[] | null = null;

export async function GET() {
  try {
    if (cachedSearchIndex) {
      return NextResponse.json(cachedSearchIndex, {
        headers: {
          'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
        },
      });
    }

    const techStacks = await getAllTechStacks();
    const items: SearchItem[] = [];

    for (const stack of techStacks) {
      for (const cat of stack.categories) {
        for (const topic of cat.topics) {
          items.push({
            techId: stack.id,
            techTitle: stack.title,
            topicId: topic.id,
            topicTitle: topic.title,
            categoryTitle: cat.title,
            url: `/learn/${stack.id}/${topic.id}`,
          });
        }
      }
    }

    cachedSearchIndex = items;

    return NextResponse.json(items, {
      headers: {
        'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error('Error generating search index:', error);
    return NextResponse.json({ error: 'Failed to generate search index' }, { status: 500 });
  }
}
