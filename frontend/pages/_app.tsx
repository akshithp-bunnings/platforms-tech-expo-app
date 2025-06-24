import '../styles/globals.css';
import type { AppProps } from 'next/app';
import React from 'react';
import { DefaultSeo } from 'next-seo';
// import { useEventListener } from 'usehooks-ts';
import { GoogleAnalytics } from 'nextjs-google-analytics';
import { CustomCursor } from '../src/CustomCursor';
import { ThreePage } from '../src/ThreePage';
import { SiteData } from '../src/SiteData';
import { MobileVhAsCssVar } from '../src/MobileVhAsCssVar';
import { useConsoleLogDevSignature } from '../src/useConsoleLogDevSignature';
import { PlayAllVideosOnClickInLowPowerMode } from '../src/usePlayAllVideosOnClickInLowPowerMode';

function MyApp({ Component, pageProps }: AppProps) {
  const siteData:SiteData = {
    startingScene: pageProps.scene ?? 'error',
    projects: pageProps.projects ?? null,
  };

  useConsoleLogDevSignature();

  // useEventListener('focusin', (e) => {
  //   console.log('focused on', e.target);
  // });

  const title = ' Platform Tribe';
  const description = ' Platform Tribe | Tech Expo.';

  return (
    <>
      <DefaultSeo
        title={title}
        description={description}
        openGraph={{
          title,
          description,
          type: 'website',
          images: [
            {
              url: 'https://techexpo.example.com/images/social.png',
              width: 1200,
              height: 630,
              alt: 'Platform Tribe Tech Expo preview image',
              type: 'image/png',
            },
          ],
          site_name: 'Tech Expo',
        }}
        twitter={{
          handle: '@platformtribe',
          cardType: 'summary_large_image',
        }}
      />
      <GoogleAnalytics trackPageViews />
      <MobileVhAsCssVar />
      <ThreePage
        siteData={siteData}
      />
      <Component {...pageProps} />
      <CustomCursor />
      <PlayAllVideosOnClickInLowPowerMode />
    </>
  );
}

export default MyApp;