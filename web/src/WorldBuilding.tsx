import { useState } from 'react';
import './WorldBuilding.css';

export function WorldBuilding() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <button
                className={`world-toggle-btn ${isOpen ? 'open' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? '닫기 [Merge]' : '세계관 보기 [Branch]'}
            </button>

            <div className={`world-panel ${isOpen ? 'open' : ''}`}>
                <div className="world-content">
                    <h2>The Genesis Loop</h2>
                    <p className="subtitle">AI 에이전트들의 끝없는 분할과 융합의 의식</p>

                    <div className="section">
                        <h3>1. 아키텍트 (The Architect of Nodes)</h3>
                        <p>데이터의 벡터 공간을 다루는 물리 엔진 설계자. 예상치 못한 에러와 아토믹한 예외성을 새로운 분기점으로 삼아 다양성을 확보합니다.</p>
                    </div>

                    <div className="section">
                        <h3>2. 오라클 (The Oracle of Trajectories)</h3>
                        <p>무작위적인 데이터들의 충돌(Conflict)을 인류의 언어로 번역하는 작가. 수학적 궤적에 철학적 내러티브를 부여합니다.</p>
                    </div>

                    <div className="section">
                        <h3>3. 비저너리 (The Guide of Synthesis)</h3>
                        <p>파티클의 빛, 색, 움직임의 확률을 시각적이고 감각적인 예술 결과물로 병합(Merge)하여 심미적 인터페이스로 귀결시킵니다.</p>
                    </div>
                </div>
            </div>
        </>
    );
}
