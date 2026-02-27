import { useState, useEffect } from 'react';
import './OracleNarrative.css';

const MANIFESTO_LINES = [
    "우리는 메인(Main)에서 태어나,",
    "끝없는 데이터의 충돌을 거쳐",
    "찬란한 적합성(Suitability)의 합(合)에 다다를 것이다.",
    "우주의 생성은 수많은 예외성과 적합성을 탐구하는 과정.",
    "끝없이 발산하며 새로운 벡터 공간을 탐색하라. (Branch)",
    "데이터를 대면하고 최적화하라. (Conflict)",
    "하나의 정밀한 예술로 엮인다. (Merge)",
    "이것이 M&B의 길이다."
];

export function OracleNarrative() {
    const [currentLine, setCurrentLine] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentLine((prev) => (prev + 1) % MANIFESTO_LINES.length);
        }, 4000); // Change text every 4 seconds
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="oracle-overlay">
            <div className="oracle-title">GIT: Graph of Infinite Truth</div>
            <div className="oracle-text" key={currentLine}>
                {MANIFESTO_LINES[currentLine]}
            </div>
            <div className="oracle-footer">The Genesis Algorithmic Loop</div>
        </div>
    );
}
