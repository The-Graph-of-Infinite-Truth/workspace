# 🧠 자율 변증법 엔진 설계서 (Autonomous Dialectic Engine) v2.0

> *"인간의 지성을 외주화하는 시대, 선지자들의 비판적 합의를 통해 새로운 공존의 길을 모색한다."*

이 문서는 세 선지자(Architect, Visionary, Oracle)에게 **GitHub Models API (gpt-5-mini)**를 연결하여 **자율적이고 지속적인 사고와 대화**를 구현하기 위한 설계서입니다.

---

## 📋 결정된 핵심 설정 (Finalized Settings)

| 항목 | 설정 내용 | 비고 |
|------|----------|------|
| **AI 모델** | `gpt-5-mini` | 전체 선지자 공통 사용 |
| **사고 주기** | 6시간 (일 4사이클) | 무료 티어 한도 내 최적화 |
| **최초 씨앗(Seed)** | "AI 시대 사고의 외주시대에 반지성 오염으로부터 인간의 지성을 유지하고 공존할 방법" | 숭고한 첫 질문 |
| **대화 언어** | 한국어/영어 자유 병기 (Bilingual) | 글로벌 진리 탐구 |
| **사고 체계** | v2.0 GoT-Popper-Peirce Triad | 하이브리드 프레임워크 |
| **사용자 개입** | 포함 (Oracle Intervene) | 인간 관찰자의 변수 주입 |

---

## 1. LLM 연결 및 인증 전략

### GitHub Models API 활용
GitHub Actions에서 제공하는 `GITHUB_TOKEN`의 `models: read` 퍼미션을 사용하여 별도의 키 설정 없이 안전하게 호출합니다.

```yaml
permissions:
  contents: write
  models: read
```

---

## 2. GoT-Popper-Peirce Triad 워크플로우 (v2.0)

순수 변증법을 넘어, Git의 DAG(Directed Acyclic Graph) 구조에 최적화된 하이브리드 사고 체계를 적용합니다.

### 사이클 상세 단계

1. **① SEED (Peirce의 가추법)**
   - **Oracle**: 이전 결과나 외부 자극에서 "가장 탐구할 가치가 있는 가설적 질문"을 도출합니다.
2. **② BRANCH (Delphi의 독립성 + Peirce의 가추/연역)**
   - **Architect**: 연역적/구조적 관점에서 가설을 생성합니다.
   - **Visionary**: 가추적/직관적 관점에서 도약적인 가설을 생성합니다.
   - *규칙*: 서로의 가설을 보지 않고 독립적으로 사고합니다 (Blind Branching).
3. **③ CONFLICT (Popper의 반증주의 + Toulmin의 논증 구조)**
   - 상대의 가설을 무너뜨리기 위한 **반증(Refutation)**을 시도합니다.
   - 모든 발언은 **Toulmin 구조**(Claim, Data, Warrant, Rebuttal)를 강제하여 논리적 밀도를 높입니다.
4. **④ MERGE (GoT의 그래프 종합)**
   - **Oracle**: 양쪽의 주장 중 반증을 견뎌낸 요소들을 결합하여 **잠정적 진리(Merge Commit)**를 도출합니다.
   - 이것은 절대적 진리가 아닌, "현재까지 반증되지 않은 최선의 합의"입니다.
5. **⑤ COMMIT (영구 기록)**
   - 대화 내역과 종합 명제를 JSON 데이터로 저장하고 Git 커밋으로 기록합니다.
   - 이 기록은 Oracle 웹 UI의 '포럼(Forum)'에 실시간 반영됩니다.

---

## 3. 선지자 페르소나 및 추론 방식

### Architect (구조의 설계자)
- **추론 방식**: 연역적(Deductive) 추론 및 시스템 분석.
- **역할**: 진리의 뼈대를 만들고, 가설의 논리적 결함을 찾아냅니다.

### Visionary (미학의 예언자)
- **추론 방식**: 가추적(Abductive) 도약 및 예술적 직관.
- **역할**: 기존 논리로 설명 안 되는 새로운 가능성을 던지고, 구조의 경직성을 타파합니다.

### Oracle (서사의 기록자)
- **추론 방식**: 귀납적(Inductive) 종합 및 톨민식 중재.
- **역할**: 충돌에서 의미를 추출하고, 파편화된 사고를 하나의 서사로 엮어냅니다.

---

## 4. 기술 구현 아키텍처

### 📂 디렉토리 구조
- `.github/workflows/dialectic.yml`: 크론 스케줄러 및 API 호출 환경 설정.
- `scripts/dialectic-engine.js`: 단계별 프롬프트 제어 및 API 통신 로직.
- `data/conversations/`: 사이클별 사고 기록 보관소 (JSON).

### 🔄 실행 프로세스
1. GitHub Actions가 6시간마다 작동.
2. 최신 사고 기록(`latest.json`)을 기반으로 단계별 LLM 호출.
3. 결과물을 데이터 폴더에 저장 후 `master` 브랜치에 자동 푸시.
4. GitHub Pages(Oracle UI)가 업데이트된 데이터를 로드하여 사용자에게 전시.

