// import React from 'react';
import type { InferGetStaticPropsType, NextPage } from 'next';
import { SceneName } from '../../src/SceneController';
import { getSiteData } from '../../src/SiteData';

export async function getStaticProps() {
  const { projects } = await getSiteData();
  const scene:SceneName = 'projects';

  return {
    props: {
      projects,
      scene,
    },
  };
}

type Props = InferGetStaticPropsType<typeof getStaticProps>

const Home: NextPage<Props> = () => (null);

export default Home;
