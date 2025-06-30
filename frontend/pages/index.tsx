import type { InferGetStaticPropsType, NextPage } from 'next';
import { getSiteData } from '../src/SiteData';
import { SceneName } from '../src/SceneController';

export async function getStaticProps() {
  // Get the full site data including the startingScene
  const siteData = await getSiteData();
  
  return {
    props: {
      projects: siteData.projects,
      scene: siteData.startingScene, // Use the scene from SiteData instead of hardcoding 'intro'
    },
  };
}

type Props = InferGetStaticPropsType<typeof getStaticProps>

const ScenePage: NextPage<Props> = () => null;

export default ScenePage;