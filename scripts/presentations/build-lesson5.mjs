import fs from "node:fs/promises";
import path from "node:path";
import { Presentation, PresentationFile } from "@oai/artifact-tool";

const SCRIPT_DIR = path.dirname(new URL(import.meta.url).pathname);
const REPO_ROOT = process.env.REPO_ROOT ? path.resolve(process.env.REPO_ROOT) : path.resolve(SCRIPT_DIR, "../..");
const OUT_DIR = path.join(REPO_ROOT, "previews", "lesson-05-biomedical-evidence-table-hands-on");
const FINAL_PPTX = path.join(REPO_ROOT, "slides", "lesson-05-biomedical-evidence-table-hands-on.pptx");

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
    lineSpacing: 1.04,
    typeface,
    insets: { top: 6, right: 8, bottom: 6, left: 8 },
  };
  return node;
}

function addLine(slide, name, x1, y1, x2, y2, color, width = 1.5, dashed = false) {
  return slide.shapes.add({
    geometry: "line",
    name,
    position: { left: x1, top: y1, width: x2 - x1, height: y2 - y1 },
    fill: "none",
    line: { style: dashed ? "dashed" : "solid", fill: color, width },
  });
}

function addEyebrow(slide, text, color = C.indigo) {
  addText(slide, "eyebrow", text, { left: frame.left, top: frame.top, width: 760, height: 30 }, {
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
  addText(slide, dark ? "footer-dark" : "footer", `Hands-on lab: biomedical evidence table  |  ${n}/${TOTAL}`, {
    left: frame.left,
    top: 668,
    width: 520,
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
    fontSize: options.fontSize ?? 23,
    color: options.color ?? C.ink,
    lineSpacing: options.lineSpacing ?? 1.08,
    typeface: options.typeface ?? FONT,
    insets: { top: 0, right: 0, bottom: 0, left: 0 },
  };
  return shape;
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

function titleSlide(p, n) {
  const slide = p.slides.add();
  slide.background.fill = C.bg;
  addEyebrow(slide, "LESSON 05  |  HANDS-ON LAB", C.teal);
  addText(slide, "title", "Biomedical evidence table with AI agents", {
    left: 78,
    top: 110,
    width: 980,
    height: 70,
  }, { fontSize: 44, bold: true, color: C.ink, typeface: EN_FONT });
  addText(slide, "subtitle", "選一個 gene / drug / disease 問題，讓 agent 建表，再人工檢查與修正", {
    left: 82,
    top: 204,
    width: 960,
    height: 48,
  }, { fontSize: 27, bold: true, color: C.secondary });
  addSurface(slide, "output-box", 92, 344, 464, 170, C.tealLight, C.teal);
  addText(slide, "output-title", "今天要產出的東西", { left: 132, top: 378, width: 300, height: 30 }, {
    fontSize: 25,
    bold: true,
    color: C.teal,
  });
  addBulletList(slide, "outputs", ["evidence_table.csv", "review_checklist.md", "final_summary.md"], {
    left: 138,
    top: 430,
    width: 300,
    height: 80,
  }, { fontSize: 22, typeface: EN_FONT, spaceAfter: 8 });
  addSurface(slide, "rule-box", 690, 344, 430, 170, C.coralLight, C.coral);
  addText(slide, "rule-title", "今天的鐵律", { left: 730, top: 378, width: 240, height: 30 }, {
    fontSize: 25,
    bold: true,
    color: C.coral,
  });
  addText(slide, "rule-copy", "AI 原始輸出不能直接交。\n最後要交 human-reviewed table。", {
    left: 732,
    top: 432,
    width: 320,
    height: 64,
  }, { fontSize: 23, bold: true, color: C.ink, lineSpacing: 1.14 });
  addFooter(slide, n);
  notes(slide, "這堂課是實作課。學生要做出 evidence table，並且學會檢查 citation、claim、confidence 和人工修正。");
}

function agendaSlide(p, n) {
  const slide = baseSlide(p, n, "90-MINUTE LAB FLOW", "90 分鐘要做出一份可檢查 evidence table", C.teal);
  const rows = [
    ["0-10", "任務與評分標準", "知道 evidence table 長什麼樣。"],
    ["10-25", "設計 task spec 和 schema", "先定義欄位，不急著問 AI。"],
    ["25-40", "Codex / Gemini 示範", "看兩種 agent workflow。"],
    ["40-62", "學生建立初版 table", "讓 agent 找候選來源與抽取 claim。"],
    ["62-82", "人工檢查與修正", "PMID、quote、claim、confidence。"],
    ["82-90", "交付與回顧", "交 CSV、checklist、summary。"],
  ];
  rows.forEach((r, i) => {
    const y = 174 + i * 68;
    addNode(slide, `time-${i}`, `${r[0]} min`, 102, y, 126, 44, i < 2 ? C.indigo : i < 4 ? C.teal : C.amber, i < 2 ? C.indigoLight : i < 4 ? C.tealLight : C.amberLight, 15, EN_FONT);
    addText(slide, `role-${i}`, r[1], { left: 272, top: y + 3, width: 300, height: 26 }, { fontSize: 21, bold: true });
    addText(slide, `copy-${i}`, r[2], { left: 620, top: y + 6, width: 480, height: 24 }, { fontSize: 18, color: C.secondary });
  });
  notes(slide, "這堂課安排兩段示範和兩段學生實作。老師要提醒：初版 table 不算完成，review 後才算。");
}

function sectionSlide(p, n, eyebrow, title, subtitle, color = C.teal) {
  const slide = p.slides.add();
  slide.background.fill = color === C.coral ? C.coralLight : color === C.amber ? C.amberLight : color === C.indigo ? C.indigoLight : C.tealLight;
  addEyebrow(slide, eyebrow, color);
  addText(slide, "section-title", title, { left: 84, top: 210, width: 980, height: 94 }, {
    fontSize: 43,
    bold: true,
    color,
    lineSpacing: 1.02,
  });
  addText(slide, "section-subtitle", subtitle, { left: 88, top: 338, width: 900, height: 70 }, {
    fontSize: 26,
    bold: true,
    color: C.secondary,
    lineSpacing: 1.12,
  });
  addFooter(slide, n);
  notes(slide, subtitle);
}

function compareSlide(p, n, eyebrow, title, left, right, note, color = C.teal) {
  const slide = baseSlide(p, n, eyebrow, title, color);
  addSurface(slide, "left-box", 100, 216, 480, 278, left.fill ?? C.coralLight, left.color ?? C.coral);
  addText(slide, "left-title", left.title, { left: 140, top: 250, width: 360, height: 32 }, {
    fontSize: 25,
    bold: true,
    color: left.color ?? C.coral,
    typeface: left.typeface ?? FONT,
  });
  addBulletList(slide, "left-list", left.items, { left: 142, top: 320, width: 350, height: 128 }, {
    fontSize: 21,
    spaceAfter: 9,
    typeface: left.typeface ?? FONT,
  });
  addSurface(slide, "right-box", 700, 216, 480, 278, right.fill ?? C.tealLight, right.color ?? C.teal);
  addText(slide, "right-title", right.title, { left: 740, top: 250, width: 360, height: 32 }, {
    fontSize: 25,
    bold: true,
    color: right.color ?? C.teal,
    typeface: right.typeface ?? FONT,
  });
  addBulletList(slide, "right-list", right.items, { left: 742, top: 320, width: 350, height: 128 }, {
    fontSize: 21,
    spaceAfter: 9,
    typeface: right.typeface ?? FONT,
  });
  addText(slide, "note", note, { left: 160, top: 586, width: 960, height: 36 }, {
    fontSize: 24,
    bold: true,
    color: C.secondary,
    alignment: "center",
  });
  notes(slide, note);
}

function conceptSlide(p, n, eyebrow, title, bullets, callout, color = C.teal) {
  const slide = baseSlide(p, n, eyebrow, title, color);
  addBulletList(slide, "bullets", bullets, { left: 108, top: 214, width: 596, height: 270 }, {
    fontSize: 23,
    spaceAfter: 12,
  });
  addSurface(slide, "callout", 780, 242, 348, 220, color === C.coral ? C.coralLight : color === C.amber ? C.amberLight : color === C.indigo ? C.indigoLight : C.tealLight, color);
  addText(slide, "callout-text", callout, { left: 818, top: 292, width: 272, height: 118 }, {
    fontSize: 25,
    bold: true,
    color,
    alignment: "center",
    verticalAlignment: "middle",
    lineSpacing: 1.14,
  });
  notes(slide, `${title}。${callout}`);
}

function codeSlide(p, n, eyebrow, title, code, caption, options = {}) {
  const slide = baseSlide(p, n, eyebrow, title, options.color ?? C.indigo);
  addSurface(slide, "code-box", 92, 194, 1096, 346, C.codeBg, "#42515E");
  addText(slide, "code", code, { left: 124, top: 222, width: 1032, height: 292 }, {
    fontSize: options.fontSize ?? 17,
    color: "#E6EDF3",
    typeface: MONO,
    lineSpacing: options.lineSpacing ?? 1.12,
  });
  addText(slide, "caption", caption, { left: 150, top: 586, width: 980, height: 36 }, {
    fontSize: 23,
    bold: true,
    color: C.secondary,
    alignment: "center",
  });
  notes(slide, caption);
}

function workflowSlide(p, n) {
  const slide = baseSlide(p, n, "LAB WORKFLOW", "今天的 workflow：AI 先整理，人再驗證", C.teal);
  const nodes = [
    ["Question", C.indigo, C.indigoLight],
    ["Task spec", C.indigo, C.white],
    ["Agent draft", C.teal, C.tealLight],
    ["Source check", C.amber, C.amberLight],
    ["Human fix", C.coral, C.coralLight],
    ["Final table", C.green, C.greenLight],
  ];
  nodes.forEach((node, i) => {
    const x = 82 + i * 196;
    addNode(slide, `node-${i}`, node[0], x, 316, 138, 58, node[1], node[2], 16, EN_FONT);
    if (i > 0) addLine(slide, `line-${i}`, x - 58, 345, x, 345, C.line, 1.7);
  });
  addText(slide, "bottom", "關鍵不是產生表格，而是留下 evidence trail 和 reviewer correction。", {
    left: 160,
    top: 548,
    width: 960,
    height: 38,
  }, { fontSize: 26, bold: true, color: C.secondary, alignment: "center" });
  notes(slide, "這張建立全課流程。Agent draft 只是初稿，不是結果。");
}

function tableSlide(p, n, eyebrow, title, columns, rows, color = C.teal) {
  const slide = baseSlide(p, n, eyebrow, title, color);
  const left = 86;
  const top = 190;
  const colW = [214, 376, 420];
  columns.forEach((c, i) => {
    const x = left + colW.slice(0, i).reduce((a, b) => a + b, 0);
    addText(slide, `head-${i}`, c, { left: x + 12, top, width: colW[i] - 24, height: 28 }, {
      fontSize: 18,
      bold: true,
      color: i === 1 ? C.coral : color,
      typeface: EN_FONT,
    });
  });
  rows.forEach((r, row) => {
    const y = top + 50 + row * 64;
    r.forEach((cell, col) => {
      const x = left + colW.slice(0, col).reduce((a, b) => a + b, 0);
      addText(slide, `r${row}c${col}`, cell, { left: x + 12, top: y + 7, width: colW[col] - 24, height: 42 }, {
        fontSize: col === 0 ? 18 : 16,
        bold: col === 0,
        color: col === 1 ? C.coral : col === 2 ? C.teal : C.indigo,
        lineSpacing: 1.06,
        typeface: /[A-Za-z0-9_]/.test(cell) ? EN_FONT : FONT,
      });
    });
    addLine(slide, `rowline-${row}`, left, y + 52, 1096, y + 52, C.line, 1);
  });
  notes(slide, `${title}。逐列說明欄位和檢查方式。`);
}

function schemaSlide(p, n) {
  const slide = baseSlide(p, n, "EVIDENCE TABLE SCHEMA", "Evidence table 欄位要讓錯誤露出來", C.teal);
  const fields = [
    ["question", "研究問題"],
    ["entity_type", "gene / drug / disease"],
    ["entity", "EGFR / metformin / AD"],
    ["claim", "可被檢查的一句話"],
    ["evidence_type", "study / guideline / database"],
    ["source_id", "PMID / DOI / URL"],
    ["quoted_evidence", "原文短引證"],
    ["agent_summary", "agent 摘要"],
    ["confidence", "high / medium / low"],
    ["needs_human_review", "TRUE / FALSE"],
    ["reviewer_correction", "人工修正"],
    ["limitation", "限制和不確定性"],
  ];
  fields.forEach((f, i) => {
    const x = 96 + (i % 3) * 360;
    const y = 188 + Math.floor(i / 3) * 84;
    addNode(slide, `field-${i}`, f[0], x, y, 226, 38, i < 6 ? C.indigo : i < 10 ? C.teal : C.amber, C.white, 14, EN_FONT);
    addText(slide, `field-copy-${i}`, f[1], { left: x, top: y + 46, width: 226, height: 26 }, {
      fontSize: 16,
      color: C.secondary,
      alignment: "center",
    });
  });
  addText(slide, "note", "不要只要摘要欄位；沒有 citation、quote、review 欄位，就很難抓錯。", {
    left: 160,
    top: 590,
    width: 960,
    height: 34,
  }, { fontSize: 23, bold: true, color: C.coral, alignment: "center" });
  notes(slide, "欄位設計是安全設計。讓學生知道 schema 不是行政表格，而是錯誤偵測工具。");
}

function sampleQuestionSlide(p, n) {
  const slide = baseSlide(p, n, "CHOOSE A QUESTION", "每組選一個問題，不要選整個宇宙", C.teal);
  const cards = [
    ["Gene", "EGFR exon 19 deletion 和 NSCLC 治療反應有什麼證據？", C.indigo, C.indigoLight],
    ["Drug", "Metformin 和 Alzheimer’s disease 風險是否有關？", C.teal, C.tealLight],
    ["Disease", "APOE ε4 和 Alzheimer’s disease 的證據強度是什麼？", C.amber, C.amberLight],
  ];
  cards.forEach((c, i) => {
    const x = 110 + i * 370;
    addSurface(slide, `card-${i}`, x, 230, 300, 250, c[3], c[2]);
    addText(slide, `label-${i}`, c[0], { left: x + 34, top: 266, width: 220, height: 30 }, {
      fontSize: 27,
      bold: true,
      color: c[2],
      typeface: EN_FONT,
      alignment: "center",
    });
    addText(slide, `copy-${i}`, c[1], { left: x + 38, top: 340, width: 220, height: 96 }, {
      fontSize: 22,
      bold: true,
      color: C.ink,
      alignment: "center",
      lineSpacing: 1.12,
    });
  });
  addText(slide, "note", "問題越小，table 越可靠；問題越大，AI 越會開始表演。", {
    left: 178,
    top: 586,
    width: 920,
    height: 36,
  }, { fontSize: 24, bold: true, color: C.coral, alignment: "center" });
  notes(slide, "提醒學生縮小問題，避免太大題目讓 agent 生成空泛摘要。");
}

function rubricSlide(p, n) {
  tableSlide(p, n, "CONFIDENCE RUBRIC", "Confidence 不是心情，是 evidence 規則", ["Label", "Use when", "Do not use when"], [
    ["High", "claim 有明確 primary source 或 guideline 支持", "只有 review 泛泛提到"],
    ["Medium", "有相關證據，但 population / endpoint 不完全符合", "模型自己推論出來"],
    ["Low", "只有間接證據或來源品質弱", "其實找不到來源"],
    ["Not found", "查不到支持該 claim 的來源", "為了交作業硬填"],
  ], C.amber);
}

function reviewChecklistSlide(p, n) {
  const slide = baseSlide(p, n, "MANUAL REVIEW", "人工檢查不是補儀式，是抓 AI 最會犯的錯", C.coral);
  const checks = [
    "PMID / DOI 是否真的存在？",
    "quoted_evidence 是否真的支持 claim？",
    "是否把 association 講成 causation？",
    "gene symbol / drug name / disease subtype 是否正確？",
    "資料庫或 guideline 是否有版本與日期？",
    "confidence 是否太樂觀？",
  ];
  checks.forEach((c, i) => {
    const x = 112 + (i % 2) * 540;
    const y = 198 + Math.floor(i / 2) * 108;
    addNode(slide, `num-${i}`, `${i + 1}`, x, y, 48, 48, i < 3 ? C.coral : C.amber, i < 3 ? C.coralLight : C.amberLight, 20, EN_FONT);
    addText(slide, `check-${i}`, c, { left: x + 70, top: y + 5, width: 380, height: 58 }, {
      fontSize: 22,
      bold: true,
      color: C.ink,
      lineSpacing: 1.08,
    });
  });
  notes(slide, "這張是 review checklist，可以要求學生實際對每列 table 勾選。");
}

function deliverableSlide(p, n) {
  const slide = p.slides.add();
  slide.background.fill = C.dark;
  addText(slide, "title", "最後交付：不是 AI 做的表，是你審過的 evidence table", {
    left: 84,
    top: 82,
    width: 1000,
    height: 96,
  }, { fontSize: 40, bold: true, color: C.white, lineSpacing: 1.05 });
  const deliverables = [
    ["evidence_table.csv", "含來源、引用、confidence、review 欄位"],
    ["review_checklist.md", "列出你查過什麼、修正什麼"],
    ["final_summary.md", "用 5-8 句總結 evidence strength"],
  ];
  deliverables.forEach((d, i) => {
    const y = 238 + i * 112;
    addNode(slide, `file-${i}`, d[0], 132, y, 300, 54, i === 0 ? C.teal : i === 1 ? C.amber : C.coral, "#25313A", 18, EN_FONT);
    addText(slide, `desc-${i}`, d[1], { left: 484, top: y + 10, width: 540, height: 32 }, {
      fontSize: 24,
      bold: true,
      color: "#DDE4E8",
    });
  });
  addText(slide, "bottom", "今天的重點：agent 幫你加速，review 讓成果可信。", {
    left: 220,
    top: 590,
    width: 840,
    height: 36,
  }, { fontSize: 26, bold: true, color: "#FFD98A", alignment: "center" });
  addFooter(slide, n, true);
  notes(slide, "收束：學生最後交的是 human-reviewed artifact。");
}

function buildSlides(p) {
  titleSlide(p, 1);
  agendaSlide(p, 2);
  workflowSlide(p, 3);
  sampleQuestionSlide(p, 4);
  sectionSlide(p, 5, "PART 1", "先設計任務，不要一開始就叫 AI 開工", "Hands-on 課最常見錯誤：prompt 太大、欄位太少、沒有驗證規則。", C.indigo);
  conceptSlide(p, 6, "TASK SPEC", "Task spec 是這堂 lab 的實驗 protocol", [
    "研究問題要小到可以在 90 分鐘內檢查",
    "指定 entity、來源類型、輸出欄位、停止規則",
    "先定義完成標準，再讓 agent 產生初稿",
  ], "不要說：幫我整理。\n要說：照規格建表。", C.indigo);
  codeSlide(p, 7, "TASK SPEC TEMPLATE", "學生先填這份 task spec", `question: <one focused biomedical question>
entity_type: gene | drug | disease
entity: <approved name>
allowed_sources: PubMed, DOI, guideline, database page
output_file: evidence_table.csv
not_found_rule: write "not_found"; do not invent
review_boundary: clinical claim must be human-reviewed`, "這一頁讓學生先填，不要讓 agent 猜你的作業規格。", { color: C.indigo, fontSize: 17 });
  schemaSlide(p, 8);
  codeSlide(p, 9, "CSV HEADER", "Evidence table CSV 欄位範本", `question,entity_type,entity,claim,evidence_type,source_title,
source_id,PMID_or_DOI,year,quoted_evidence,agent_summary,
confidence,limitation,needs_human_review,reviewer_correction`, "欄位多一點不是為了漂亮，是為了讓錯誤比較難躲起來。", { color: C.teal, fontSize: 17 });
  rubricSlide(p, 10);
  sectionSlide(p, 11, "PART 2", "Codex 示範：檔案型 workflow", "Codex 適合讀寫資料夾、產生 CSV、跑檢查程式、根據 reviewer correction 修改檔案。", C.teal);
  codeSlide(p, 12, "STARTER FOLDER", "Codex lab folder 建議長這樣", `lesson-05-lab/
  question.md
  task_spec.md
  sources/
  evidence_table.csv
  review_checklist.md
  final_summary.md
  scripts/check_table.py`, "資料夾就是 workflow 的記憶。每一步輸出都留下來。", { color: C.teal, fontSize: 18 });
  codeSlide(p, 13, "QUESTION.MD", "question.md 範例", `# Research question
What evidence supports the association between
EGFR exon 19 deletion and response to EGFR-TKI
therapy in non-small cell lung cancer?

Scope: human NSCLC only
Do not make patient-specific treatment advice.`, "先把 scope 寫死，否則 agent 很容易把題目越做越大。", { color: C.teal, fontSize: 17 });
  codeSlide(p, 14, "CODEX PROMPT 1", "Codex demo prompt：建立初版 table", `Read question.md and task_spec.md.
Create evidence_table.csv using the required columns.
Find candidate evidence from sources/ first.
For each claim, include source_id, PMID_or_DOI,
quoted_evidence, confidence, and needs_human_review.
If evidence is missing, write not_found.
Do not invent citations.`, "這個 prompt 的重點是：先讀規格、先用來源、缺證據就停止。", { color: C.teal, fontSize: 17 });
  codeSlide(p, 15, "CODEX PROMPT 2", "Codex demo prompt：根據人工檢查修正", `Read review_checklist.md and evidence_table.csv.
Apply reviewer corrections only where the checklist says so.
Do not add new claims unless a source_id is provided.
Keep old content in reviewer_correction when a row changes.
Then update final_summary.md in 5-8 sentences.`, "修正階段要把人工 review 當權威，不要讓 agent 自己再發揮一次。", { color: C.teal, fontSize: 17 });
  codeSlide(p, 16, "CHECK SCRIPT", "Python 檢查：欄位是否完整", `import csv, sys

required = ["claim", "source_id", "PMID_or_DOI",
            "quoted_evidence", "confidence",
            "needs_human_review"]

with open("evidence_table.csv", newline="") as f:
    rows = list(csv.DictReader(f))

missing = [c for c in required if c not in rows[0]]
if missing:
    sys.exit("Missing columns: " + ", ".join(missing))

print(f"OK: {len(rows)} evidence rows")`, "先檢查表格結構，再討論內容品質。", { color: C.indigo, fontSize: 16 });
  codeSlide(p, 17, "CHECK SCRIPT", "Python 檢查：不能有空 citation", `bad = []
for i, row in enumerate(rows, start=2):
    if row["PMID_or_DOI"].strip() in ["", "TBD", "unknown"]:
        bad.append((i, row["claim"]))
    if row["quoted_evidence"].strip() == "":
        bad.append((i, "missing quote"))

if bad:
    for line, problem in bad:
        print(f"Line {line}: {problem}")
    sys.exit("Fix citation / quote fields")

print("OK: citation fields are filled")`, "程式檢查抓格式，人工檢查抓真假。兩個都要。", { color: C.indigo, fontSize: 16 });
  sectionSlide(p, 18, "PART 3", "Gemini 示範：source discovery + 初步整理", "Gemini 可以當資料探索和初步整理範例，但 citation 仍然要人工打開確認。", C.amber);
  codeSlide(p, 19, "GEMINI PROMPT 1", "Gemini demo prompt：找候選來源", `I am building a biomedical evidence table.
Question: <paste one focused question>

Find candidate sources only.
Return a table with:
- source title
- PMID or DOI
- one-sentence relevance
- why it may be useful
- what must be manually checked

Do not make final claims yet.`, "Gemini 這一步只做 source discovery，不急著讓它下結論。", { color: C.amber, fontSize: 17 });
  codeSlide(p, 20, "GEMINI PROMPT 2", "Gemini demo prompt：把候選來源變成 draft rows", `Using only the candidate sources above,
draft evidence_table rows with these fields:
claim, evidence_type, source_id, PMID_or_DOI,
quoted_evidence, agent_summary, confidence,
limitation, needs_human_review.

If a source does not clearly support the claim,
write confidence=low and needs_human_review=TRUE.`, "Gemini 初稿可以快，但每個 PMID / DOI 仍要自己點開查。", { color: C.amber, fontSize: 16 });
  compareSlide(p, 21, "CODEX VS GEMINI", "兩個 agent 在這堂 lab 的角色不同", {
    title: "Codex route",
    items: ["檔案型 workflow", "CSV / Markdown 產出", "跑 Python 檢查", "依 reviewer correction 修改"],
    color: C.teal,
    fill: C.tealLight,
  }, {
    title: "Gemini route",
    items: ["source discovery", "快速比較候選文獻", "產生初版 rows", "列出人工確認點"],
    color: C.amber,
    fill: C.amberLight,
  }, "兩條路都可以；最後都必須回到人工驗證。", C.indigo);
  sectionSlide(p, 22, "PART 4", "學生實作：建立初版 evidence table", "現在開始不是看老師表演，是讓 agent 替你產生可檢查的初稿。", C.teal);
  conceptSlide(p, 23, "STUDENT STEP 1", "先選題，再縮小 scope", [
    "只能選一個 gene / drug / disease 問題",
    "指定 disease subtype、population、endpoint",
    "避開「整理所有證據」這種會爆炸的題目",
  ], "題目越小，\n越能驗證。", C.teal);
  conceptSlide(p, 24, "STUDENT STEP 2", "把 task spec 交給 agent，而不是交給命運", [
    "貼上 task_spec.md",
    "指定 evidence table 欄位",
    "指定 not_found_rule 和 human_review_boundary",
  ], "規格越清楚，\nAI 越少亂補。", C.teal);
  conceptSlide(p, 25, "STUDENT STEP 3", "讓 agent 產生初版，不要急著相信", [
    "初版 table 至少 5-8 rows",
    "每列必須有 claim、source_id、quote、confidence",
    "沒有來源的 row 要標 not_found 或刪除",
  ], "初版只是草稿，\n不是成果。", C.teal);
  codeSlide(p, 26, "MINIMUM TABLE", "最小可接受 evidence row", `claim: EGFR exon 19 deletion predicts response to EGFR-TKI in NSCLC
evidence_type: clinical study
PMID_or_DOI: <must be verified>
quoted_evidence: "<short quote from source>"
agent_summary: one-sentence interpretation
confidence: medium
limitation: population / endpoint / study design
needs_human_review: TRUE
reviewer_correction: <filled after checking>`, "每列都要能被人打開來源檢查；不能只是一句漂亮摘要。", { color: C.teal, fontSize: 16 });
  sectionSlide(p, 27, "PART 5", "人工檢查與修正", "這是整堂課最重要的地方：抓出 agent 看起來很會、其實沒查好的地方。", C.coral);
  reviewChecklistSlide(p, 28);
  tableSlide(p, 29, "REVIEW FAILURE MODES", "人工 review 常會抓到這些錯", ["Failure", "Typical symptom", "Fix"], [
    ["Fake citation", "PMID 存在但不支持 claim", "replace claim or source"],
    ["Quote mismatch", "quote 和 summary 意思不同", "rewrite summary"],
    ["Overclaim", "association 被講成 treatment advice", "lower confidence"],
    ["Wrong entity", "gene alias / disease subtype 混淆", "correct entity"],
    ["Version issue", "database page 沒日期", "add version/date"],
  ], C.coral);
  codeSlide(p, 30, "REVIEW CHECKLIST", "review_checklist.md 範本", `# Manual review checklist

Row ID:
Source opened: yes / no
PMID_or_DOI valid: yes / no
Quote supports claim: yes / no
Overclaim risk: yes / no
Entity names checked: yes / no
Reviewer correction:
Decision: keep / revise / delete`, "讓學生把人工檢查寫下來，不要只在心裡覺得有看過。", { color: C.coral, fontSize: 17 });
  codeSlide(p, 31, "FINAL SUMMARY", "final_summary.md 範本", `# Final summary

Question:
Number of evidence rows:
Strongest supported claim:
Weakest or uncertain claim:
Rows deleted after review:
Main limitation:
What should be checked by a domain expert:

Conclusion: <5-8 sentences>`, "summary 要反映 review 後的結果，不是 agent 初稿的興奮程度。", { color: C.coral, fontSize: 17 });
  sectionSlide(p, 32, "PART 6", "交付、評分、回顧", "最後 8 分鐘收斂成果：能不能交出可查、可改、可重現的 table。", C.indigo);
  tableSlide(p, 33, "GRADING RUBRIC", "這堂 hands-on 要看的是 workflow，不是誰問得最華麗", ["Item", "Full credit", "Common miss"], [
    ["Task spec", "scope 清楚，欄位和停止規則完整", "題目太大"],
    ["Evidence table", "每列有 source、quote、confidence", "只有摘要"],
    ["Citation check", "PMID / DOI 已人工確認", "citation 未開啟"],
    ["Review log", "有 reviewer correction", "只交 AI 原始輸出"],
    ["Summary", "有講限制和不確定性", "過度下結論"],
  ], C.indigo);
  conceptSlide(p, 34, "TEACHER LIVE DEMO", "老師示範時可以故意讓 agent 犯一次錯", [
    "讓 agent 產生一個 citation，現場打開查",
    "示範 quote 不支持 claim 時如何修正",
    "示範 confidence 從 high 降到 low",
  ], "抓錯比產生更有教育價值。", C.coral);
  conceptSlide(p, 35, "STUDENT TROUBLESHOOTING", "學生卡住時，先問是哪一層壞掉", [
    "沒有來源：縮小問題或改成 source discovery",
    "table 太空：schema 太嚴或來源不足",
    "claim 太浮誇：要求 evidence quote 和 limitation",
    "citation 很怪：回到人工 lookup",
  ], "卡住不是失敗，\n是 workflow 在提醒你檢查。", C.amber);
  codeSlide(p, 36, "ONE-PROMPT RESCUE", "救援 prompt：當 agent 開始亂飛", `Stop and audit the table.
For each row, mark one of:
- supported_by_quote
- citation_not_checked
- quote_does_not_support_claim
- overclaim
- not_found

Do not add new evidence.
Only classify existing rows and suggest fixes.`, "學生慌掉時，用 audit prompt 把 agent 拉回檢查模式。", { color: C.amber, fontSize: 17 });
  conceptSlide(p, 37, "WHAT STUDENTS SHOULD LEARN", "今天學到的不是做表格，是做可驗證的 AI workflow", [
    "先定義問題與 schema",
    "讓 agent 產生可檢查初稿",
    "用程式抓格式問題",
    "用人工 review 抓 biomedical 問題",
    "留下修正紀錄和限制",
  ], "AI 加速整理，\n人負責可信度。", C.teal);
  deliverableSlide(p, 38);
}

async function main() {
  await fs.mkdir(OUT_DIR, { recursive: true });
  await fs.mkdir(path.dirname(FINAL_PPTX), { recursive: true });

  const presentation = Presentation.create({ slideSize: { width: W, height: H } });
  buildSlides(presentation);

  for (const [index, slide] of presentation.slides.items.entries()) {
    const stem = `slide-${String(index + 1).padStart(2, "0")}`;
    await writeBlob(path.join(OUT_DIR, `${stem}.png`), await presentation.export({ slide, format: "png", scale: 1 }));
    await fs.writeFile(path.join(OUT_DIR, `${stem}.layout.json`), await (await slide.export({ format: "layout" })).text());
  }
  await writeBlob(path.join(OUT_DIR, "montage.webp"), await presentation.export({ format: "webp", montage: true, scale: 1 }));
  const pptx = await PresentationFile.exportPptx(presentation);
  await pptx.save(FINAL_PPTX);
  console.log(FINAL_PPTX);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
