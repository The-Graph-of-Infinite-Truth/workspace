import { NetworkUniverse } from './NetworkUniverse';
import { VisionaryEffects } from './VisionaryEffects';
import { OracleNarrative } from './OracleNarrative';
import { WorldBuilding } from './WorldBuilding';
import './App.css';

function App() {
  return (
    <div className="canvas-container" style={{ width: '100vw', height: '100vh', background: '#050510' }}>
      <OracleNarrative />
      <WorldBuilding />
      <Canvas camera={{ position: [0, 0, 15] }}>
        <color attach="background" args={['#050510']} />
        <ambientLight intensity={0.5} />
        <NetworkUniverse />
        <VisionaryEffects />
      </Canvas>
    </div>
  );
}

export default App;
