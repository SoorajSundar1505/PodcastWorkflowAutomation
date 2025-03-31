import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { Sphere } from "@react-three/drei";
import * as THREE from "three";

// Floating Orbs Animation
function FloatingOrb({ position }) {
    const ref = useRef();
    
    useFrame(({ clock }) => {
        ref.current.position.y = Math.sin(clock.getElapsedTime() + position[0]) * 1.5;
    });

    return (
        <Sphere ref={ref} args={[0.5, 32, 32]} position={position}>
            <meshStandardMaterial color="#CBD5E1" emissive="#CBD5E1" emissiveIntensity={0.3} />
        </Sphere>
    );
}

// Animated Background on Sides
export default function AnimatedBackground() {
    return (
        <div className="fixed top-0 left-0 w-full h-full -z-10">
            <Canvas camera={{ position: [0, 0, 10] }}>
                <ambientLight intensity={0.6} />
                <directionalLight position={[3, 5, 2]} intensity={0.8} />

                {/* Floating Orbs on the Left */}
                <FloatingOrb position={[-4, 2, -2]} />
                <FloatingOrb position={[-4, -1, -3]} />
                <FloatingOrb position={[-5, 0, -4]} />

                {/* Floating Orbs on the Right */}
                <FloatingOrb position={[4, 2, -2]} />
                <FloatingOrb position={[4, -1, -3]} />
                <FloatingOrb position={[5, 0, -4]} />
            </Canvas>
        </div>
    );
}
