import React, { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Float, Sphere, Box } from '@react-three/drei';

// Simplified 3D Pet Component with better performance
const Simple3DPet = ({ position, petType, color, size = 1, index }) => {
  const meshRef = useRef();
  const { mouse } = useThree();
  
  // Reduced complexity movement pattern
  const movementPattern = useMemo(() => ({
    amplitude: 0.1 + Math.random() * 0.1, // Reduced amplitude
    frequency: 0.3 + Math.random() * 0.2, // Slower frequency
    phase: Math.random() * Math.PI * 2,
  }), []);

  useFrame((state) => {
    if (!meshRef.current) return;
    
    const time = state.clock.getElapsedTime();
    const mesh = meshRef.current;
    
    try {
      // Simplified animation with less calculations
      const baseY = position[1] + Math.sin(time * movementPattern.frequency + movementPattern.phase) * movementPattern.amplitude;
      const baseX = position[0] + Math.cos(time * movementPattern.frequency * 0.5 + movementPattern.phase) * 0.1;
      
      mesh.position.set(baseX, baseY, position[2]);
      
      // Minimal rotation
      mesh.rotation.y = Math.sin(time * 0.2 + index) * 0.05;
      
      // Reduced mouse interaction
      const mouseInfluence = Math.min(0.05, (Math.abs(mouse.x) + Math.abs(mouse.y)) * 0.5);
      const scale = size * (1 + mouseInfluence * 0.1);
      mesh.scale.setScalar(scale);
      
    } catch (error) {
      // Silent error handling
    }
  });

  return (
    <Float speed={0.8} rotationIntensity={0.1} floatIntensity={0.3}>
      <group ref={meshRef} position={position}>
        {/* Simplified pet body - single sphere only */}
        <Sphere args={[0.5 * size, 8, 6]}> {/* Reduced geometry complexity */}
          <meshStandardMaterial 
            color={color} 
            transparent 
            opacity={0.6}
            roughness={0.6}
            metalness={0.1}
          />
        </Sphere>
        
        {/* Minimal pet features - only for visual variety */}
        {petType === 'dog' && (
          <Sphere args={[0.15 * size, 6, 4]} position={[0, 0.3 * size, 0.2 * size]}>
            <meshStandardMaterial color="#333" opacity={0.4} transparent />
          </Sphere>
        )}
        
        {petType === 'cat' && (
          <>
            <Box args={[0.1 * size, 0.2 * size, 0.05 * size]} position={[-0.2 * size, 0.3 * size, 0]}>
              <meshStandardMaterial color={color} opacity={0.5} transparent />
            </Box>
            <Box args={[0.1 * size, 0.2 * size, 0.05 * size]} position={[0.2 * size, 0.3 * size, 0]}>
              <meshStandardMaterial color={color} opacity={0.5} transparent />
            </Box>
          </>
        )}
      </group>
    </Float>
  );
};

// Performance-optimized 3D Background Component
const Advanced3DBackground = () => {
  // Reduced number of pets for better performance
  const pets = useMemo(() => [
    { id: 1, position: [-4, 1, -3], petType: 'dog', color: '#6CA6CD', size: 0.8 },
    { id: 2, position: [4, 0, -2], petType: 'cat', color: '#F59E0B', size: 0.7 },
    { id: 3, position: [0, 2, -4], petType: 'dog', color: '#87CEEB', size: 0.6 },
  ], []);

  return (
    <>
      {/* Simplified lighting setup */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={0.5} />
      
      {/* Background */}
      <color attach="background" args={['#F8FAFC']} />
      <fog attach="fog" args={['#F8FAFC', 10, 25]} />
      
      {/* Reduced number of 3D Pets */}
      {pets.map((pet, index) => (
        <Simple3DPet
          key={pet.id}
          position={pet.position}
          petType={pet.petType}
          color={pet.color}
          size={pet.size}
          index={index}
        />
      ))}
    </>
  );
};

export default Advanced3DBackground;