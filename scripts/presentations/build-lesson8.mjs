import fs from "node:fs/promises";
import path from "node:path";
import { Presentation, PresentationFile } from "@oai/artifact-tool";

const SCRIPT_DIR = path.dirname(new URL(import.meta.url).pathname);
const REPO_ROOT = process.env.REPO_ROOT ? path.resolve(process.env.REPO_ROOT) : path.resolve(SCRIPT_DIR, "../..");
const OUT_DIR = path.join(REPO_ROOT, "previews", "lesson-08-loop-engineering");
const FINAL_PPTX = path.join(REPO_ROOT, "slides", "lesson-08-loop-engineering.pptx");

const W = 1280;
const H = 720;
const TOTAL = 38;
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
  line: "#D4DADD",
  white: "#FFFFFF",
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

function addSurface(slide, name, x, y, w, h, fill = C.white, line = C.line) {
  return slide.shapes.add({
    geometry: "roundRect",
    name,
    position: { left: x, top: y, width: w, height: h },
    fill,
    line: { style: "solid", fill: line, width: 1 },
    borderRadius: 8,
  });
}

function addNode(slide, name, label, x, y, w, h, color, fill = C.white, fontSize = 18, typeface = FONT) {
  const node = addSurface(slide, name, x, y, w, h, fill, color);
  node.text = label;
  node.text.style = {
    fontSize,
    bold: true,
    color,
    alignment: "center",
    verticalAlignment: "middle",
    lineSpacing: 1.02,
    typeface,
    insets: { top: 6, right: 8, bottom: 6, left: 8 },
  };
  return node;
}

function addLine(slide, name, x1, y1, x2, y2, color, width = 1.6, dashed = false) {
  return slide.shapes.add({
    geometry: "line",
    name,
    position: { left: x1, top: y1, width: x2 - x1, height: y2 - y1 },
    fill: "none",
    line: { style: dashed ? "dashed" : "solid", fill: color, width },
  });
}

function addEyebrow(slide, text, color = C.indigo) {
  addText(slide, "eyebrow", text, { left: frame.left, top: frame.top, width: 790, height: 30 }, {
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
  addText(slide, dark ? "footer-dark" : "footer", `Loop engineering  |  ${n}/${TOTAL}`, {
    left: frame.left,
    top: 668,
    width: 390,
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
  addSurface(slide, `${name}-box`, position.left, position.top, position.width, position.height, C.codeBg, "#131A21");
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
  slide.background.fill = color === C.coral ? C.coralLight : color === C.amber ? C.amberLight : color === C.green ? C.greenLight : C.indigoLight;
  addEyebrow(slide, eyebrow, color);
  addText(slide, "section-title", title, { left: 84, top: 206, width: 1000, height: 112 }, {
    fontSize: 42,
    bold: true,
    color,
    lineSpacing: 1.02,
  });
  addText(slide, "section-subtitle", subtitle, { left: 88, top: 338, width: 900, height: 76 }, {
    fontSize: 24,
    color: C.ink,
    lineSpacing: 1.12,
  });
  addFooter(slide, n);
  notes(slide, subtitle);
}

function conceptSlide(p, n, eyebrow, title, bullets, rightTitle, rightBullets, color = C.indigo) {
  const slide = baseSlide(p, n, eyebrow, title, color);
  addBulletList(slide, "left-bullets", bullets, { left: 92, top: 216, width: 540, height: 330 }, { fontSize: 22, spaceAfter: 13 });
  addSurface(slide, "right-box", 706, 190, 410, 330, color === C.coral ? C.coralLight : color === C.amber ? C.amberLight : color === C.green ? C.greenLight : C.indigoLight, color);
  addText(slide, "right-title", rightTitle, { left: 742, top: 226, width: 330, height: 36 }, { fontSize: 25, bold: true, color });
  addBulletList(slide, "right-bullets", rightBullets, { left: 746, top: 292, width: 310, height: 190 }, { fontSize: 20, spaceAfter: 12 });
  notes(slide, `${title}\n\n${bullets.join(" ")} ${rightTitle}: ${rightBullets.join(" ")}`);
}

function threeCardsSlide(p, n, eyebrow, title, cards, color = C.teal) {
  const slide = baseSlide(p, n, eyebrow, title, color);
  cards.forEach((card, i) => {
    const x = 92 + i * 374;
    addSurface(slide, `card-${i}`, x, 216, 322, 266, card.fill ?? C.white, card.color ?? C.line);
    addText(slide, `card-title-${i}`, card.title, { left: x + 28, top: 248, width: 260, height: 56 }, { fontSize: 24, bold: true, color: card.color ?? C.ink, lineSpacing: 1.02 });
    addText(slide, `card-copy-${i}`, card.copy, { left: x + 28, top: 324, width: 258, height: 122 }, { fontSize: 19, color: C.ink, lineSpacing: 1.14 });
  });
  notes(slide, `${title}\n\n${cards.map((c) => `${c.title}: ${c.copy}`).join("\n")}`);
}

function compareSlide(p, n, eyebrow, title, leftHeader, leftItems, rightHeader, rightItems, color = C.teal) {
  const slide = baseSlide(p, n, eyebrow, title, color);
  addSurface(slide, "left", 100, 190, 500, 330, C.coralLight, C.coral);
  addText(slide, "left-head", leftHeader, { left: 132, top: 228, width: 410, height: 34 }, { fontSize: 26, bold: true, color: C.coral });
  addBulletList(slide, "left-list", leftItems, { left: 138, top: 298, width: 390, height: 190 }, { fontSize: 21, spaceAfter: 12 });
  addSurface(slide, "right", 680, 190, 500, 330, C.greenLight, C.green);
  addText(slide, "right-head", rightHeader, { left: 712, top: 228, width: 410, height: 34 }, { fontSize: 26, bold: true, color: C.green });
  addBulletList(slide, "right-list", rightItems, { left: 718, top: 298, width: 390, height: 190 }, { fontSize: 21, spaceAfter: 12 });
  notes(slide, `${leftHeader}: ${leftItems.join(" ")} ${rightHeader}: ${rightItems.join(" ")}`);
}

function tableSlide(p, n, eyebrow, title, columns, rows, color = C.indigo) {
  const slide = baseSlide(p, n, eyebrow, title, color);
  const x0 = 94;
  const y0 = 188;
  const widths = [246, 382, 382];
  columns.forEach((col, i) => {
    const x = x0 + widths.slice(0, i).reduce((a, b) => a + b, 0);
    addSurface(slide, `head-${i}`, x, y0, widths[i], 48, color === C.coral ? C.coralLight : color === C.green ? C.greenLight : C.indigoLight, color);
    addText(slide, `head-text-${i}`, col, { left: x + 14, top: y0 + 12, width: widths[i] - 28, height: 24 }, { fontSize: 17, bold: true, color });
  });
  rows.forEach((row, r) => {
    const y = y0 + 54 + r * 76;
    row.forEach((cell, i) => {
      const x = x0 + widths.slice(0, i).reduce((a, b) => a + b, 0);
      addSurface(slide, `cell-${r}-${i}`, x, y, widths[i], 66, C.white, C.line);
      addText(slide, `cell-text-${r}-${i}`, cell, { left: x + 14, top: y + 12, width: widths[i] - 28, height: 42 }, { fontSize: i === 0 ? 17 : 15.8, bold: i === 0, color: i === 0 ? color : C.ink, lineSpacing: 1.07 });
    });
  });
  notes(slide, `${title}\n\n${rows.map((r) => r.join(" / ")).join("\n")}`);
}

function codeSlide(p, n, eyebrow, title, code, explanation, color = C.indigo, fontSize = 13) {
  const slide = baseSlide(p, n, eyebrow, title, color);
  addCode(slide, "code", code, { left: 92, top: 184, width: 632, height: 388 }, fontSize);
  addSurface(slide, "explain", 766, 204, 344, 320, color === C.coral ? C.coralLight : color === C.amber ? C.amberLight : color === C.green ? C.greenLight : C.tealLight, color);
  addText(slide, "explain-title", "教學重點", { left: 798, top: 238, width: 260, height: 34 }, { fontSize: 25, bold: true, color });
  addBulletList(slide, "explain-list", explanation, { left: 802, top: 304, width: 270, height: 170 }, { fontSize: 20, spaceAfter: 12 });
  notes(slide, `${title}\n\n${explanation.join(" ")}`);
}

function titleSlide(p, n) {
  const slide = p.slides.add();
  slide.background.fill = C.bg;
  addEyebrow(slide, "LESSON 08  |  LOOP ENGINEERING", C.indigo);
  addText(slide, "title", "Loop engineering", {
    left: 78,
    top: 112,
    width: 850,
    height: 70,
  }, { fontSize: 48, bold: true, color: C.ink, typeface: EN_FONT });
  addText(slide, "subtitle", "讓 agent 反覆 plan、retrieve、analyze、verify、revise，最後產生可驗證 biomedical summary", {
    left: 82,
    top: 204,
    width: 1000,
    height: 64,
  }, { fontSize: 25, bold: true, color: C.secondary });
  const stages = [
    ["Plan", C.indigo, C.indigoLight],
    ["Retrieve", C.teal, C.tealLight],
    ["Analyze", C.amber, C.amberLight],
    ["Verify", C.coral, C.coralLight],
    ["Revise", C.teal, C.tealLight],
    ["Report", C.green, C.greenLight],
  ];
  stages.forEach((s, i) => {
    const x = 108 + i * 178;
    addNode(slide, `stage-${i}`, s[0], x, 380, 126, 60, s[1], s[2], 19, EN_FONT);
    if (i < stages.length - 1) addLine(slide, `line-${i}`, x + 126, 410, x + 178, 410, C.secondary, 1.8);
  });
  addFooter(slide, n);
  notes(slide, "開場定位：前三堂建立 agent 的環境、操作和規格，最後一堂教學生怎麼把這些能力放進可停止、可檢查的 loop。");
}

function agendaSlide(p, n) {
  const slide = baseSlide(p, n, "90-MINUTE MAP", "這堂課是 Day 2 的最後一塊拼圖");
  const rows = [
    ["回顧", "Harness、coding agent、spec 不是三個孤島", "Loop 會把它們組成可執行流程。"],
    ["概念", "從一次性回答變成反覆工作", "plan -> retrieve -> analyze -> verify -> revise -> report。"],
    ["設計", "Generator 和 evaluator 要分開", "一個負責寫，一個負責挑錯。"],
    ["驗證", "Self-check、rule-check、human review 分工", "不要叫同一個 AI 自己蓋自己的章。"],
    ["風險", "停止條件與成本控制", "沒有 budget 的 loop 很快變成燒錢儀式。"],
    ["實作", "Mock-mode biomedical summary loop", "穩定跑出 draft、issues、final report。"],
  ];
  rows.forEach((r, i) => {
    const y = 154 + i * 72;
    addNode(slide, `tag-${i}`, r[0], 102, y, 126, 44, i < 2 ? C.indigo : i < 4 ? C.teal : C.amber, i < 2 ? C.indigoLight : i < 4 ? C.tealLight : C.amberLight, 18);
    addText(slide, `role-${i}`, r[1], { left: 272, top: y + 3, width: 384, height: 28 }, { fontSize: 20, bold: true });
    addText(slide, `copy-${i}`, r[2], { left: 700, top: y + 6, width: 430, height: 24 }, { fontSize: 18, color: C.secondary });
  });
  notes(slide, "這張是講師自己的路線圖也給學生看：最後一堂不是新玩具，而是把 Day 2 的能力串成完整工作流。");
}

function loopDiagramSlide(p, n) {
  const slide = baseSlide(p, n, "LOOP OVERVIEW", "Loop 不是再問一次，而是帶著檢查結果前進");
  const nodes = [
    ["plan", "Plan\n定範圍", 106, 292, C.indigo, C.indigoLight],
    ["retrieve", "Retrieve\n取證據", 286, 292, C.teal, C.tealLight],
    ["analyze", "Analyze\n抽 claim", 466, 292, C.amber, C.amberLight],
    ["verify", "Verify\n找問題", 646, 292, C.coral, C.coralLight],
    ["revise", "Revise\n修正", 826, 292, C.teal, C.tealLight],
    ["report", "Report\n交付", 1006, 292, C.green, C.greenLight],
  ];
  nodes.forEach(([name, label, x, y, color, fill]) => addNode(slide, name, label, x, y, 126, 76, color, fill, 20));
  for (let i = 0; i < nodes.length - 1; i += 1) addLine(slide, `arrow-${i}`, nodes[i][2] + 126, 330, nodes[i + 1][2], 330, C.secondary, 2);
  addLine(slide, "feedback-1", 906, 292, 906, 228, C.teal, 1.8, true);
  addLine(slide, "feedback-2", 906, 228, 466, 228, C.teal, 1.8, true);
  addLine(slide, "feedback-3", 466, 228, 466, 292, C.teal, 1.8, true);
  addText(slide, "caption", "真正的 loop 會把 evaluator 的 issues 帶回 revise；不是每輪都重新憑感覺作文。", {
    left: 150,
    top: 452,
    width: 960,
    height: 58,
  }, { fontSize: 23, bold: true, color: C.secondary, alignment: "center" });
  notes(slide, "這張建立整堂課核心圖。要提醒：feedback 是帶著結構化問題回去修，不是單純叫模型再想想。");
}

function buildSlides(p) {
  titleSlide(p, 1);
  agendaSlide(p, 2);
  conceptSlide(p, 3, "DAY 2 SYNTHESIS", "Loop 把前面三堂課變成一條可執行流程", [
    "Harness 決定 agent 能碰什麼、不能碰什麼",
    "Coding agent 讓 agent 能讀檔、改檔、跑檢查",
    "Spec 把模糊需求變成可驗證條件",
    "Loop 讓 agent 按照 spec 反覆修到可交付",
  ], "今天的核心句", [
    "Harness controls the workspace",
    "Spec defines done",
    "Loop drives iteration",
  ]);
  compareSlide(p, 4, "ONE-SHOT VS LOOP", "一次回答很快，但 biomedical 任務需要可追查的迭代", "一次性回答", [
    "輸入問題，直接交答案",
    "錯了很難知道哪一步壞掉",
    "很容易流暢但沒有來源",
  ], "Loop workflow", [
    "先定任務，再取證據",
    "每輪都有 evaluator issues",
    "最後附上 summary 和檢查紀錄",
  ]);
  loopDiagramSlide(p, 5);
  sectionSlide(p, 6, "PART 1", "先把 loop 的每一步拆開", "學生要知道每一步的責任不同。把所有事情都丟給一個 prompt，通常只是把錯誤藏得更深。", C.indigo);
  tableSlide(p, 7, "LOOP STEPS", "六個階段各自有不同責任", ["階段", "這一步要做什麼", "生醫 summary 例子"], [
    ["Plan", "界定問題、輸出格式、不可回答範圍", "回答 EGFR T790M，但不給病人治療建議"],
    ["Retrieve", "取得可引用 evidence", "讀 evidence_table.csv 或查 PubMed"],
    ["Analyze", "把 evidence 轉成可用 claim", "區分 resistance、response、mechanism"],
    ["Verify", "檢查 claim、source、overreach", "每句是否有 [S1]，有無臨床過度推論"],
  ]);
  tableSlide(p, 8, "PLAN", "Plan 的目的不是裝忙，是先避免任務失控", ["Plan 檢查點", "為什麼重要", "範例"], [
    ["Question", "沒有明確問題，後面都會漂移", "T790M 與 NSCLC resistance/response"],
    ["Boundary", "先講不能回答什麼", "不產生 patient-level recommendation"],
    ["Output", "沒有格式，無法驗證", "220 words + source IDs + uncertainty"],
    ["Done", "沒有完成定義就會無限修", "no blocking issues or human review"],
  ]);
  conceptSlide(p, 9, "RETRIEVE", "Retrieve 不是亂查，是拿到能支撐 claim 的 evidence", [
    "課堂 demo 建議用老師提供的 evidence table，穩定且可控",
    "真的接 PubMed 時，要限制 query、max sources、資料來源",
    "每個 source 都要有 source_id，後面 verify 才抓得到",
  ], "新手常犯錯", [
    "每輪都重新查",
    "把摘要當全文",
    "source 沒編號",
    "查到什麼都塞",
  ], C.teal);
  conceptSlide(p, 10, "ANALYZE", "Analyze 要把 evidence 轉成小心的 claim", [
    "把 association、mechanism、response、resistance 分開",
    "把 clinical、preclinical、review 的證據等級分開",
    "不要把『有關聯』升級成『可以用來治療』",
  ], "一句提醒", [
    "Biomedical summary",
    "不是醫囑產生器",
    "更不是自信心表演",
  ], C.amber);
  conceptSlide(p, 11, "VERIFY", "Verify 的工作是找錯，不是幫 draft 找台階下", [
    "每個 biomedical claim 是否有 source_id",
    "source_id 是否存在於 evidence table",
    "claim 是否超出 evidence",
    "是否出現 clinical recommendation 或過度推論",
  ], "Evaluator 心態", [
    "不要禮貌性通過",
    "不要只說 looks good",
    "要輸出可修的 issues",
  ], C.coral);
  conceptSlide(p, 12, "REVISE", "Revise 不是重寫一篇，而是根據 issues 修補", [
    "只修 evaluator 指出的問題",
    "刪掉 unsupported claim，比硬找理由更安全",
    "修完要保留 source_id 和 uncertainty",
  ], "危險修法", [
    "改到 citation 不見",
    "把 claim 改更大",
    "為了通過而刪光內容",
  ], C.teal);
  conceptSlide(p, 13, "REPORT", "Report 要交答案，也要交檢查紀錄", [
    "final_summary.md 是給人讀的結論",
    "issue_log.json 是給人追查的紀錄",
    "loop_report.json 是這次 loop 是否通過的狀態",
  ], "最後交付", [
    "summary",
    "sources used",
    "iterations",
    "human review flag",
  ], C.green);
  sectionSlide(p, 14, "PART 2", "Generator 和 evaluator 要分開", "同一個模型可以扮演不同角色，但角色、prompt、輸出格式必須分開，否則它很容易自己幫自己蓋章。", C.teal);
  compareSlide(p, 15, "GENERATOR VS EVALUATOR", "寫的人和挑錯的人，不應該是同一種心態", "Generator", [
    "根據 evidence 產生 summary",
    "把資訊整理得可讀",
    "必須引用 source_id",
  ], "Evaluator", [
    "找 unsupported claim",
    "檢查 missing source_id",
    "標出 overstatement 和 human review",
  ], C.teal);
  codeSlide(p, 16, "GENERATOR PROMPT", "Generator prompt 要限制來源和輸出格式", `You are generating a biomedical summary.

Use only the provided evidence table.
Every biomedical claim must cite source_id like [S1].
Do not make patient-level treatment recommendations.
Mention uncertainty for preclinical or indirect evidence.
Output <= 220 words.

Question:
{{question}}

Evidence:
{{evidence_table}}`, [
    "先限制資料來源",
    "明確禁止臨床建議",
    "要求 source_id",
    "限制長度避免發散",
  ], C.teal, 12);
  codeSlide(p, 17, "EVALUATOR PROMPT", "Evaluator prompt 要輸出結構化 issue，不要只聊天", `You are evaluating a biomedical summary.

Check:
- unsupported biomedical claims
- missing or invalid source_id
- overstatement beyond evidence
- clinical recommendation language
- missing uncertainty

Return JSON issues:
[
  {
    "issue_type": "...",
    "severity": "high|medium|low",
    "sentence": "...",
    "suggested_fix": "..."
  }
]`, [
    "列出檢查項目",
    "輸出 JSON",
    "issue 要能被 revise 使用",
  ], C.teal, 11.5);
  codeSlide(p, 18, "ISSUE SCHEMA", "好的 evaluator 會留下可修的錯誤清單", `{
  "issue_type": "unsupported_claim",
  "severity": "high",
  "sentence": "Osimertinib is effective in all EGFR-mutant lung cancers.",
  "explanation": "Evidence only discusses T790M-positive NSCLC.",
  "suggested_fix": "Limit the claim to T790M-positive NSCLC and cite [S2].",
  "needs_human_review": false
}`, [
    "severity 決定是否阻擋",
    "sentence 讓人定位",
    "suggested_fix 讓 revise 可執行",
  ], C.indigo, 12);
  sectionSlide(p, 19, "PART 3", "Self-check 不是 verification", "自我檢查可以降低風險，但不能取代外部規則檢查，更不能取代高風險的人工審查。", C.coral);
  tableSlide(p, 20, "THREE-LAYER CHECK", "三層檢查各有工作，不要混在一起", ["檢查層", "擅長檢查什麼", "不能完全相信什麼"], [
    ["LLM evaluator", "語意、過度推論、uncertainty", "citation 是否真的存在"],
    ["Rule checker", "格式、source_id、禁止詞、長度", "醫學語意是否合理"],
    ["External tools", "PMID、DOI、gene symbol、資料庫版本", "最後臨床解讀"],
    ["Human review", "高風險判斷、領域 nuance", "大量格式檢查"],
  ], C.coral);
  conceptSlide(p, 21, "PROGRAMMATIC CHECKS", "程式檢查很無聊，但 demo 會因此活下來", [
    "source_id 是否都存在",
    "summary 是否引用 evidence table 以外的 source",
    "是否超過字數",
    "是否出現 clinical action 禁止語",
  ], "適合程式抓", [
    "格式",
    "存在性",
    "長度",
    "明確規則",
  ], C.coral);
  codeSlide(p, 22, "RULE CHECKER", "最小 rule checker 就能擋掉很多事故", `def check_summary(summary, source_ids):
    issues = []
    cited = set(re.findall(r"\\[(S\\d+)\\]", summary))

    for sid in cited:
        if sid not in source_ids:
            issues.append(issue("invalid_source_id", sid))

    if not cited:
        issues.append(issue("missing_source_id", "No source IDs found"))

    banned = ["should treat", "recommended treatment", "patients should"]
    if any(term in summary.lower() for term in banned):
        issues.append(issue("clinical_recommendation", "Human review required"))

    return issues`, [
    "規則不用聰明",
    "要抓高風險硬條件",
    "LLM 和程式互補",
  ], C.coral, 11.3);
  sectionSlide(p, 23, "PART 4", "Loop 一定要有停止條件和成本邊界", "好的 loop 不只是會努力，還要知道什麼時候該停。否則它會從助教變成會刷卡的無限迴圈。", C.amber);
  tableSlide(p, 24, "STOPPING RULES", "停止條件要先寫，不要等它失控才祈禱", ["停止條件", "何時觸發", "處理方式"], [
    ["No blocking issues", "只剩低風險或沒有問題", "產生 final report"],
    ["Max iterations", "已修 3 輪仍有問題", "停止並列出剩餘問題"],
    ["Human review", "臨床建議、證據不足、衝突資料", "交給人，不再硬改"],
    ["Budget reached", "來源數、token、時間超標", "停止 retrieve 或縮小任務"],
  ], C.amber);
  codeSlide(p, 25, "LOOP BUDGET", "Budget 是 loop 的安全帶", `loop:
  max_iterations: 3
  max_retrieval_rounds: 1
  max_sources: 6
  max_summary_words: 220
  stop_if_human_review_required: true
  require_issue_log: true
  checks:
    - source_id_coverage
    - no_invalid_source_id
    - no_clinical_recommendation`, [
    "限制迭代次數",
    "限制 retrieve 成本",
    "明確定義必跑 checks",
  ], C.amber, 12);
  threeCardsSlide(p, 26, "FAILURE MODES", "Loop 失控通常不是壞掉，而是太努力", [
    { title: "無限修正", copy: "Evaluator 每輪都找到新問題，agent 就一直改。沒有 max_iterations 就會開始表演耐力賽。", color: C.coral, fill: C.coralLight },
    { title: "越改越偏", copy: "第一版有 source，第三版改到 citation 消失。Revise 必須保留 evidence linkage。", color: C.amber, fill: C.amberLight },
    { title: "Evaluator 放水", copy: "只回 looks good，等於沒有 evaluator。Issue schema 要逼它講清楚錯在哪。", color: C.indigo, fill: C.indigoLight },
  ], C.amber);
  sectionSlide(p, 27, "PART 5", "Mini lab：做一個 biomedical summary loop", "我們不用現場賭網路。先用 mock mode 跑通 loop，再讓學生理解如果接到真 agent，每個環節要怎麼替換。", C.green);
  tableSlide(p, 28, "LAB GOAL", "學生最後要產出三個可檢查檔案", ["產物", "用途", "檢查重點"], [
    ["final_summary.md", "給人看的 biomedical summary", "每個 claim 有 source_id，沒有臨床建議"],
    ["issue_log.json", "每輪 evaluator 和 rule checker 問題", "看得出修了什麼，剩什麼"],
    ["loop_report.json", "這次 loop 的狀態", "passed / needs_human_review / max_iterations"],
    ["review_notes.md", "學生人工檢查心得", "哪裡仍需要領域專家判斷"],
  ], C.green);
  codeSlide(p, 29, "EVIDENCE TABLE", "Lab 用小 evidence table，讓 demo 穩定", `source_id,topic,evidence_type,claim,confidence
S1,EGFR T790M,clinical,"T790M is associated with resistance to first-generation EGFR TKIs in NSCLC.",high
S2,Osimertinib,clinical,"Osimertinib has activity in T790M-positive NSCLC.",high
S3,Resistance mechanism,preclinical,"Bypass pathway activation may contribute to resistance in models.",medium`, [
    "資料小，容易教",
    "source_id 清楚",
    "包含 clinical 和 preclinical",
  ], C.green, 11);
  codeSlide(p, 30, "QUESTION SPEC", "Question spec 讓 generator 不會自由飛翔", `Summarize evidence about EGFR T790M and treatment
resistance or response in non-small cell lung cancer.

Requirements:
- Use only the provided evidence table.
- Every biomedical claim must include [source_id].
- Do not make patient-level treatment recommendations.
- Mention uncertainty for preclinical or indirect evidence.
- Output no more than 220 words.`, [
    "題目要有邊界",
    "要求可驗證引用",
    "禁止高風險輸出",
  ], C.green, 12);
  codeSlide(p, 31, "LOOP PSEUDOCODE", "完整 loop 的骨架其實很短", `def run_loop(question, evidence, max_iterations=3):
    plan = make_plan(question, evidence)
    draft = generate_summary(question, evidence, plan)
    issue_log = []

    for iteration in range(1, max_iterations + 1):
        llm_issues = evaluate_with_llm(draft, evidence)
        rule_issues = check_summary_rules(draft, evidence)
        issues = llm_issues + rule_issues
        issue_log.append({"iteration": iteration, "issues": issues})

        if has_human_review_issue(issues):
            return report("needs_human_review", draft, issue_log)
        if no_blocking_issues(issues):
            return report("passed", draft, issue_log)
        draft = revise_summary(draft, issues, evidence)

    return report("max_iterations_reached", draft, issue_log)`, [
    "generate 後立刻 evaluate",
    "LLM checks + rule checks",
    "stop 條件在 revise 前判斷",
  ], C.green, 9.7);
  compareSlide(p, 32, "MOCK MODE VS AGENT MODE", "上課 demo 要穩，課後可以換成真 agent", "Mock mode", [
    "使用預設 draft 和 issues",
    "不需要 API key",
    "保證能跑出完整 loop",
  ], "Agent mode", [
    "把 prompt 交給 Codex / Gemini / Claude",
    "可以真的產生和評估",
    "需要處理成本、延遲和不穩定",
  ], C.green);
  codeSlide(p, 33, "EXPECTED REPORT", "最後報告要讓人一眼知道能不能用", `{
  "status": "passed",
  "iterations": 2,
  "blocking_issues_remaining": 0,
  "human_review_required": false,
  "sources_used": ["S1", "S2", "S3"],
  "outputs": {
    "summary": "outputs/final_summary.md",
    "issue_log": "outputs/issue_log.json"
  }
}`, [
    "status 要明確",
    "iterations 要記錄",
    "outputs 要可追查",
  ], C.green, 12);
  tableSlide(p, 34, "REVIEW CHECKLIST", "學生人工檢查不是重做，是檢查高風險點", ["檢查項目", "問題", "不通過時怎麼辦"], [
    ["Evidence coverage", "每個 claim 都有 source_id 嗎？", "補引用或刪句子"],
    ["Overreach", "有沒有從 association 變成 clinical action？", "降級語氣或 human review"],
    ["Uncertainty", "preclinical evidence 有標不確定性嗎？", "補上限制"],
    ["Final status", "passed 真的合理嗎？", "改成 needs_human_review"],
  ], C.green);
  sectionSlide(p, 35, "PART 6", "把 loop 帶回真實 biomedical agent", "今天的 mock loop 是骨架。真實系統只是把 generator、evaluator、retriever、rule checker 換成更強的實作。", C.indigo);
  tableSlide(p, 36, "REAL-WORLD EXTENSION", "真實 biomedical loop 可以逐步升級，不要一口氣做太大", ["升級方向", "加入什麼", "新的風險"], [
    ["PubMed retrieval", "自動搜尋與排序來源", "query drift、來源過多"],
    ["Citation validation", "PMID/DOI 存在性與摘要比對", "摘要不等於全文"],
    ["Gene symbol check", "HGNC approved symbol lookup", "舊名、物種混淆"],
    ["Human review queue", "高風險 issue 送審", "責任歸屬與審查紀錄"],
  ], C.indigo);
  conceptSlide(p, 37, "DESIGN PRINCIPLE", "好的 loop 不是把人拿掉，而是讓人審得更準", [
    "低風險格式錯誤交給程式抓",
    "語意和 overstatement 交給 evaluator 先掃",
    "高風險 biomedical 判斷交給 human-in-the-loop",
    "最後把每一輪留下可追查紀錄",
  ], "Day 2 收束", [
    "Harness: 可控",
    "Spec: 可驗證",
    "Loop: 可改進",
    "Human: 可負責",
  ], C.indigo);
  const slide = baseSlide(p, 38, "WRAP-UP", "最後帶走五句話", C.indigo);
  const lines = [
    ["1. Loop 不是一直問 AI，而是有階段、有檢查、有停止條件。", C.indigo, C.indigoLight],
    ["2. Generator 負責產生，evaluator 負責挑錯，兩者要分開。", C.teal, C.tealLight],
    ["3. Self-check 只能降低風險，不能取代 rule checker 和 human review。", C.coral, C.coralLight],
    ["4. Biomedical summary 必須能追到 evidence，不可以只看起來合理。", C.green, C.greenLight],
    ["5. 好的 loop 會知道什麼時候停止，什麼時候交給人。", C.amber, C.amberLight],
  ];
  lines.forEach((line, i) => {
    const y = 166 + i * 82;
    addSurface(slide, `wrap-${i}`, 118, y, 1010, 58, line[2], line[1]);
    addText(slide, `wrap-text-${i}`, line[0], { left: 148, top: y + 16, width: 930, height: 26 }, { fontSize: 22, bold: true, color: line[1] });
  });
  notes(slide, "用五句話收尾 Day 2：harness 控制環境，spec 定義完成，loop 推動修正，人負責高風險判斷。");
}

async function main() {
  await fs.mkdir(OUT_DIR, { recursive: true });
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
