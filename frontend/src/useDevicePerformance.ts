import { useState, useEffect } from 'react';

export type PerformanceLevel = 'low' | 'medium' | 'high';

export function useDevicePerformance() {
  // Rename the state variable to avoid conflict with global performance object
  const [performanceLevel, setPerformanceLevel] = useState<PerformanceLevel>('medium');
  
  useEffect(() => {
    // Check for signs of a high-resolution, potentially lower-performance device
    const isHighResolutionDisplay = () => {
      const ua = navigator.userAgent;
      
      // Surface Hub detection - large screen but lower performance
      const isSurfaceHub = 
        ua.includes('Surface Hub') || 
        window.innerWidth >= 3000 ||
        (window.devicePixelRatio > 1 && window.innerWidth > 1920);
      
      if (isSurfaceHub) return true;
      
      return false;
    };
    
    // Lower initial performance if on high-resolution display
    if (isHighResolutionDisplay()) {
      setPerformanceLevel('low');
    }
    
    // Perform an FPS test after a short delay
    const testFPS = setTimeout(() => {
      let frameCount = 0;
      // Use window.performance explicitly to avoid conflict
      let lastTime = window.performance.now();
      
      const checkFPS = () => {
        frameCount++;
        // Use window.performance explicitly to avoid conflict
        const now = window.performance.now();
        
        // After 1 second
        if (now - lastTime >= 1000) {
          const fps = frameCount;
          
          if (fps < 30) {
            setPerformanceLevel('low');
          } else if (fps < 50) {
            setPerformanceLevel('medium');
          } else {
            setPerformanceLevel('high');
          }
          
          // For debugging
          console.log(`Measured FPS: ${fps}, setting performance to: ${fps < 30 ? 'low' : fps < 50 ? 'medium' : 'high'}`);
        } else {
          requestAnimationFrame(checkFPS);
        }
      };
      
      requestAnimationFrame(checkFPS);
    }, 2000);
    
    return () => clearTimeout(testFPS);
  }, []);
  
  return performanceLevel;
}