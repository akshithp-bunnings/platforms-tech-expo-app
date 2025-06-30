import { SceneName } from './SceneController';
import projectsData from '../public/data/projects.json';

export type TextBlock = {
  _type: 'text';
  content: string;
  style: 'normal' | 'h1' | 'h2' | 'h3';
};

export type ImageBlock = {
  _type: 'image';
  url: string;
  alt?: string;
  caption?: string;
};

export type VideoBlock = {
  _type: 'video';
  url: string;
  poster?: string;
  caption?: string;
};

export type ContentBlock = TextBlock | ImageBlock | VideoBlock;

export type Project = {
  _id: string;
  title: string;
  shortTitle?: string;
  slug: { current: string };
  subTitle?: string;
  team?: string;
  body: ContentBlock[];
  color1?: { hex: string };
};

export type SiteData = {
  startingScene: SceneName;
  projects: Project[];
};

export async function getSiteData(): Promise<SiteData> {
  // Simply return the static data
  return {
    startingScene: 'menu',
    projects: projectsData as Project[],
  };
}