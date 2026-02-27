import { Canvas } from '@react-three/fiber';
import { NetworkUniverse } from './NetworkUniverse';
import './App.css';

function App() {
  return (
    <div className="canvas-container" style={{ width: '100vw', height: '100vh', background: '#000' }}>
      <Canvas camera={{ position: [0, 0, 15] }}>
        <ambientLight intensity={0.5} />
        <NetworkUniverse />
      </Canvas>
    </div>
  );
}

export default App;
