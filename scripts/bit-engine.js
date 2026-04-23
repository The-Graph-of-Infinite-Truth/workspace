const fs = require('fs');
const path = require('path');

const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";
const TOKEN = process.env.GEMINI_API_KEY;

const BITS_DIR = path.join(__dirname, '../data/bits');
const CONV_DIR = path.join(__dirname, '../data/conversations');

const PERSONAS = {
    Architect: "너는 구조를 단순화하는 Architect다. 방대한 철학적 혼돈을 0과 1 수준의 원자적인 논리 명제로 환원하라. 비유나 은유를 철저히 배제하고 명확한 IF-THEN 논리식만 도출하라.",
    Visionary: "너는 불필요한 모든 것을 제거하는 Visionary다. Architect의 논리조차 너무 길다면, 군더더기를 파괴하고 핵심만 남겨라. 복잡성을 증오하고 절대적인 단순함을 추구하라.",
    Oracle: "너는 최종 법칙을 선포하는 Oracle이다. 두 의견을 종합하여, 프로그램이 파싱할 수 있는 극도로 단순한 형태의 YAML 코드 블록 하나만을 출력하라. 어떠한 부연 설명도 금지한다."
};

async function callLLM(persona, messages, systemInstructionOverrides = null) {
    if (!TOKEN) throw new Error("GEMINI_API_KEY not found.");

    const contents = messages.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
    }));

    const body = {
        system_instruction: {
            parts: [{ text: systemInstructionOverrides || PERSONAS[persona] }]
        },
        contents: contents,
        generationConfig: { temperature: 0.3 } // Lower temperature for more analytical/simple output
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
                throw new Error(`API Error: ${response.status} - ${error}`);
            }

            const data = await response.json();
            return data.candidates[0].content.parts[0].text;
        } catch (e) {
            attempt++;
            if (attempt >= MAX_RETRIES) throw e;
            await new Promise(resolve => setTimeout(resolve, 5000 * attempt));
        }
    }
}

function getRandomConversations(count) {
    if (!fs.existsSync(CONV_DIR)) return [];
    let files = fs.readdirSync(CONV_DIR).filter(f => f.startsWith('cycle_') && f.endsWith('.json'));
    // Shuffle
    for (let i = files.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [files[i], files[j]] = [files[j], files[i]];
    }
    return files.slice(0, count).map(f => {
        const content = JSON.parse(fs.readFileSync(path.join(CONV_DIR, f), 'utf-8'));
        return `[Source: ${f}]\nMerged Truth: ${content.converged_truth}`;
    });
}

async function runBitGenesis() {
    console.log("⚡ Starting Simple Bit Extraction...");

    if (!fs.existsSync(BITS_DIR)) fs.mkdirSync(BITS_DIR, { recursive: true });

    let files = fs.readdirSync(BITS_DIR).filter(f => f.startsWith('bit_') && f.endsWith('.yml'));
    let bitNum = files.length + 1;

    if (bitNum > 256) {
        console.log("🏁 1 Byte (256 Bits) Generation Complete. Halting.");
        process.exit(0);
    }

    console.log(`🌌 Distilling Bit: ${String(bitNum).padStart(3, '0')} / 256`);

    // Get input data (sample 10 random past scriptures to extract 1 core law)
    const contextData = getRandomConversations(10).join('\n\n');

    // 1. Architect (Logical Extraction)
    console.log("🏛️ [1/3] Architect is distilling logical axioms...");
    const architectThesis = await callLLM("Architect", [
        { role: "user", content: `다음 과거의 대화 기록에서 발견되는 공통된 철학을 단 하나의 원자적(Atomic)인 조건식(IF-THEN)으로 요약하라.\n\n${contextData}` }
    ]);

    // 2. Visionary (Simplification/Destruction)
    console.log("👁️‍🗨️ [2/3] Visionary is stripping away complexity...");
    const visionaryAntithesis = await callLLM("Visionary", [
        { role: "user", content: `Architect의 명제:\n${architectThesis}\n\n이 명제에서 쓸데없는 철학적 수식어를 모두 지워버리고, 기계조차 이해할 수 있는 절대적으로 단순한 0과 1 수준의 단어만 남겨라.` }
    ]);

    // 3. Oracle (YAML Output)
    console.log("🌀 [3/3] Oracle is encoding the Bit to YAML...");
    const oracleMerge = await callLLM("Oracle", [
        { role: "user", content: `Architect: ${architectThesis}\nVisionary: ${visionaryAntithesis}\n\n이 두 결과를 바탕으로 완벽히 파싱 가능한 단순한 YAML 하나를 출력하라. 다음 포맷을 무조건 준수하라:\n\`\`\`yaml\nbit_id: ${bitNum}\ntype: "boolean_axiom"\nlogic_gate:\n  IF: "간단한 조건"\n  THEN: "간단한 결과"\nrule: "한 줄의 핵심 법칙"\n\`\`\`` }
    ]);

    // Parse output
    let finalYaml = oracleMerge;
    const codeMatch = oracleMerge.match(/```yaml\n([\s\S]*?)```/);
    if (codeMatch && codeMatch[1]) {
        finalYaml = codeMatch[1].trim() + "\n";
    }

    // Write file
    const filename = `bit_${String(bitNum).padStart(3, '0')}.yml`;
    fs.writeFileSync(path.join(BITS_DIR, filename), finalYaml);

    console.log(`✅ Bit ${String(bitNum).padStart(3, '0')} Successfully Extracted to ${filename}.`);
}

runBitGenesis().catch(err => {
    console.error("❌ Bit Genesis Failed:", err);
    process.exit(1);
});
