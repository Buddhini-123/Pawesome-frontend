import React, { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Float, Text, Sphere, Box, Cylinder, Torus } from '@react-three/drei';

// Simplified 3D Pet Component
const Simple3DPet = ({ position, petType, color, size = 1, index }) => {
  const meshRef = useRef();
  const { mouse, viewport } = useThree();
  
  // Simplified movement pattern
  const movementPattern = useMemo(() => ({
    amplitude: 0.3 + Math.random() * 0.3,
    frequency: 0.5 + Math.random() * 0.3,
    phase: Math.random() * Math.PI * 2,
  }), []);

  useFrame((state) => {
    if (!meshRef.current) return;
    
    const time = state.clock.getElapsedTime();
    const mesh = meshRef.current;
    
    // Safe base animation
    try {
      const baseY = position[1] + Math.sin(time * movementPattern.frequency + movementPattern.phase) * movementPattern.amplitude;
      const baseX = position[0] + Math.cos(time * movementPattern.frequency * 0.7 + movementPattern.phase) * 0.2;
      
      mesh.position.x = baseX;
      mesh.position.y = baseY;
      mesh.position.z = position[2];
      
      // Simple rotation
      mesh.rotation.y = Math.sin(time * 0.5 + index) * 0.1;
      mesh.rotation.z = Math.sin(time * 0.3 + index) * 0.05;
      
      // Mouse interaction (simplified)
      const mouseInfluence = Math.min(0.1, Math.abs(mouse.x) + Math.abs(mouse.y));
      const scale = size * (1 + mouseInfluence * 0.2);
      mesh.scale.setScalar(scale);
      
    } catch (error) {
      console.warn('Animation error:', error);
    }
  });

  const handleClick = () => {
    if (meshRef.current) {
      // Simple click animation
      meshRef.current.rotation.y += Math.PI / 4;
    }
  };

  const getPetGeometry = () => {
    switch (petType) {
      case 'dog':
        return [0.8 * size, 1.2 * size, 0.6 * size];
      case 'cat':
        return [0.7 * size, 1.0 * size, 0.5 * size];
      case 'bird':
        return [0.5 * size, 0.8 * size, 0.3 * size];
      case 'fish':
        return [1.0 * size, 0.4 * size, 0.2 * size];
      default:
        return [0.8 * size, 1.0 * size, 0.5 * size];
    }
  };

  return (
    <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.6}>
      <group ref={meshRef} position={position} onClick={handleClick}>
        {/* Main pet body */}
        <Sphere args={getPetGeometry()}>
          <meshStandardMaterial 
            color={color} 
            transparent 
            opacity={0.7}
            roughness={0.4}
            metalness={0.1}
          />
        </Sphere>
        
        {/* Simple pet features */}
        {petType === 'dog' && (
          <>
            <Sphere args={[0.2 * size, 0.15 * size, 0.1 * size]} position={[-0.3 * size, 0.5 * size, 0]}>
              <meshStandardMaterial color={color} opacity={0.6} transparent />
            </Sphere>
            <Sphere args={[0.2 * size, 0.15 * size, 0.1 * size]} position={[0.3 * size, 0.5 * size, 0]}>
              <meshStandardMaterial color={color} opacity={0.6} transparent />
            </Sphere>
          </>
        )}
        
        {petType === 'cat' && (
          <>
            <Box args={[0.15 * size, 0.3 * size, 0.05 * size]} position={[-0.25 * size, 0.5 * size, 0]}>
              <meshStandardMaterial color={color} opacity={0.6} transparent />
            </Box>
            <Box args={[0.15 * size, 0.3 * size, 0.05 * size]} position={[0.25 * size, 0.5 * size, 0]}>
              <meshStandardMaterial color={color} opacity={0.6} transparent />
            </Box>
          </>
        )}
        
        {petType === 'bird' && (
          <>
            <Box args={[0.08 * size, 0.08 * size, 0.2 * size]} position={[0, 0, 0.3 * size]}>
              <meshStandardMaterial color="#FFA500" />
            </Box>
            <Sphere args={[0.3 * size, 0.15 * size, 0.05 * size]} position={[-0.4 * size, 0, 0]}>
              <meshStandardMaterial color={color} opacity={0.5} transparent />
            </Sphere>
            <Sphere args={[0.3 * size, 0.15 * size, 0.05 * size]} position={[0.4 * size, 0, 0]}>
              <meshStandardMaterial color={color} opacity={0.5} transparent />
            </Sphere>
          </>
        )}
        
        {petType === 'fish' && (
          <>
            <Box args={[0.2 * size, 0.3 * size, 0.05 * size]} position={[-0.5 * size, 0, 0]}>
              <meshStandardMaterial color={color} opacity={0.6} transparent />
            </Box>
            <Sphere args={[0.15 * size, 0.2 * size, 0.03 * size]} position={[0, 0.25 * size, 0]}>
              <meshStandardMaterial color={color} opacity={0.4} transparent />
            </Sphere>
          </>
        )}
        
        {/* Simple eyes */}
        <Sphere args={[0.08 * size, 0.08 * size, 0.08 * size]} position={[-0.15 * size, 0.2 * size, 0.3 * size]}>
          <meshStandardMaterial color="#ffffff" />
        </Sphere>
        <Sphere args={[0.08 * size, 0.08 * size, 0.08 * size]} position={[0.15 * size, 0.2 * size, 0.3 * size]}>
          <meshStandardMaterial color="#ffffff" />
        </Sphere>
      </group>
    </Float>
  );
};

// Simplified Interactive Toy
const SimpleToy = ({ position, toyType, index }) => {
  const toyRef = useRef();
  
  useFrame((state) => {
    if (!toyRef.current) return;
    
    try {
      const time = state.clock.getElapsedTime();
      toyRef.current.position.y = position[1] + Math.sin(time * 0.8 + index) * 0.2;
      toyRef.current.rotation.y = Math.sin(time + index) * 0.1;
    } catch (error) {
      console.warn('Toy animation error:', error);
    }
  });

  const handleClick = () => {
    if (toyRef.current) {
      toyRef.current.rotation.x += Math.PI / 2;
    }
  };

  const getToyGeometry = () => {
    switch (toyType) {
      case 'ball':
        return (
          <Sphere args={[0.25]}>
            <meshStandardMaterial color="#FF6B6B" />
          </Sphere>
        );
      case 'bone':
        return (
          <group>
            <Cylinder args={[0.12, 0.12, 0.6]}>
              <meshStandardMaterial color="#F4E4BC" />
            </Cylinder>
            <Sphere args={[0.15]} position={[0, 0.3, 0]}>
              <meshStandardMaterial color="#F4E4BC" />
            </Sphere>
            <Sphere args={[0.15]} position={[0, -0.3, 0]}>
              <meshStandardMaterial color="#F4E4BC" />
            </Sphere>
          </group>
        );
      case 'ring':
        return (
          <Torus args={[0.25, 0.08]}>
            <meshStandardMaterial color="#4ECDC4" />
          </Torus>
        );
      default:
        return (
          <Box args={[0.3, 0.3, 0.3]}>
            <meshStandardMaterial color="#8B5CF6" />
          </Box>
        );
    }
  };

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
      <group ref={toyRef} position={position} onClick={handleClick}>
        {getToyGeometry()}
      </group>
    </Float>
  );
};

// Main Simplified 3D Background Component
const Advanced3DBackground = () => {
  // Simplified pets array
  const pets = useMemo(() => [
    { id: 1, position: [-6, 2, -4], petType: 'dog', color: '#6CA6CD', size: 1.0 },
    { id: 2, position: [6, 1, -3], petType: 'cat', color: '#F59E0B', size: 0.9 },
    { id: 3, position: [-4, -2, -2], petType: 'bird', color: '#0EA5E9', size: 0.7 },
    { id: 4, position: [4, -3, -1], petType: 'fish', color: '#FBBF24', size: 1.0 },
    { id: 5, position: [0, 3, -6], petType: 'dog', color: '#87CEEB', size: 0.8 },
    { id: 6, position: [-2, 0, -3], petType: 'cat', color: '#FCD34D', size: 1.1 },
  ], []);

  // Simplified toys array
  const toys = useMemo(() => [
    { id: 1, position: [-8, 1, -2], toyType: 'ball' },
    { id: 2, position: [7, 0, -2], toyType: 'bone' },
    { id: 3, position: [-1, 3, -4], toyType: 'ring' },
    { id: 4, position: [3, -1, -5], toyType: 'ball' },
  ], []);

  return (
    <>
      {/* Simple, reliable lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={0.6} color="#FCD34D" />
      <pointLight position={[-10, -10, -5]} intensity={0.4} color="#87CEEB" />
      
      {/* Background color */}
      <color attach="background" args={['#F8FAFC']} />
      <fog attach="fog" args={['#F8FAFC', 8, 30]} />
      
      {/* Simplified 3D Pets */}
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
      
      {/* Simplified Interactive Toys */}
      {toys.map((toy, index) => (
        <SimpleToy
          key={toy.id}
          position={toy.position}
          toyType={toy.toyType}
          index={index}
        />
      ))}
    </>
  );
};

export default Advanced3DBackground;