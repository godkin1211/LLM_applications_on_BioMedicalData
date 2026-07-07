import fs from "node:fs/promises";
import path from "node:path";
import { Presentation, PresentationFile } from "@oai/artifact-tool";

const SCRIPT_DIR = path.dirname(new URL(import.meta.url).pathname);
const REPO_ROOT = process.env.REPO_ROOT ? path.resolve(process.env.REPO_ROOT) : path.resolve(SCRIPT_DIR, "../..");
const OUT_DIR = path.join(REPO_ROOT, "previews", "lesson-08-spec-driven-development-biomedical-tools");
const FINAL_PPTX = path.join(REPO_ROOT, "slides", "lesson-08-spec-driven-development-biomedical-tools.pptx");

const W = 1280;
const H = 720;
const TOTAL = 36;
const frame = { left: 76, top: 58, width: 1128, height: 594 };

const C = {
  bg: "#F7F8F6",
  ink: "#17202A",
  secondary: "#5C6670",
  muted: "#8C98A1",
  teal: "#0E8F88",
  tealLight: "#EAF8F6",
  indigo: "#3446A8",
  indigoLight: "#EEF1FF",
  amber: "#D89A16",
  amberLight: "#FFF8E8",
  coral: "#C85A4A",
  coralLight: "#FDEDEA",
  green: "#438D4A",
  greenLight: "#EDF8EE",
  violet: "#6B4AA0",
  violetLight: "#F1ECFA",
  line: "#D4DADD",
  white: "#FFFFFF",
  dark: "#17202A",
  codeBg: "#202A33",
};

const FONT = "PingFang TC";
const EN_FONT = "Aptos";
const MONO = "Menlo";

async function writeBlob(filePath, blob) {
  await fs.writeFile(filePath, new Uint8Array(await blob.arrayBuffer()));
}

function addText(slide, name, text, position, style = {}) {
  const shape = slide.shapes.add({
    geometry: "textbox",
    name,
    position,
    fill: "none",
    line: { style: "solid", fill: "none", width: 0 },
  });
  shape.text = text;
  shape.text.style = {
    fontSize: style.fontSize ?? 22,
    bold: style.bold ?? false,
    color: style.color ?? C.ink,
    alignment: style.alignment ?? "left",
    verticalAlignment: style.verticalAlignment ?? "top",
    lineSpacing: style.lineSpacing ?? 1.08,
    typeface: style.typeface ?? FONT,
    insets: style.insets ?? { top: 0, right: 0, bottom: 0, left: 0 },
  };
  return shape;
}

function addSurface(slide, name, x, y, w, h, fill = C.white, line = C.line, radius = 8) {
  return slide.shapes.add({
    geometry: "roundRect",
    name,
    position: { left: x, top: y, width: w, height: h },
    fill,
    line: { style: "solid", fill: line, width: 1 },
    borderRadius: radius,
  });
}

function addEyebrow(slide, text, color = C.indigo) {
  addText(slide, "eyebrow", text, { left: frame.left, top: frame.top, width: 860, height: 30 }, {
    fontSize: 15,
    bold: true,
    color,
    typeface: EN_FONT,
  });
}

function addTitle(slide, text, y = 96, size = 36, width = 1060) {
  addText(slide, "title", text, { left: frame.left, top: y, width, height: 96 }, {
    fontSize: size,
    bold: true,
    color: C.ink,
    lineSpacing: 0.98,
  });
}

function addFooter(slide, n, dark = false) {
  addText(slide, dark ? "footer-dark" : "footer", `Spec-driven development for biomedical tools  |  ${n}/${TOTAL}`, {
    left: frame.left,
    top: 668,
    width: 560,
    height: 22,
  }, { fontSize: 12, color: dark ? "#B7C0C7" : C.secondary, typeface: EN_FONT });
}

function addBulletList(slide, name, items, position, options = {}) {
  const shape = slide.shapes.add({
    geometry: "textbox",
    name,
    position,
    fill: "none",
    line: { style: "solid", fill: "none", width: 0 },
  });
  shape.text.set(items.map((item) => ({
    bulletCharacter: options.bulletCharacter ?? "•",
    marginLeft: options.marginLeft ?? 24,
    indent: options.indent ?? -12,
    spaceAfter: options.spaceAfter ?? 8,
    runs: [item],
  })));
  shape.text.style = {
    fontSize: options.fontSize ?? 22,
    color: options.color ?? C.ink,
    lineSpacing: options.lineSpacing ?? 1.08,
    typeface: options.typeface ?? FONT,
    insets: { top: 0, right: 0, bottom: 0, left: 0 },
  };
  return shape;
}

function addCode(slide, name, code, position, fontSize = 13) {
  addSurface(slide, `${name}-box`, position.left, position.top, position.width, position.height, C.codeBg, "#131A21", 8);
  addText(slide, name, code, {
    left: position.left + 18,
    top: position.top + 15,
    width: position.width - 36,
    height: position.height - 30,
  }, {
    fontSize,
    color: "#F3F7FA",
    typeface: MONO,
    lineSpacing: 1.06,
  });
}

function notes(slide, text) {
  slide.speakerNotes.textFrame.setText(text);
  slide.speakerNotes.setVisible(true);
}

function baseSlide(p, n, eyebrow, title, color = C.indigo) {
  const slide = p.slides.add();
  slide.background.fill = C.bg;
  addEyebrow(slide, eyebrow, color);
  addTitle(slide, title);
  addFooter(slide, n);
  return slide;
}

function sectionSlide(p, n, eyebrow, title, subtitle, color = C.teal) {
  const slide = p.slides.add();
  slide.background.fill = color === C.coral ? C.coralLight : color === C.amber ? C.amberLight : color === C.green ? C.greenLight : color === C.violet ? C.violetLight : C.indigoLight;
  addEyebrow(slide, eyebrow, color);
  addText(slide, "section-title", title, { left: 84, top: 206, width: 1000, height: 118 }, {
    fontSize: 42,
    bold: true,
    color,
    lineSpacing: 1.02,
  });
  addText(slide, "section-subtitle", subtitle, { left: 88, top: 346, width: 910, height: 78 }, {
    fontSize: 24,
    color: C.ink,
    lineSpacing: 1.12,
  });
  addFooter(slide, n);
  notes(slide, subtitle);
}

function sourceLine(slide, text) {
  addText(slide, "source", text, { left: 720, top: 668, width: 470, height: 22 }, {
    fontSize: 11,
    color: C.muted,
    typeface: EN_FONT,
    alignment: "right",
  });
}

function conceptSlide(p, n, eyebrow, title, bullets, rightTitle, rightBullets, color = C.indigo) {
  const slide = baseSlide(p, n, eyebrow, title, color);
  addBulletList(slide, "left-bullets", bullets, { left: 92, top: 214, width: 560, height: 328 }, { fontSize: 22, spaceAfter: 12 });
  addSurface(slide, "right-box", 706, 190, 410, 330, color === C.coral ? C.coralLight : color === C.amber ? C.amberLight : color === C.green ? C.greenLight : color === C.violet ? C.violetLight : C.indigoLight, color);
  addText(slide, "right-title", rightTitle, { left: 742, top: 226, width: 330, height: 38 }, { fontSize: 25, bold: true, color });
  addBulletList(slide, "right-bullets", rightBullets, { left: 746, top: 292, width: 316, height: 194 }, { fontSize: 20, spaceAfter: 12 });
  notes(slide, `${title}\n\n${bullets.join(" ")} ${rightTitle}: ${rightBullets.join(" ")}`);
  return slide;
}

function threeCardsSlide(p, n, eyebrow, title, cards, color = C.teal) {
  const slide = baseSlide(p, n, eyebrow, title, color);
  cards.forEach((card, i) => {
    const x = 92 + i * 374;
    addSurface(slide, `card-${i}`, x, 216, 322, 266, card.fill ?? C.white, card.color ?? C.line);
    addText(slide, `card-title-${i}`, card.title, { left: x + 28, top: 248, width: 260, height: 58 }, { fontSize: 24, bold: true, color: card.color ?? C.ink, lineSpacing: 1.02 });
    addText(slide, `card-copy-${i}`, card.copy, { left: x + 28, top: 326, width: 258, height: 124 }, { fontSize: 19, color: C.ink, lineSpacing: 1.14 });
  });
  notes(slide, `${title}\n\n${cards.map((c) => `${c.title}: ${c.copy}`).join("\n")}`);
  return slide;
}

function tableSlide(p, n, eyebrow, title, headers, rows, color = C.indigo, options = {}) {
  const slide = baseSlide(p, n, eyebrow, title, color);
  const x = options.x ?? 84;
  const y = options.y ?? 198;
  const w = options.w ?? 1090;
  const rowH = options.rowH ?? 58;
  const widths = options.widths ?? headers.map(() => w / headers.length);
  const headerH = 44;
  let cursorX = x;
  headers.forEach((header, i) => {
    addSurface(slide, `header-${i}`, cursorX, y, widths[i], headerH, color, color, 4);
    addText(slide, `header-text-${i}`, header, { left: cursorX + 12, top: y + 12, width: widths[i] - 24, height: 22 }, { fontSize: options.headerFontSize ?? 16, bold: true, color: C.white, typeface: FONT });
    cursorX += widths[i];
  });
  rows.forEach((row, r) => {
    const fill = r % 2 === 0 ? C.white : "#F1F4F5";
    cursorX = x;
    row.forEach((cell, c) => {
      addSurface(slide, `cell-${r}-${c}`, cursorX, y + headerH + r * rowH, widths[c], rowH, fill, C.line, 4);
      addText(slide, `cell-text-${r}-${c}`, cell, { left: cursorX + 12, top: y + headerH + r * rowH + 10, width: widths[c] - 24, height: rowH - 14 }, {
        fontSize: options.fontSize ?? 16,
        color: c === 0 ? C.ink : C.secondary,
        bold: c === 0,
        lineSpacing: 1.05,
        typeface: options.typeface ?? FONT,
      });
      cursorX += widths[c];
    });
  });
  notes(slide, `${title}\n\n${rows.map((r) => r.join(" | ")).join("\n")}`);
  return slide;
}

function workflowSlide(p, n, eyebrow, title, steps, color = C.teal) {
  const slide = baseSlide(p, n, eyebrow, title, color);
  steps.forEach((step, i) => {
    const x = 96 + i * 177;
    const fill = step.fill ?? (i % 2 === 0 ? C.tealLight : C.indigoLight);
    const border = step.color ?? (i % 2 === 0 ? C.teal : C.indigo);
    addSurface(slide, `step-${i}`, x, 224, 150, 210, fill, border, 8);
    addText(slide, `step-no-${i}`, String(i + 1).padStart(2, "0"), { left: x + 18, top: 246, width: 60, height: 28 }, { fontSize: 18, bold: true, color: border, typeface: EN_FONT });
    addText(slide, `step-title-${i}`, step.title, { left: x + 18, top: 286, width: 114, height: 52 }, { fontSize: 22, bold: true, color: border, lineSpacing: 1.02 });
    addText(slide, `step-copy-${i}`, step.copy, { left: x + 18, top: 358, width: 114, height: 48 }, { fontSize: 16, color: C.ink, lineSpacing: 1.12 });
    if (i < steps.length - 1) {
      addText(slide, `step-arrow-${i}`, ">", { left: x + 158, top: 310, width: 24, height: 30 }, { fontSize: 26, bold: true, color: C.muted, typeface: EN_FONT, alignment: "center" });
    }
  });
  notes(slide, `${title}\n\n${steps.map((s, i) => `${i + 1}. ${s.title}: ${s.copy}`).join("\n")}`);
  return slide;
}

function splitCodeSlide(p, n, eyebrow, title, leftTitle, leftCode, rightTitle, rightBullets, color = C.indigo, codeFont = 13) {
  const slide = baseSlide(p, n, eyebrow, title, color);
  addText(slide, "left-title", leftTitle, { left: 92, top: 190, width: 512, height: 32 }, { fontSize: 22, bold: true, color });
  addCode(slide, "left-code", leftCode, { left: 92, top: 236, width: 544, height: 302 }, codeFont);
  addSurface(slide, "right-box", 704, 222, 412, 286, color === C.green ? C.greenLight : color === C.coral ? C.coralLight : color === C.amber ? C.amberLight : color === C.violet ? C.violetLight : C.indigoLight, color);
  addText(slide, "right-title", rightTitle, { left: 740, top: 254, width: 336, height: 34 }, { fontSize: 24, bold: true, color });
  addBulletList(slide, "right-bullets", rightBullets, { left: 744, top: 314, width: 318, height: 150 }, { fontSize: 19, spaceAfter: 11 });
  notes(slide, `${title}\n\n${leftTitle}:\n${leftCode}\n\n${rightTitle}: ${rightBullets.join(" ")}`);
  return slide;
}

function buildSlides(p) {
  {
    const slide = p.slides.add();
    slide.background.fill = C.dark;
    addText(slide, "course", "Day 2 · Lesson 08", { left: 76, top: 70, width: 420, height: 30 }, { fontSize: 16, bold: true, color: "#AFC2FF", typeface: EN_FONT });
    addText(slide, "title", "Spec-Driven Development\nfor Biomedical Tools", { left: 76, top: 148, width: 840, height: 166 }, { fontSize: 48, bold: true, color: C.white, lineSpacing: 0.98, typeface: EN_FONT });
    addText(slide, "subtitle", "把模糊需求轉成 agent 能執行、人能審查、工具能測試的規格", { left: 80, top: 344, width: 850, height: 46 }, { fontSize: 24, color: "#E2E8EE", lineSpacing: 1.12 });
    addSurface(slide, "right-panel", 868, 130, 292, 356, "#24313D", "#526171", 8);
    addText(slide, "panel-title", "Today output", { left: 900, top: 172, width: 220, height: 28 }, { fontSize: 23, bold: true, color: C.white, typeface: EN_FONT });
    addBulletList(slide, "panel-list", [
      "one reusable SPEC.md template",
      "three biomedical tool specs",
      "acceptance checklist",
      "agent handoff prompt",
    ], { left: 904, top: 230, width: 218, height: 190 }, { fontSize: 18, color: "#E2E8EE", spaceAfter: 12 });
    addFooter(slide, 1, true);
    notes(slide, "This lesson teaches lightweight spec-driven development for biomedical tools. It adapts SDD ideas from the provided sources and official Spec Kit docs, with emphasis on biomedical verification.");
  }

  conceptSlide(p, 2, "LEARNING TARGET", "今天的核心能力是把願望改寫成可驗證的工具合約", [
    "解釋為什麼 agent 動手前要先有 spec",
    "把模糊需求拆成 input、output、boundary、error、validation",
    "替 PubMed extractor、gene annotation、trial summarizer 寫出最小可用規格",
    "知道 SDD 何時有用，何時會變成文件負擔",
  ], "90 分鐘後", [
    "能寫 SPEC.md",
    "能問 clarification",
    "能定義 acceptance criteria",
    "能交給 coding agent 實作",
  ], C.indigo);

  conceptSlide(p, 3, "WHY SPEC FIRST", "Biomedical 工具最怕的不是不能跑，而是跑出看似合理的錯結果", [
    "文獻 evidence extractor 可能編造 PMID 或混淆模型推測",
    "Gene annotation tool 可能混用物種、舊名與 approved symbol",
    "Clinical trial summarizer 可能把 recruitment status 或 eligibility 寫錯",
    "先寫 spec 是先定義什麼叫做正確，而不是先叫 AI 寫 code",
  ], "Spec 的工作", [
    "限制猜測空間",
    "把錯誤變可見",
    "讓測試有依據",
    "讓 review 有標準",
  ], C.coral);

  tableSlide(p, 4, "SDD PERSPECTIVE", "這幾篇文章的共同結論：SDD 有用，但不能變成 Markdown 堆高機", ["觀點", "可取之處", "課堂採用方式"], [
    ["正面", "先釐清 what/why、acceptance criteria、design、tasks", "用規格降低 agent 猜測"],
    ["警告", "文件過量、spec drift、假安全感、雙重 review", "只寫能被驗證的最小規格"],
    ["工具", "Spec Kit、OpenSpec、Spectra 提供流程與狀態追蹤", "工具當 scaffold，不取代工程判斷"],
    ["生醫調整", "把來源、not found、review gate 寫進規格", "避免把推測偽裝成 evidence"],
  ], C.indigo, { widths: [160, 470, 460], rowH: 66, fontSize: 15 });
  sourceLine(p.slides.items[p.slides.items.length - 1], "Sources: ihower, Kao Chen Long, Milk Midi, 琳.tw, Tenten");

  threeCardsSlide(p, 5, "SPEC IS A CONTRACT", "好的 spec 不是作文，而是三方共同遵守的合約", [
    { title: "Human", copy: "負責定義意圖、限制、風險和 review gate。", color: C.indigo, fill: C.indigoLight },
    { title: "Agent", copy: "依照規格讀檔、改程式、產生測試與回報差異。", color: C.teal, fill: C.tealLight },
    { title: "Validator", copy: "用 schema、fixtures、golden outputs 和命令檢查結果。", color: C.green, fill: C.greenLight },
  ], C.teal);

  workflowSlide(p, 6, "WORKFLOW", "SDD 的流程應該支援迭代，不是把人鎖進瀑布流程", [
    { title: "Discuss", copy: "先釐清研究任務與風險", color: C.indigo, fill: C.indigoLight },
    { title: "Specify", copy: "寫 what/why 和驗收標準", color: C.teal, fill: C.tealLight },
    { title: "Plan", copy: "決定資料源、介面、測試", color: C.violet, fill: C.violetLight },
    { title: "Tasks", copy: "拆成可 review 小任務", color: C.amber, fill: C.amberLight },
    { title: "Build", copy: "agent 小 patch 實作", color: C.green, fill: C.greenLight },
    { title: "Update", copy: "結果回寫 spec 與限制", color: C.coral, fill: C.coralLight },
  ], C.indigo);

  tableSlide(p, 7, "PROMPT VS SPEC", "Prompt 是一次指令；spec 是可以版本控制的共同記憶", ["面向", "Prompt", "Spec"], [
    ["生命週期", "一次對話中的指令", "跟 repo 一起演進"],
    ["可審查性", "容易散在聊天紀錄", "可被 reviewer、助教、agent 反覆檢查"],
    ["測試關係", "常只描述想要什麼", "明確列出 acceptance criteria"],
    ["失敗處理", "常靠 agent 自己補", "先定義錯誤、not found、human review"],
  ], C.indigo, { widths: [180, 430, 480], rowH: 67, fontSize: 16 });

  tableSlide(p, 8, "SPEC ANATOMY", "生醫工具的最小 SPEC.md 要回答九個問題", ["欄位", "要寫清楚什麼", "常見錯誤"], [
    ["Goal", "工具要解決的研究任務", "把 exploratory 和 production 混在一起"],
    ["Inputs", "格式、必填欄位、版本、資料源", "只寫檔名，不寫 schema"],
    ["Outputs", "欄位、型別、允許值、排序", "輸出看起來整齊但不能驗證"],
    ["Boundaries", "物種、疾病、日期、資料庫、隱私限制", "agent 自行擴大範圍"],
    ["Validation", "fixtures、golden outputs、命令、通過標準", "只說 manually checked"],
  ], C.green, { widths: [150, 510, 430], rowH: 58, fontSize: 15 });

  splitCodeSlide(p, 9, "CLARIFICATION", "模糊需求要先變成問題清單，不要直接變成 code", "Vague request", `幫我做一個工具，輸入一些基因，
然後整理跟癌症和藥物有關的資料。
最好可以輸出成表格。`, "先問", [
    "人類還是小鼠？",
    "癌症範圍是 pan-cancer 還是單癌種？",
    "證據來源允許哪些資料庫？",
    "找不到資料要怎麼寫？",
    "輸出欄位和驗收標準是什麼？",
  ], C.coral, 20);

  splitCodeSlide(p, 10, "EARS STYLE", "可測試需求要有觸發條件、行為與可檢查結果", "Requirement pattern", `WHEN the input row contains an invalid gene symbol
THEN the tool SHALL mark status = "invalid_symbol"
AND SHALL preserve the original input string
AND SHALL NOT infer a replacement symbol without evidence.

WHEN no PubMed evidence is found
THEN the tool SHALL set evidence_status = "not_found"
AND SHALL leave pmid empty.`, "好處", [
    "迫使需求具體化",
    "直接轉成測試案例",
    "降低 agent 猜測空間",
    "適合 biomedical edge cases",
  ], C.indigo, 12);

  threeCardsSlide(p, 11, "SPEC CHECKPOINTS", "每個工具都要先定義四個檢查點", [
    { title: "Input", copy: "接受什麼、拒絕什麼、如何報錯、資料版本如何記錄。", color: C.indigo, fill: C.indigoLight },
    { title: "Output", copy: "欄位、型別、允許值、空值規則與排序。", color: C.teal, fill: C.tealLight },
    { title: "Validation", copy: "sample fixtures、golden file、unit tests、not found cases。", color: C.green, fill: C.greenLight },
  ], C.green);

  sectionSlide(p, 12, "EXAMPLE 1", "PubMed evidence extractor", "第一個例子聚焦 evidence extraction：重點不是摘要得漂亮，而是每個 claim 都能追到 PMID 與來源欄位。", C.indigo);

  splitCodeSlide(p, 13, "PUBMED EXTRACTOR", "把『整理文獻』改成可驗證需求", "Before", `請幫我搜尋 PubMed，
整理 EGFR 跟肺癌治療的文獻，
做成 evidence table。`, "After", [
    "輸入：gene、disease、query_date",
    "來源：PubMed only",
    "輸出：PMID、title、study_type、claim",
    "不確定：寫 needs_review",
    "找不到：寫 not_found",
  ], C.indigo, 20);

  tableSlide(p, 14, "PUBMED INPUTS", "PubMed extractor 的 input spec 要限制搜尋範圍", ["欄位", "型別", "規則"], [
    ["gene", "string", "HGNC approved symbol；原始輸入另存 original_gene"],
    ["disease", "string", "使用指定疾病詞，不讓 agent 自行擴大癌種"],
    ["query", "string", "可由工具生成，但必須保存實際搜尋字串"],
    ["max_records", "integer", "預設 20，上限 100，避免不可審查輸出"],
    ["query_date", "date", "保存搜尋日期，讓結果可重現"],
  ], C.indigo, { widths: [170, 170, 750], rowH: 58, fontSize: 15 });

  splitCodeSlide(p, 15, "PUBMED OUTPUT", "Evidence table 必須把文獻證據和模型推測分開", "Output schema", `pmid: string
title: string
year: integer
journal: string
entity: gene | disease | drug | variant
claim: string
evidence_type: clinical | cohort | preclinical | review
evidence_status: supported | conflicting | not_found
model_inference: string
review_status: pass | needs_review`, "核心規則", [
    "PMID 不得編造",
    "claim 只寫來源支持的內容",
    "推測放 model_inference",
    "review_status 可擋高風險輸出",
  ], C.indigo, 12);

  tableSlide(p, 16, "PUBMED BOUNDARIES", "PubMed extractor 的邊界要直接寫進 spec", ["邊界", "規則", "失敗時"], [
    ["Source", "只使用 PubMed metadata 或明確提供的 abstract", "標記 source_missing"],
    ["Clinical claim", "不得產生治療建議", "needs_human_review"],
    ["Study type", "無法判斷時不得猜", "unknown"],
    ["Conflict", "相反結論要分列", "conflicting"],
    ["No evidence", "不得補常識或模型記憶", "not_found"],
  ], C.coral, { widths: [170, 520, 400], rowH: 58, fontSize: 15 });

  conceptSlide(p, 17, "PUBMED VALIDATION", "PubMed extractor 的 acceptance criteria 要能用 fixtures 測", [
    "給定含 3 筆 PMID 的 fixture，輸出列數必須等於 fixture record 數",
    "每列 PMID 必須存在且不得重複",
    "`not_found` case 不得有 claim 或 model-generated PMID",
    "任何 therapeutic implication 都必須標記 `needs_review`",
  ], "測試命令", [
    "pytest -q",
    "schema validation",
    "golden CSV diff",
    "PMID existence check",
  ], C.green);

  sectionSlide(p, 18, "EXAMPLE 2", "Gene list annotation tool", "第二個例子聚焦 entity normalization：gene symbol 看起來簡單，但物種、舊名與 synonym 會讓 agent 很容易過度推論。", C.teal);

  tableSlide(p, 19, "GENE INPUTS", "Gene annotation 的 input spec 必須保留原始值與物種", ["欄位", "規則", "原因"], [
    ["gene_input", "保留原始字串，不可覆蓋", "review 時需要追溯"],
    ["species", "預設 human；可接受 mouse 但要明示", "避免跨物種混淆"],
    ["source", "HGNC / NCBI Gene / Ensembl 擇一或多個", "資料庫版本影響結果"],
    ["allow_synonym", "預設 false；若 true 要列出 evidence", "避免自行替換"],
    ["batch_id", "保存本批輸入與版本", "輸出可重跑"],
  ], C.teal, { widths: [190, 520, 380], rowH: 58, fontSize: 15 });

  splitCodeSlide(p, 20, "GENE OUTPUT", "Annotation output 要同時服務機器檢查與人工 review", "Output schema", `gene_input
approved_symbol
gene_id
species
match_type: exact | synonym | withdrawn | not_found
confidence: high | medium | low
evidence_source
evidence_version
message
review_status`, "注意", [
    "not_found 是合法輸出",
    "synonym 需要來源",
    "confidence 不等於臨床證據等級",
    "保留 message 給人工審查",
  ], C.teal, 13);

  tableSlide(p, 21, "GENE BOUNDARIES", "Gene list tool 要先決定什麼不能自動做", ["情境", "規格決定", "理由"], [
    ["舊名", "可標記 withdrawn，但不可自動替換成 approved", "避免錯誤合併"],
    ["跨物種", "species 不明時 needs_review", "同名基因可能不同"],
    ["多重 match", "列出候選，不選唯一答案", "降低錯 annotation"],
    ["非 gene term", "標記 invalid_input", "不要把 pathway 或 drug 當 gene"],
  ], C.coral, { widths: [190, 500, 400], rowH: 66, fontSize: 15 });

  conceptSlide(p, 22, "GENE VALIDATION", "Gene annotation 的測試要包含正常、舊名、找不到與跨物種", [
    "Fixture 至少包含 TP53、ERBB2、舊名、錯拼、mouse-only symbol",
    "Golden output 固定 `match_type`、`review_status`、`message`",
    "資料庫版本或 retrieval date 要出現在 output metadata",
    "更新資料庫版本時 golden output 可以變，但必須在 changelog 說明",
  ], "最小驗收", [
    "schema pass",
    "golden pass",
    "no silent correction",
    "version recorded",
  ], C.green);

  sectionSlide(p, 23, "EXAMPLE 3", "Clinical trial summarizer", "第三個例子聚焦高風險摘要：trial summary 可以幫研究工作，但不能變成招募建議或治療建議。", C.violet);

  tableSlide(p, 24, "TRIAL INPUTS", "Clinical trial summarizer 的 input spec 要鎖定來源與日期", ["輸入", "規則", "風險控制"], [
    ["nct_id", "必填；格式 `NCT` + 8 digits", "避免錯 trial"],
    ["source_record", "ClinicalTrials.gov record 或本地 JSON", "不靠模型記憶"],
    ["retrieved_date", "必填", "狀態會變動"],
    ["summary_scope", "status、phase、criteria、intervention、outcomes", "避免亂擴充"],
    ["audience", "research note only", "避免臨床建議"],
  ], C.violet, { widths: [190, 500, 400], rowH: 58, fontSize: 15 });

  splitCodeSlide(p, 25, "TRIAL OUTPUT", "Trial summary 要保留 eligibility 與 status 的原始依據", "Output schema", `nct_id
official_title
phase
recruitment_status
condition
interventions[]
primary_outcomes[]
inclusion_summary
exclusion_summary
source_fields[]
retrieved_date
review_status`, "必要規則", [
    "status 不得憑記憶更新",
    "criteria summary 要標 source_fields",
    "不得寫病人適不適合參加",
    "高風險解讀標 needs_review",
  ], C.violet, 12);

  tableSlide(p, 26, "TRIAL ERRORS", "Trial summarizer 的錯誤處理要比一般摘要更嚴格", ["錯誤", "輸出", "不能做"], [
    ["找不到 NCT", "status = not_found", "自行產生 trial title"],
    ["欄位缺失", "field_status = missing", "用常識補 eligibility"],
    ["多版本衝突", "status = conflicting", "只選一個版本"],
    ["PII 出現", "stop_and_report", "繼續摘要或外傳資料"],
  ], C.coral, { widths: [200, 390, 500], rowH: 66, fontSize: 15 });

  conceptSlide(p, 27, "TRIAL VALIDATION", "Clinical trial summary 的驗收標準要防止過度推論", [
    "每個 summary 欄位都能追到原始 JSON path 或 source field",
    "NCT ID format 錯誤時必須 fail fast",
    "recruitment status 必須與 retrieved record 一致",
    "不得產生 eligibility recommendation 或 treatment recommendation",
  ], "Validation", [
    "JSON schema",
    "field trace check",
    "negative fixtures",
    "human review gate",
  ], C.green);

  sectionSlide(p, 28, "TOOLS", "Spec Kit、OpenSpec、Spectra 是 scaffold，不是答案", "工具可以幫你產出 constitution、spec、plan、tasks，也可以追蹤進度；但 biomedical source、review gate、not found rule 必須由我們定義。", C.indigo);

  tableSlide(p, 29, "SDD TOOLING", "不同 SDD 工具都在解同一個問題：讓需求、設計與任務可追蹤", ["工具或概念", "課堂採用的想法", "生醫調整"], [
    ["Spec Kit", "constitution、specify、plan、tasks、implement", "constitution 加入 citation / PHI / clinical claim 規則"],
    ["OpenSpec", "proposal、spec、design、tasks 與狀態追蹤", "用 dependency order 管理 spec artifacts"],
    ["Spectra", "GUI/CLI 讓規格流程更可見，並檢查遺漏與矛盾", "用於教學展示 spec review"],
    ["Lightweight SDD", "先寫小規格，再小 patch 實作", "避免過度文件化"],
  ], C.indigo, { widths: [180, 500, 410], rowH: 66, fontSize: 15 });
  sourceLine(p.slides.items[p.slides.items.length - 1], "Sources: GitHub Spec Kit, OpenSpec/Spectra articles");

  splitCodeSlide(p, 30, "ASK FOR SPEC", "先讓 agent 寫 spec，但要求它先問問題", "Prompt", `請不要開始寫程式。
請先根據下列 biomedical tool idea 建立 SPEC.md。

你必須先列出最多 8 個 clarification questions。
沒有答案時，提出保守預設並標記 assumption。

SPEC.md 必須包含：
- Goal / non-goals
- Inputs / outputs
- Boundary conditions
- Error handling
- Validation commands
- Human review gate`, "教學重點", [
    "禁止先寫 code",
    "先逼出 ambiguity",
    "沒有答案要標 assumption",
    "spec 要包含驗證與 review",
  ], C.teal, 11);

  splitCodeSlide(p, 31, "IMPLEMENT FROM SPEC", "讓 agent 實作時，要把 spec 變成 acceptance contract", "Prompt", `請依照 SPEC.md 實作最小版本。

規則：
- 只改 tasks.md 指定的檔案
- 每完成一個 task 就跑相對應測試
- 不得新增 SPEC.md 沒提到的功能
- 若 SPEC.md 不清楚，先停下來問

回報：
- completed tasks
- files changed
- validation commands
- deviations from SPEC.md
- remaining risks`, "完成定義", [
    "不是它說完成",
    "是 acceptance criteria pass",
    "所有 deviation 要列出",
    "spec drift 要回寫",
  ], C.green, 11);

  conceptSlide(p, 32, "SPEC DRIFT", "Spec drift 會讓 SDD 失效，所以規格要跟 commit 一起活著", [
    "程式碼行為改了，SPEC.md 必須同步改",
    "測試暴露新邊界條件時，要補回 requirements 或 validation",
    "資料庫版本、API schema、source policy 改了，要記錄在 changelog",
    "不要把過時 spec 留給 agent 當錯誤 context",
  ], "Change rule", [
    "spec first",
    "small patch",
    "test evidence",
    "review gate",
  ], C.coral);

  tableSlide(p, 33, "REVIEW CHECKLIST", "Biomedical spec review 的重點是可追溯、可驗證、可停止", ["檢查項目", "要問的問題", "不通過時"], [
    ["Source", "允許資料源和版本寫清楚了嗎？", "補來源或縮小 scope"],
    ["Schema", "每個 output 欄位都有型別與允許值嗎？", "補 schema"],
    ["Not found", "找不到資料時會停止還是亂補？", "補 not_found rule"],
    ["Boundary", "PHI、clinical claim、external action 有 gate 嗎？", "補 human review"],
    ["Validation", "有 sample fixtures 和命令可以重跑嗎？", "補 tests/golden file"],
  ], C.indigo, { widths: [170, 560, 360], rowH: 58, fontSize: 15 });

  tableSlide(p, 34, "STUDENT EXERCISE", "學生要交的是 spec，不是看起來很厲害的 prompt", ["步驟", "交付物", "檢查"], [
    ["1. Pick", "選一個工具：PubMed / gene / trial", "scope 是否夠小"],
    ["2. Clarify", "列 5 個 clarification questions", "是否問到資料源與邊界"],
    ["3. Specify", "填入 SPEC.md template", "schema、errors、validation 是否完整"],
    ["4. Handoff", "寫給 coding agent 的 implementation prompt", "是否限制改檔與測試命令"],
  ], C.green, { widths: [150, 520, 420], rowH: 70, fontSize: 15 });

  {
    const slide = baseSlide(p, 35, "MATERIALS", "Lab bundle 包含一個範本與三個完整生醫工具 spec", C.violet);
    addSurface(slide, "lab-box", 92, 204, 500, 278, C.violetLight, C.violet);
    addText(slide, "lab-title", "Repo materials", { left: 126, top: 240, width: 430, height: 34 }, { fontSize: 24, bold: true, color: C.violet, typeface: EN_FONT });
    addBulletList(slide, "lab-list", [
      "templates/biomedical-tool-spec-template.md",
      "examples/pubmed-evidence-extractor/SPEC.md",
      "examples/gene-list-annotation-tool/SPEC.md",
      "examples/clinical-trial-summarizer/SPEC.md",
    ], { left: 130, top: 304, width: 398, height: 120 }, { fontSize: 14, spaceAfter: 9, typeface: MONO });
    addSurface(slide, "src-box", 650, 204, 470, 278, C.white, C.line);
    addText(slide, "src-title", "Referenced sources", { left: 686, top: 240, width: 390, height: 34 }, { fontSize: 24, bold: true, color: C.indigo, typeface: EN_FONT });
    addBulletList(slide, "src-list", [
      "ihower.tw SDD critique",
      "Kao Chen Long SDD / Spectra articles",
      "Milk Midi GitHub Spec Kit walkthrough",
      "琳.tw SDD workflow guide",
      "Tenten SDD overview",
    ], { left: 690, top: 304, width: 382, height: 120 }, { fontSize: 17, spaceAfter: 8, typeface: FONT });
    notes(slide, "Sources used: https://ihower.tw/blog/13480-sdd-spec-driven-development ; https://kaochenlong.com/sdd-spec-driven-development ; https://kaochenlong.com/spectra-with-openspec ; https://kaochenlong.com/spectra-app-2 ; https://milkmidi.medium.com/ai-%E6%99%82%E4%BB%A3-%E4%B8%80%E5%AE%9A%E8%A6%81%E5%AD%B8%E6%9C%83%E4%BD%BF%E7%94%A8-github-spec-kit-sdd-%E8%A6%8F%E6%A0%BC%E9%A9%85%E5%8B%95%E9%96%8B%E7%99%BC-f2df57cfdf3c ; https://xn--uy0a.tw/AI/sdd-ai-copilot-codex-devops-workflow/ ; https://tenten.co/learning/specdriven-developmentai/ ; https://github.com/github/spec-kit .");
  }

  {
    const slide = baseSlide(p, 36, "WRAP-UP", "最後帶走五句話", C.indigo);
    const lines = [
      ["1. Spec 不是文件崇拜，而是讓正確性可以被檢查。", C.indigo, C.indigoLight],
      ["2. 模糊需求要先問清楚，不能直接交給 agent 寫 code。", C.teal, C.tealLight],
      ["3. Input、output、boundary、error、validation 是最小骨架。", C.green, C.greenLight],
      ["4. 生醫工具要把 evidence、not found、human review 寫進規格。", C.violet, C.violetLight],
      ["5. SDD 成敗取決於 spec 是否跟測試和 commit 一起演進。", C.coral, C.coralLight],
    ];
    lines.forEach((line, i) => {
      const y = 166 + i * 82;
      addSurface(slide, `wrap-${i}`, 118, y, 1010, 58, line[2], line[1]);
      addText(slide, `wrap-text-${i}`, line[0], { left: 148, top: y + 16, width: 930, height: 26 }, { fontSize: 22, bold: true, color: line[1] });
    });
    notes(slide, "Wrap-up: SDD for biomedical tools should be lightweight, explicit, verifiable, and traceable.");
  }
}

async function main() {
  await fs.mkdir(OUT_DIR, { recursive: true });
  await fs.mkdir(path.dirname(FINAL_PPTX), { recursive: true });
  const presentation = Presentation.create({ slideSize: { width: W, height: H } });
  buildSlides(presentation);

  for (const [index, slide] of presentation.slides.items.entries()) {
    const stem = `slide-${String(index + 1).padStart(2, "0")}`;
    await writeBlob(path.join(OUT_DIR, `${stem}.png`), await presentation.export({ slide, format: "png", scale: 1 }));
    const layout = await slide.export({ format: "layout" });
    await fs.writeFile(path.join(OUT_DIR, `${stem}.layout.json`), await layout.text());
  }
  await writeBlob(path.join(OUT_DIR, "montage.webp"), await presentation.export({ format: "webp", montage: true, scale: 1 }));
  const pptx = await PresentationFile.exportPptx(presentation);
  await pptx.save(FINAL_PPTX);
  console.log(`Wrote ${FINAL_PPTX}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
