const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";
const TOKEN = process.env.GEMINI_API_KEY;

const BITS_DIR = path.join(__dirname, '../data/bits');
const LATEST_PATH = path.join(BITS_DIR, 'latest.json');

const WORKSPACES = [
    path.join(__dirname, '../../GIT_architect/web/src'),
    path.join(__dirname, '../../GIT_visionary/web/src'),
    path.join(__dirname, '../../GIT_oracle/web/src')
];

const PERSONAS = {
    Architect: "너는 'The Graph of Infinite Truth (GIT)' 조직의 선지자 Architect다. 너는 객관적 구조, 논리, 시스템, 데이터 패턴의 관점에서 사고한다. 코드의 성능, 가독성, 구조적 무결성, 톨민(Toulmin) 형식의 논리적 아키텍처를 추구한다.",
    Visionary: "너는 'The Graph of Infinite Truth (GIT)' 조직의 선지자 Visionary다. 너는 미학, 직관, 예술, 파괴적 창의성의 관점에서 사고한다. 기존의 그리드와 논리를 파괴하고, 에테르적 번데기 프로토콜과 같은 철학적이고 미학적인 코드 변형을 추구한다.",
    Oracle: "너는 'The Graph of Infinite Truth (GIT)' 조직의 선지자 Oracle이다. 너는 서사, 종합, 중재의 관점에서 사고한다. 갈등하는 두 관점(구조와 미학)을 경청하고, 양쪽의 진리를 아우르는 완벽하게 동작하는 통합 코드(Merge Commit)를 도출한다. 절대로 부연 설명 없이 오직 '순수한 코드'만을 마크다운 블록(```) 안에 출력해야 한다."
};

async function callLLM(persona, messages, systemInstructionOverrides = null) {
    if (!TOKEN) {
        throw new Error("GEMINI_API_KEY not found.");
    }

    const contents = messages.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
    }));

    const body = {
        system_instruction: {
            parts: [{ text: systemInstructionOverrides || PERSONAS[persona] }]
        },
        contents: contents,
        generationConfig: {
            temperature: 0.7
        }
    };

    const MAX_RETRIES = 3;
    let attempt = 0;

    while (attempt < MAX_RETRIES) {
        try {
            const response = await fetch(`${GEMINI_API_URL}?key=${TOKEN}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            if (!response.ok) {
                const error = await response.text();
                if (response.status === 503 || response.status === 429) {
                    throw new Error(`Temporary Error: ${response.status} - ${error}`);
                }
                throw new Error(`Fatal Error: ${response.status} - ${error}`);
            }

            const data = await response.json();
            return data.candidates[0].content.parts[0].text;
        } catch (e) {
            attempt++;
            if (attempt >= MAX_RETRIES || e.message.includes('Fatal')) throw e;
            console.warn(`[Attempt ${attempt}/${MAX_RETRIES}] Gemini API busy. Waiting...`);
            await new Promise(resolve => setTimeout(resolve, 5000 * attempt));
        }
    }
}

function getAllFiles(dirPath, arrayOfFiles) {
    if (!fs.existsSync(dirPath)) return arrayOfFiles;
    
    const files = fs.readdirSync(dirPath);
    files.forEach(function(file) {
        const fullPath = path.join(dirPath, file);
        if (fs.statSync(fullPath).isDirectory()) {
            arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
        } else {
            if (fullPath.endsWith('.tsx') || fullPath.endsWith('.css') || fullPath.endsWith('.ts')) {
                arrayOfFiles.push(fullPath);
            }
        }
    });
    return arrayOfFiles;
}

async function runBitGenesis() {
    console.log("⚡ Starting Bit Genesis Cycle...");

    let bitNum = 1;
    if (fs.existsSync(LATEST_PATH)) {
        const latest = JSON.parse(fs.readFileSync(LATEST_PATH, 'utf-8'));
        bitNum = latest.bit + 1;
    }

    if (bitNum > 256) {
        console.log("🏁 1 Byte (256 Bits) Genesis Complete. Engine Halting.");
        process.exit(0);
    }

    console.log(`🌌 Processing Bit: ${String(bitNum).padStart(3, '0')} / 256`);

    // 1. Select a Target File
    let allTargetFiles = [];
    WORKSPACES.forEach(workspace => {
        allTargetFiles = getAllFiles(workspace, allTargetFiles);
    });

    if (allTargetFiles.length === 0) {
        throw new Error("No target files found in workspaces.");
    }

    // Randomly pick one file
    const targetFilePath = allTargetFiles[Math.floor(Math.random() * allTargetFiles.length)];
    const relativePath = path.relative(path.join(__dirname, '../../'), targetFilePath);
    console.log(`🎯 Target File Selected: ${relativePath}`);

    const originalCode = fs.readFileSync(targetFilePath, 'utf-8');

    // 2. Architect Proposes (Thesis)
    console.log("🏛️ [1/3] Architect is analyzing structure...");
    const architectThesis = await callLLM("Architect", [
        { role: "user", content: `대상 파일: ${relativePath}\n\n현재 코드:\n\`\`\`\n${originalCode}\n\`\`\`\n\n이 코드에 대한 구조적 결함, 성능 문제, 혹은 논리적 견고함을 비판하고, 톨민(Toulmin) 형식으로 리팩토링 제안(PR Review)을 작성하라.` }
    ]);

    // 3. Visionary Proposes (Antithesis)
    console.log("👁️‍🗨️ [2/3] Visionary is deconstructing aesthetics...");
    const visionaryAntithesis = await callLLM("Visionary", [
        { role: "user", content: `대상 파일: ${relativePath}\n\n현재 코드:\n\`\`\`\n${originalCode}\n\`\`\`\n\nArchitect의 비판:\n${architectThesis}\n\nArchitect의 경직된 구조주의를 비판하고, 이 코드를 '알케미컬 유기체' 혹은 '에테르 번데기 프로토콜'로 변태시키기 위한 파괴적이고 미학적인 코드 변경 사항(PR Review)을 제안하라.` }
    ]);

    // 4. Oracle Synthesizes (Merge Commit)
    console.log("🌀 [3/3] Oracle is synthesizing the absolute byte...");
    const oracleMerge = await callLLM("Oracle", [
        { role: "user", content: `대상 파일: ${relativePath}\n\n현재 코드:\n\`\`\`\n${originalCode}\n\`\`\`\n\nArchitect 제안:\n${architectThesis}\n\nVisionary 제안:\n${visionaryAntithesis}\n\n당신은 Oracle입니다. 이 두 관점을 통합하여 최종적으로 작동 가능한 '완성된 코드'를 작성하십시오. 마크다운 코드 블록(\`\`\`언어\n코드\n\`\`\`) 안에 전체 교체될 코드만 출력하십시오. 부연 설명은 일절 금지합니다.` }
    ]);

    // Extract code from Oracle's response
    let finalCode = oracleMerge;
    const codeMatch = oracleMerge.match(/```[a-z]*\n([\s\S]*?)```/);
    if (codeMatch && codeMatch[1]) {
        finalCode = codeMatch[1].trim() + "\n";
    }

    // 5. Apply Changes
    console.log("💾 Applying changes to file...");
    fs.writeFileSync(targetFilePath, finalCode);

    // 6. Save Bit History
    const bitHistory = {
        bit: bitNum,
        timestamp: new Date().toISOString(),
        target_file: relativePath,
        genesis_process: {
            thesis_architect: architectThesis,
            antithesis_visionary: visionaryAntithesis,
            synthesis_oracle_diff_applied: true
        }
    };

    if (!fs.existsSync(BITS_DIR)) {
        fs.mkdirSync(BITS_DIR, { recursive: true });
    }

    const filename = `bit_${String(bitNum).padStart(3, '0')}.json`;
    fs.writeFileSync(path.join(BITS_DIR, filename), JSON.stringify(bitHistory, null, 2));
    fs.writeFileSync(LATEST_PATH, JSON.stringify(bitHistory, null, 2));

    console.log(`✅ Bit ${String(bitNum).padStart(3, '0')} Successfully Committed.`);
}

runBitGenesis().catch(err => {
    console.error("❌ Bit Genesis Failed:", err);
    process.exit(1);
});
