import React, { useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Stats } from '@react-three/drei';
import { A11yAnnouncer } from '@react-three/a11y';
import { LinearToneMapping } from 'three';
import { SceneDirector } from './SceneDirector';
import { SiteData } from './SiteData';
import { useParamOnLoad } from './useParamOnLoad';
import { AdaptivePixelRatio } from './AdaptivePixelRatio';
import { useDevicePerformance } from './useDevicePerformance';

const ThreeCanvas = ({ siteData }:{siteData:SiteData}) => {
  const showStats = useParamOnLoad('stats') === 'true';
  const devicePerformance = useDevicePerformance();
  
  // Set lower pixel ratio for lower-performance devices
  const pixelRatio = devicePerformance === 'low' ? 0.5 : 
                    devicePerformance === 'medium' ? 0.75 : 1;

  return (
    <>
      <Canvas
        dpr={[pixelRatio, 1]} // Limit pixel ratio based on performance
        performance={{ min: pixelRatio }} // Allow R3F to reduce quality if needed
        // eslint-disable-next-line no-param-reassign
        onCreated={({ gl }) => { 
          gl.toneMapping = LinearToneMapping;
          // Disable certain intensive features on low-performance devices
          if (devicePerformance === 'low') {
            gl.setPixelRatio(Math.min(window.devicePixelRatio * pixelRatio, 1));
          }
        }}
      >
        <AdaptivePixelRatio />
        <SceneDirector siteData={siteData} performanceLevel={devicePerformance} />
        {showStats && <Stats />}
        <ambientLight />
      </Canvas>
      <A11yAnnouncer />
    </>
  );
};
export default ThreeCanvas;