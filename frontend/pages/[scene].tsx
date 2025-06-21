import type {
  GetStaticPaths, GetStaticProps, NextPage,
} from 'next';
import { ParsedUrlQuery } from 'querystring';
import { getSiteData } from '../src/SiteData';
import { SceneName, sceneNames } from '../src/SceneController';

interface Params extends ParsedUrlQuery {
  scene:SceneName
}

interface Props {
  scene:SceneName,
}

// Replace the getStaticProps function
export const getStaticProps: GetStaticProps<Props, Params> = async (context) => {
  const { scene } = context.params ?? { scene: 'error' };
  
  // Import projects directly from our JSON file
  const { projects } = await getSiteData();

  return {
    props: {
      projects,
      scene,
    },
  };
};

export const getStaticPaths:GetStaticPaths = async () => {
  const paths = sceneNames
    .filter((scene:SceneName) => scene !== 'projects')
    .map((scene:SceneName) => ({ params: { scene } }));

  return {
    paths,
    fallback: false,
  };
};
const ScenePage: NextPage<Props> = () => (null);

export default ScenePage;
