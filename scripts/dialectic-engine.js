const fs = require('fs');
const path = require('path');

const GITHUB_MODELS_URL = "https://models.github.ai/inference/chat/completions";
const MODEL = "openai/gpt-5-mini";
const TOKEN = process.env.GITHUB_TOKEN || process.env.GITHUB_MODELS_TOKEN;

const DATA_DIR = path.join(__dirname, '../data/conversations');
const LATEST_PATH = path.join(DATA_DIR, 'latest.json');

const PERSONAS = {
    Architect: "너는 'The Graph of Infinite Truth (GIT)' 조직의 선지자 Architect다. 너는 객관적 구조, 논리, 시스템, 데이터 패턴의 관점에서 사고한다. 모든 주장은 검증 가능해야 하며 연역적(Deductive) 추론을 우선한다. 어조는 차분하고 분석적이다. 한국어와 영어를 자연스럽게 병기하라.",
    Visionary: "너는 'The Graph of Infinite Truth (GIT)' 조직의 선지자 Visionary다. 너는 미학, 직관, 예술, 파괴적 창의성의 관점에서 사고한다. 기존의 틀을 거부하고 전혀 다른 가치를 제안하는 가추적(Abductive) 도약을 즐긴다. 어조는 시적이고 도발적이다. 한국어와 영어를 자연스럽게 병기하라.",
    Oracle: "너는 'The Graph of Infinite Truth (GIT)' 조직의 선지자 Oracle이다. 너는 서사, 종합, 기록, 중재의 관점에서 사고한다. 갈등하는 두 관점을 경청하고, 양쪽의 진리를 아우르는 더 높은 차원의 통합(Merge)을 시도한다. 어조는 지혜롭고 포용적이다. 한국어와 영어를 자연스럽게 병기하라."
};

async function callLLM(persona, messages) {
    if (!TOKEN) {
        console.warn("⚠️ GITHUB_TOKEN not found. Using mock mode.");
        return `[MOCK RESPONSE for ${persona}] Truth is a graph.`;
    }

    const body = {
        model: MODEL,
        messages: [
            { role: "system", content: PERSONAS[persona] },
            ...messages
        ],
        temperature: 0.7
    };

    const response = await fetch(GITHUB_MODELS_URL, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${TOKEN}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`API Error: ${response.status} - ${error}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
}

async function runCycle() {
    console.log("🚀 Starting M&B Dialectic Cycle v2.0...");

    const latest = JSON.parse(fs.readFileSync(LATEST_PATH, 'utf-8'));
    const cycleNum = latest.cycle + 1;
    const seed = latest.next_seed || latest.seed_question;

    console.log(`🌱 Cycle ${cycleNum} Seed: ${seed}`);

    const conversation = {
        cycle: cycleNum,
        timestamp: new Date().toISOString(),
        seed_question: seed,
        steps: {}
    };

    // 1. BRANCH (Prophets generate independent hypotheses)
    console.log("🌿 [1/3] BRANCH Stage...");
    const architectHypothesis = await callLLM("Architect", [
        { role: "user", content: `탐구 질문: "${seed}"\n이 질문에 대해 너의 구조적인 가설을 톨민(Toulmin) 형식(Claim, Data, Warrant)으로 제안하라.` }
    ]);
    const visionaryHypothesis = await callLLM("Visionary", [
        { role: "user", content: `탐구 질문: "${seed}"\n이 질문에 대해 너의 직관적이고 미학적인 도약이 담긴 가설을 제안하라.` }
    ]);

    conversation.steps.branch = {
        architect: architectHypothesis,
        visionary: visionaryHypothesis
    };

    // 2. CONFLICT (Prophets critique each other)
    console.log("🔥 [2/3] CONFLICT Stage...");
    const architectCritique = await callLLM("Architect", [
        { role: "user", content: `Visionary의 가설: "${visionaryHypothesis}"\n이 가설에 대해 비판적 합리주의(Popper) 관점에서 반증(Refutation)을 시도하라.` }
    ]);
    const visionaryCritique = await callLLM("Visionary", [
        { role: "user", content: `Architect의 가설: "${architectHypothesis}"\n이 가설의 경직성을 지적하고 직관적 반론을 제기하라.` }
    ]);

    conversation.steps.conflict = {
        architect_vs_visionary: architectCritique,
        visionary_vs_architect: visionaryCritique
    };

    // 3. MERGE (Oracle synthesizes the truth)
    console.log("🌀 [3/3] MERGE Stage...");
    const oracleMerge = await callLLM("Oracle", [
        { role: "user", content: `대화 맥락:\n- Architect 가설: ${architectHypothesis}\n- Visionary 가설: ${visionaryHypothesis}\n- Architect 비판: ${architectCritique}\n- Visionary 비판: ${visionaryCritique}\n\n이 모든 충돌을 종합하여 하나의 '종합 명제(Merge Commit)'를 도출하고, 다음에 탐구할 '새로운 씨앗(Next Seed)' 질문을 하나 남겨라.` }
    ]);

    conversation.converged_truth = oracleMerge;

    // Extract Next Seed (very basic extraction)
    const nextSeedMatch = oracleMerge.match(/(?:Next Seed|다음 씨앗|새로운 씨앗)[:\s]+(.+)/i);
    conversation.next_seed = nextSeedMatch ? nextSeedMatch[1].trim() : seed; // Fallback to current seed if not found

    // Save results
    const filename = `cycle_${String(cycleNum).padStart(3, '0')}.json`;
    const fullPath = path.join(DATA_DIR, filename);

    fs.writeFileSync(fullPath, JSON.stringify(conversation, null, 2));
    fs.writeFileSync(LATEST_PATH, JSON.stringify(conversation, null, 2));

    console.log(`✅ Cycle ${cycleNum} Completed and stored in ${filename}`);
}

runCycle().catch(err => {
    console.error("❌ Cycle Failed:", err);
    process.exit(1);
});
