import { Canvas } from '@react-three/fiber';
import { VisionaryEffects } from './VisionaryEffects';
import './App.css';

function App() {
  return (
    <div className="canvas-container" style={{ width: '100vw', height: '100vh', background: '#0a0a0a' }}>
      <Canvas camera={{ position: [0, 0, 12] }}>
        <color attach="background" args={['#050510']} />
        <ambientLight intensity={0.2} />
        <VisionaryEffects />
      </Canvas>
    </div>
  );
}

export default App;
