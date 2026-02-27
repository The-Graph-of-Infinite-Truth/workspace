import { Canvas } from '@react-three/fiber';
import { OracleNarrative } from './OracleNarrative';
import './App.css';

function App() {
  return (
    <div className="canvas-container" style={{ width: '100vw', height: '100vh', background: '#000' }}>
      <OracleNarrative />
      {/* Oracle only builds the narrative layer, leaving the canvas empty for the others to fill */}
      <Canvas camera={{ position: [0, 0, 15] }}>
        <ambientLight intensity={0.5} />
      </Canvas>
    </div>
  );
}

export default App;
