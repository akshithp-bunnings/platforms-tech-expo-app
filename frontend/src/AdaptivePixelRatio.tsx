import { useThree } from '@react-three/fiber';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useDevicePerformance } from './useDevicePerformance';

export function AdaptivePixelRatio() {
  const { gl } = useThree();
  const lastPerformanceMeasure = useRef<number>(Date.now());
  const framesCount = useRef<number>(0);
  const currentDpr = useRef<number>(1);
  const slowFramesCounter = useRef<number>(0);
  const fastFramesCounter = useRef<number>(0);
  const devicePerformance = useDevicePerformance();

  useFrame(() => {
    framesCount.current++;
    const now = Date.now();

    // Check every second
    if (now - lastPerformanceMeasure.current > 1000) {
      const fps = framesCount.current;
      framesCount.current = 0;
      lastPerformanceMeasure.current = now;

      // Adjust pixel ratio based on FPS and device performance level
      const minFpsThreshold = devicePerformance === 'low' ? 25 : 30;
      const targetDpr =
        devicePerformance === 'low'
          ? 0.7
          : devicePerformance === 'medium'
          ? 0.85
          : 1;

      // Adjust pixel ratio based on FPS
      if (fps < minFpsThreshold) {
        slowFramesCounter.current += 1;
        fastFramesCounter.current = 0;

        // After 3 consecutive slow measurements, reduce quality
        if (slowFramesCounter.current >= 3 && currentDpr.current > 0.5) {
          currentDpr.current = Math.max(currentDpr.current - 0.1, 0.5);
          gl.setPixelRatio(currentDpr.current * window.devicePixelRatio);
          console.log(
            `Reducing pixel ratio to: ${currentDpr.current.toFixed(1)}`
          );
          slowFramesCounter.current = 0;
        }
      } else if (fps > 50 && currentDpr.current < targetDpr) {
        fastFramesCounter.current += 1;
        slowFramesCounter.current = 0;

        // After 5 consecutive fast measurements, increase quality
        if (fastFramesCounter.current >= 5) {
          currentDpr.current = Math.min(currentDpr.current + 0.1, targetDpr);
          gl.setPixelRatio(currentDpr.current * window.devicePixelRatio);
          console.log(
            `Increasing pixel ratio to: ${currentDpr.current.toFixed(1)}`
          );
          fastFramesCounter.current = 0;
        }
      }
    }
  });

  return null;
}
