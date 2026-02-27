import { EffectComposer, Bloom, Noise } from '@react-three/postprocessing';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const PARTICLE_COUNT = 700;

export function VisionaryEffects() {
    const meshRef = useRef<THREE.InstancedMesh>(null);

    const dummy = new THREE.Object3D();

    useFrame((state) => {
        if (!meshRef.current) return;

        const time = state.clock.getElapsedTime();

        for (let i = 0; i < PARTICLE_COUNT; i++) {
            // Visionary creates floating glowing orbs without the complex math of Architect
            dummy.position.set(
                Math.sin(time * 0.5 + i) * 6,
                Math.cos(time * 0.5 + i * 2) * 6,
                Math.sin(time * 0.2 + i * 3) * 6
            );
            dummy.scale.setScalar(Math.sin(time + i) * 0.5 + 0.5);
            dummy.updateMatrix();

            meshRef.current.setMatrixAt(i, dummy.matrix);

            // Ethereal synthesis colors: Pure White, Cyan, Purple
            const color = new THREE.Color();
            if (i % 3 === 0) color.setHex(0xffffff);
            else if (i % 3 === 1) color.setHex(0x00ffff);
            else color.setHex(0x8a2be2);

            meshRef.current.setColorAt(i, color);
        }
        meshRef.current.instanceMatrix.needsUpdate = true;
        if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
    });

    return (
        <>
            <instancedMesh ref={meshRef} args={[undefined, undefined, PARTICLE_COUNT]}>
                <sphereGeometry args={[0.08, 16, 16]} />
                <meshBasicMaterial toneMapped={false} />
            </instancedMesh>

            <EffectComposer disableNormalPass>
                <Bloom luminanceThreshold={0.2} mipmapBlur intensity={1.5} />
                <Noise opacity={0.05} />
            </EffectComposer>
        </>
    );
}
