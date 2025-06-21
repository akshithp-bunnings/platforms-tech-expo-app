import { SceneName } from './SceneController';
import projectsData from '../public/data/projects.json';

export type Project = {
  _id: string;
  title: string;
  shortTitle?: string;
  slug: { current: string };
  subTitle?: string;
  client?: string;
  designers?: Array<{ name: string; url?: string }>;
  links?: Array<{ text: string; url: string }>;
  body?: any[];  // Simplified from Portable Text
  color1?: { hex: string };
};

export type SiteData = {
  startingScene: SceneName;
  projects: Project[];
};

export async function getSiteData(): Promise<SiteData> {
  // Simply return the static data
  return {
    startingScene: 'home',
    projects: projectsData as Project[],
  };
}