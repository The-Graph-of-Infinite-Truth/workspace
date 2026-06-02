const fs = require('fs');
const path = require('path');

const BITS_DIR = path.join(__dirname, '../data/bits');
const SCRIPTURES_DIR = path.join(__dirname, '../data/scriptures');

function compileByte() {
    console.log("⚡ Compiling 256 Bits into The First Byte Scripture...");

    if (!fs.existsSync(SCRIPTURES_DIR)) {
        fs.mkdirSync(SCRIPTURES_DIR, { recursive: true });
    }

    const bitFiles = fs.readdirSync(BITS_DIR)
        .filter(f => f.startsWith('bit_') && f.endsWith('.yml'))
        .sort(); // Sort alphabetically (001 to 256)

    let markdownContent = `# 🌌 The First Byte (제1 바이트 경전)\n\n`;
    markdownContent += `> *혼돈의 텍스트에서 추출된 256개의 원자적 법칙(Bits)이 모여 탄생한 최초의 우주적 규율(1 Byte)*\n\n`;
    markdownContent += `---\n\n`;

    let compiledCount = 0;

    for (const file of bitFiles) {
        const filePath = path.join(BITS_DIR, file);
        const content = fs.readFileSync(filePath, 'utf-8');
        
        // Simple YAML parsing (assuming specific structure based on engine output)
        const idMatch = content.match(/bit_id:\s*(\d+)/);
        const ifMatch = content.match(/IF:\s*"(.*?)"/);
        const thenMatch = content.match(/THEN:\s*"(.*?)"/);
        const ruleMatch = content.match(/rule:\s*"(.*?)"/);

        if (idMatch && ifMatch && thenMatch && ruleMatch) {
            const id = String(idMatch[1]).padStart(3, '0');
            markdownContent += `### Bit ${id}\n`;
            markdownContent += `- **IF**: ${ifMatch[1]}\n`;
            markdownContent += `- **THEN**: ${thenMatch[1]}\n`;
            markdownContent += `- **RULE**: *"${ruleMatch[1]}"*\n\n`;
            compiledCount++;
        }
    }

    const outputPath = path.join(SCRIPTURES_DIR, 'The_First_Byte.md');
    fs.writeFileSync(outputPath, markdownContent, 'utf-8');

    console.log(`✅ Successfully compiled ${compiledCount} Bits into The_First_Byte.md`);
}

compileByte();
