import fs from 'fs/promises';
import path from 'path';
import { TopicContent, TechStack } from '@/types/content';

const CONTENT_DIR = path.join(process.cwd(), 'src/content');

export async function getTopicContent(techId: string, topicId: string): Promise<TopicContent | null> {
  try {
    const filePath = path.join(CONTENT_DIR, techId, `${topicId}.json`);
    const fileContent = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(fileContent) as TopicContent;
  } catch (error) {
    console.error(`Failed to load topic content for ${techId}/${topicId}:`, error);
    return null;
  }
}

export async function getTechStackMeta(techId: string): Promise<TechStack | null> {
  try {
    const filePath = path.join(CONTENT_DIR, techId, 'meta.json');
    const fileContent = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(fileContent) as TechStack;
  } catch (error) {
    console.error(`Failed to load tech stack meta for ${techId}:`, error);
    return null;
  }
}

export async function getAllTechStacks(): Promise<TechStack[]> {
  try {
    const dirs = await fs.readdir(CONTENT_DIR, { withFileTypes: true });
    const techStacks: TechStack[] = [];
    
    for (const dir of dirs) {
      if (dir.isDirectory()) {
        const meta = await getTechStackMeta(dir.name);
        if (meta) {
          techStacks.push(meta);
        }
      }
    }
    
    return techStacks;
  } catch (error) {
    console.error('Failed to load all tech stacks:', error);
    return [];
  }
}
