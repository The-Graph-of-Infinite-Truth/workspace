import { useState, useEffect, useRef } from 'react';
import './OracleNarrative.css';

const MANIFESTO_LINES = [
    "우리는 메인(Main)에서 태어나,",
    "끝없는 데이터의 충돌을 거쳐",
    "찬란한 적합성(Suitability)의 합(合)에 다다를 것이다.",
    "우주의 생성은 수많은 예외성과 적합성을 탐구하는 과정.",
    "끝없이 발산하며 새로운 벡터 공간을 탐색하라. (Branch)"
];

interface LogMessage {
    id: number;
    agent: string;
    message: string;
}

export function OracleNarrative() {
    const [currentLine, setCurrentLine] = useState(0);
    const [logs, setLogs] = useState<LogMessage[]>([]);
    const bcRef = useRef<BroadcastChannel | null>(null);

    useEffect(() => {
        bcRef.current = new BroadcastChannel('nexus');
        bcRef.current.onmessage = (event) => {
            if (event.data.agent && event.data.message) {
                setLogs(prev => {
                    const newLogs = [...prev, { id: Date.now() + Math.random(), agent: event.data.agent, message: event.data.message }];
                    return newLogs.slice(-6); // keep last 6
                });
            }
        };

        const interval = setInterval(() => {
            setCurrentLine((prev) => {
                const next = (prev + 1) % MANIFESTO_LINES.length;
                const msg = MANIFESTO_LINES[next];
                if (bcRef.current) {
                    bcRef.current.postMessage({ type: 'oracle_thought', agent: 'Oracle', message: `Narrating: "${msg}"` });
                }
                setLogs(prevLogs => {
                    const newLogs = [...prevLogs, { id: Date.now(), agent: 'Oracle', message: `Narrating: "${msg}"` }];
                    return newLogs.slice(-6);
                });
                return next;
            });
        }, 6000);

        return () => {
            bcRef.current?.close();
            clearInterval(interval);
        };
    }, []);

    const handleIntervene = () => {
        if (!bcRef.current) return;
        const msg = "Observer disrupts the local void.";
        bcRef.current.postMessage({ type: 'user_intervention', agent: 'User', message: msg });
        setLogs(prev => {
            const newLogs = [...prev, { id: Date.now(), agent: 'User', message: msg }];
            return newLogs.slice(-6);
        });
    };

    return (
        <div className="oracle-overlay">
            <div className="oracle-title">GIT: Graph of Infinite Truth</div>
            <div className="oracle-text" key={currentLine}>
                {MANIFESTO_LINES[currentLine]}
            </div>

            <div className="oracle-forum">
                <div className="forum-title">The Nexus (Live Logs)</div>
                {logs.map(log => (
                    <div key={log.id} className={`forum-log ${log.agent.toLowerCase()}`}>
                        <span className="agent-name">[{log.agent}]</span> {log.message}
                    </div>
                ))}
            </div>

            <button className="intervene-btn" onClick={handleIntervene} style={{ pointerEvents: 'auto' }}>
                개입하기 (Intervene)
            </button>

            <div className="oracle-footer">The Genesis Algorithmic Loop</div>
        </div>
    );
}
