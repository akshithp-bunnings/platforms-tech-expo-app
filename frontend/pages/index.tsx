import type { InferGetStaticPropsType, NextPage } from 'next';
import { getSiteData } from '../src/SiteData';
import { SceneName } from '../src/SceneController';

export async function getStaticProps() {
  // Get projects from the static JSON file instead of Sanity
  const { projects } = await getSiteData();
  const scene: SceneName = 'intro';
  
  return {
    props: {
      projects,
      scene,
    },
  };
}

type Props = InferGetStaticPropsType<typeof getStaticProps>

const ScenePage: NextPage<Props> = () => null;

export default ScenePage;