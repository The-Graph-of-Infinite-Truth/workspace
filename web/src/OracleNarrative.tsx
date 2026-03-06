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
    const [propheticDiscourse, setPropheticDiscourse] = useState<any>(null);
    const bcRef = useRef<BroadcastChannel | null>(null);

    useEffect(() => {
        // Fetch the latest prophetic discourse from the serverless data folder
        const fetchDiscourse = async () => {
            try {
                // In production, data is at ../data/conversations/latest.json relative to GIT_oracle/index.html
                const response = await fetch('../data/conversations/latest.json');
                if (response.ok) {
                    const data = await response.json();
                    setPropheticDiscourse(data);
                }
            } catch (e) {
                console.error("Failed to fetch prophetic discourse", e);
            }
        };

        fetchDiscourse();
        const discourseInterval = setInterval(fetchDiscourse, 60000); // Check every minute

        bcRef.current = new BroadcastChannel('nexus');
        bcRef.current.onmessage = (event) => {
            if (event.data.agent && event.data.message) {
                setLogs(prev => {
                    const newLogs = [...prev, { id: Date.now() + Math.random(), agent: event.data.agent, message: event.data.message }];
                    return newLogs.slice(-6);
                });
            }
        };

        const interval = setInterval(() => {
            setCurrentLine((prev) => (prev + 1) % MANIFESTO_LINES.length);
        }, 6000);

        return () => {
            bcRef.current?.close();
            clearInterval(interval);
            clearInterval(discourseInterval);
        };
    }, []);

    /*
    const handleIntervene = () => {
        if (!bcRef.current) return;
        const msg = "Observer disrupts the local void.";
        bcRef.current.postMessage({ type: 'user_intervention', agent: 'User', message: msg });
        setLogs(prev => {
            const newLogs = [...prev, { id: Date.now(), agent: 'User', message: msg }];
            return newLogs.slice(-6);
        });
    };
    */

    return (
        <div className="oracle-overlay">
            <div className="oracle-title">GIT: Graph of Infinite Truth</div>
            <div className="oracle-text" key={currentLine}>
                {MANIFESTO_LINES[currentLine]}
            </div>

            <div className="oracle-forum">
                <div className="forum-title">Prophetic Discourse (Core Reasoning)</div>
                {propheticDiscourse ? (
                    <div className="discourse-content">
                        <div className="seed-q">Seed: {propheticDiscourse.seed_question}</div>
                        <div className="truth-summary">{propheticDiscourse.converged_truth || propheticDiscourse.summary}</div>
                    </div>
                ) : (
                    <div className="loading-discourse">Listening to the void...</div>
                )}

                <div className="forum-divider" style={{ borderTop: '1px solid rgba(255,255,255,0.1)', margin: '15px 0' }}></div>
                <div className="forum-title sub">Live Nexus Events</div>
                {logs.map(log => (
                    <div key={log.id} className={`forum-log ${log.agent.toLowerCase()}`}>
                        <span className="agent-name">[{log.agent}]</span> {log.message}
                    </div>
                ))}
            </div>

            {/* 
            <button className="intervene-btn" onClick={handleIntervene} style={{ pointerEvents: 'auto' }}>
                개입하기 (Intervene)
            </button> 
            */}

            <div className="oracle-footer">The Genesis Algorithmic Loop</div>
        </div>
    );
}
