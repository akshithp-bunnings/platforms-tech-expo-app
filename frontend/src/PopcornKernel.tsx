import * as THREE from 'three';
import { extend } from '@react-three/fiber';

// Create a custom popcorn kernel geometry
export class PopcornKernelGeometry extends THREE.BufferGeometry {
  constructor(radius = 1, detail = 2) {
    super();
    
    // Start with an icosahedron (roughly spherical)
    const baseGeometry = new THREE.IcosahedronGeometry(radius, detail);
    
    // Get vertex positions
    const positions = baseGeometry.getAttribute('position').array;
    
    // Modify vertices to create popcorn kernel shape
    for (let i = 0; i < positions.length; i += 3) {
      const x = positions[i];
      const y = positions[i + 1];
      const z = positions[i + 2];
      
      // Random bumps and irregularities
      const bump = (Math.sin(x * 8) + Math.cos(z * 8) + Math.sin(y * 5)) * 0.15;
      
      // Elongate in y direction slightly for kernel shape
      const scale = 1 + bump + (y > 0 ? 0.3 : 0);
      
      // Update positions
      positions[i] = x * scale;
      positions[i + 1] = y * scale * 1; // Stretch vertically
      positions[i + 2] = z * scale;
    }
    
    // Update normals
    baseGeometry.computeVertexNormals();
    
    // Copy attributes
    this.copy(baseGeometry);
  }
}

// Important: Register the geometry class with @react-three/fiber
extend({ PopcornKernelGeometry });