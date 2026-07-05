import fs from "node:fs/promises";
import path from "node:path";
import { Presentation, PresentationFile } from "@oai/artifact-tool";

const SCRIPT_DIR = path.dirname(new URL(import.meta.url).pathname);
const REPO_ROOT = process.env.REPO_ROOT ? path.resolve(process.env.REPO_ROOT) : path.resolve(SCRIPT_DIR, "../..");
const OUT_DIR = path.join(REPO_ROOT, "previews", "lesson-04-desktop-agent-literature-evidence-workflow");
const FINAL_PPTX = path.join(REPO_ROOT, "slides", "lesson-04-desktop-agent-literature-evidence-workflow.pptx");

const W = 1280;
const H = 720;
const TOTAL = 22;
const frame = { left: 76, top: 58, width: 1128, height: 594 };

const C = {
  bg: "#F7F8F6",
  grayBg: "#EEF1F2",
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

function addLine(slide, name, x1, y1, x2, y2, color = C.line, width = 1.4, dashed = false) {
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
  addText(slide, dark ? "footer-dark" : "footer", `Desktop agent literature workflow  |  ${n}/${TOTAL}`, {
    left: frame.left,
    top: 668,
    width: 540,
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

function codeBox(slide, name, text, x, y, w, h, fontSize = 16) {
  addSurface(slide, `${name}-bg`, x, y, w, h, C.codeBg, "#3A4650");
  addText(slide, name, text, { left: x + 18, top: y + 18, width: w - 36, height: h - 36 }, {
    fontSize,
    color: "#EEF3F4",
    typeface: MONO,
    lineSpacing: 1.13,
  });
}

function tableHeader(slide, labels, xs, y, widths, color = C.indigo) {
  labels.forEach((label, i) => {
    addText(slide, `table-head-${label}-${i}`, label, { left: xs[i], top: y, width: widths[i], height: 24 }, {
      fontSize: 15,
      bold: true,
      color,
      typeface: EN_FONT,
      alignment: i === 0 ? "center" : "left",
    });
  });
}

function titleSlide(p) {
  const slide = p.slides.add();
  slide.background.fill = C.bg;
  addEyebrow(slide, "LESSON 04  |  DESKTOP AGENT WORKFLOW", C.teal);
  addText(slide, "title", "Literature search to evidence table", {
    left: 78,
    top: 112,
    width: 900,
    height: 70,
  }, { fontSize: 46, bold: true, color: C.ink, typeface: EN_FONT });
  addText(slide, "subtitle", "如何用 agent 查文獻、產生可審核 evidence table，並區分文獻證據與模型推測", {
    left: 82,
    top: 218,
    width: 980,
    height: 70,
  }, { fontSize: 27, bold: true, color: C.indigo, lineSpacing: 1.1 });
  ["search strategy", "source inventory", "evidence table", "research note"].forEach((label, i) => {
    addNode(slide, `entry-${i}`, label, 112 + i * 270, 412, 208, 58, [C.teal, C.indigo, C.amber, C.coral][i], C.white, 18, EN_FONT);
  });
  addText(slide, "note", "Demo theme: NSCLC precision oncology literature evidence", {
    left: 206,
    top: 548,
    width: 860,
    height: 34,
  }, { fontSize: 23, bold: true, color: C.secondary, alignment: "center", typeface: EN_FONT });
  addFooter(slide, 1);
  notes(slide, "本堂課定位為老師示範課。重點是讓學生看到完整 workflow，而不是只看到 agent 生成的一張表。");
}

function slide2(p) {
  const slide = baseSlide(p, 2, "LEARNING JOB", "這堂課不是要得到答案，而是要留下可檢查的查證流程", C.teal);
  const items = [
    ["Agent 可以做", ["拆研究問題", "產生 query", "整理候選文獻", "產出初版 table"]],
    ["人必須檢查", ["PMID / DOI 是否存在", "source 是否支持 claim", "sample size 是否照抄", "推測是否被標記"]],
  ];
  items.forEach(([head, bullets], i) => {
    const x = 126 + i * 560;
    addSurface(slide, `panel-${i}`, x, 226, 440, 278, i === 0 ? C.tealLight : C.amberLight, i === 0 ? C.teal : C.amber);
    addText(slide, `head-${i}`, head, { left: x + 34, top: 262, width: 320, height: 34 }, {
      fontSize: 30,
      bold: true,
      color: i === 0 ? C.teal : C.amber,
    });
    addBulletList(slide, `bullets-${i}`, bullets, { left: x + 78, top: 344, width: 300, height: 106 }, {
      fontSize: 23,
      spaceAfter: 9,
    });
  });
  addText(slide, "bottom", "核心標準：任何 biomedical claim 都要能回到來源、欄位和人工 review。", {
    left: 166,
    top: 580,
    width: 950,
    height: 32,
  }, { fontSize: 23, bold: true, color: C.ink, alignment: "center" });
  notes(slide, "這張和課綱對齊：如何讓 agent 產出的 evidence table 能被人檢查，而不是只有看起來整齊。");
}

function slide3(p) {
  const slide = baseSlide(p, 3, "DEMO QUESTION", "Demo 問題要小到能查證，也要足夠真實", C.indigo);
  addSurface(slide, "question", 104, 186, 1072, 112, C.indigoLight, C.indigo);
  addText(slide, "question-text", "在 NSCLC precision oncology 中，EGFR、ALK、TP53 相關 claim 要如何整理成 evidence table？", {
    left: 146,
    top: 222,
    width: 980,
    height: 42,
  }, { fontSize: 27, bold: true, color: C.indigo, alignment: "center" });
  const rows = [
    ["Disease", "advanced NSCLC / lung adenocarcinoma"],
    ["Genes", "EGFR, ALK, TP53"],
    ["Drugs", "osimertinib, crizotinib, chemotherapy"],
    ["Output", "CSV evidence table + review note"],
  ];
  rows.forEach((row, i) => {
    const y = 356 + i * 54;
    addNode(slide, `row-head-${i}`, row[0], 166, y, 150, 38, [C.teal, C.indigo, C.amber, C.coral][i], C.white, 16, EN_FONT);
    addText(slide, `row-copy-${i}`, row[1], { left: 360, top: y + 8, width: 720, height: 24 }, {
      fontSize: 21,
      color: C.secondary,
      typeface: EN_FONT,
    });
  });
  notes(slide, "示範問題故意設計為小型但真實，讓學生可以看見任務拆解和 evidence table schema 的必要性。");
}

function slide4(p) {
  const slide = baseSlide(p, 4, "TASK DECOMPOSITION", "先把研究問題拆成 query 能處理的概念塊", C.teal);
  const blocks = [
    ["Disease", "NSCLC\nlung adenocarcinoma", C.teal, C.tealLight],
    ["Gene", "EGFR\nALK\nTP53", C.indigo, C.indigoLight],
    ["Drug", "osimertinib\ncrizotinib\nEGFR-TKI", C.amber, C.amberLight],
    ["Evidence", "clinical trial\nmolecular profiling\nreview needed", C.coral, C.coralLight],
  ];
  blocks.forEach(([head, copy, color, fill], i) => {
    const x = 94 + i * 296;
    addSurface(slide, `block-${i}`, x, 232, 246, 220, fill, color);
    addText(slide, `block-head-${i}`, head, { left: x + 28, top: 264, width: 180, height: 30 }, {
      fontSize: 24,
      bold: true,
      color,
      typeface: EN_FONT,
    });
    addText(slide, `block-copy-${i}`, copy, { left: x + 32, top: 330, width: 176, height: 90 }, {
      fontSize: 22,
      bold: true,
      color: C.ink,
      lineSpacing: 1.18,
      typeface: EN_FONT,
    });
  });
  addText(slide, "bottom", "這一步讓 agent 產生 search strategy，而不是直接產生結論。", {
    left: 190,
    top: 566,
    width: 900,
    height: 34,
  }, { fontSize: 24, bold: true, color: C.teal, alignment: "center" });
  notes(slide, "對應課綱的研究問題拆解：研究主題、gene list、disease scope、資料類型和輸出格式。");
}

function slide5(p) {
  const slide = baseSlide(p, 5, "DEMO FILES", "Demo 會留下五個可以檢查的檔案", C.amber);
  const files = [
    ["task_spec.md", "研究問題、欄位、規則"],
    ["prompts.md", "設計過的 agent prompts"],
    ["source_inventory.csv", "PMID / DOI / title / n"],
    ["evidence_table.demo.csv", "可審核 evidence rows"],
    ["research_note.demo.md", "摘要、限制、下一步"],
  ];
  files.forEach(([file, desc], i) => {
    const y = 178 + i * 72;
    addSurface(slide, `file-${i}`, 146, y, 400, 50, i % 2 === 0 ? C.white : C.grayBg, C.line);
    addText(slide, `file-name-${i}`, file, { left: 174, top: y + 13, width: 260, height: 24 }, {
      fontSize: 20,
      bold: true,
      color: [C.indigo, C.teal, C.coral, C.amber, C.secondary][i],
      typeface: EN_FONT,
    });
    addText(slide, `file-desc-${i}`, desc, { left: 620, top: y + 13, width: 420, height: 24 }, {
      fontSize: 21,
      color: C.secondary,
    });
    addLine(slide, `file-line-${i}`, 560, y + 25, 604, y + 25, C.line, 1.2);
  });
  addText(slide, "path", "demos/lesson-04-literature-evidence-workflow/", {
    left: 260,
    top: 580,
    width: 760,
    height: 30,
  }, { fontSize: 21, bold: true, color: C.ink, alignment: "center", typeface: MONO });
  notes(slide, "這張告訴學生真正的輸出不是投影片，而是一個可交接的 demo bundle。");
}

function slide6(p) {
  const slide = baseSlide(p, 6, "WORKFLOW MAP", "Agent workflow 要把搜尋、整理、查證和筆記分開", C.indigo);
  const steps = [
    ["1", "Question", C.indigo],
    ["2", "Search\nstrategy", C.teal],
    ["3", "Source\ninventory", C.teal],
    ["4", "Evidence\ntable", C.amber],
    ["5", "Human\nreview", C.coral],
    ["6", "Research\nnote", C.indigo],
  ];
  steps.forEach(([num, label, color], i) => {
    const x = 80 + i * 190;
    if (i > 0) addLine(slide, `flow-line-${i}`, x - 54, 360, x - 8, 360, C.line, 1.4);
    addNode(slide, `step-${i}`, `${num}\n${label}`, x, 308, 138, 104, color, color === C.amber ? C.amberLight : C.white, 17, EN_FONT);
  });
  addText(slide, "bottom", "每一步都有自己的 artifact；不要讓 agent 一次完成所有事。", {
    left: 210,
    top: 540,
    width: 860,
    height: 34,
  }, { fontSize: 24, bold: true, color: C.ink, alignment: "center" });
  notes(slide, "這張有線，但只使用水平線，並且線在節點前畫，避免 PowerPoint connector 問題。");
}

function slide7(p) {
  const slide = baseSlide(p, 7, "SEARCH STRATEGY", "先要求 agent 產生搜尋策略，不要直接要答案", C.teal);
  const cols = [
    ["Concept blocks", "disease / genes / drugs / evidence type"],
    ["Query strings", "PubMed-style Boolean query"],
    ["Filters", "clinical trial / molecular profiling / date"],
    ["Capture fields", "PMID / DOI / title / n / conclusion"],
  ];
  cols.forEach(([head, copy], i) => {
    const x = 110 + (i % 2) * 535;
    const y = 210 + Math.floor(i / 2) * 158;
    addSurface(slide, `strategy-${i}`, x, y, 444, 106, i % 2 === 0 ? C.tealLight : C.white, i % 2 === 0 ? C.teal : C.indigo);
    addText(slide, `strategy-head-${i}`, head, { left: x + 28, top: y + 22, width: 220, height: 28 }, {
      fontSize: 23,
      bold: true,
      color: i % 2 === 0 ? C.teal : C.indigo,
      typeface: EN_FONT,
    });
    addText(slide, `strategy-copy-${i}`, copy, { left: x + 28, top: y + 64, width: 370, height: 24 }, {
      fontSize: 19,
      color: C.secondary,
      typeface: EN_FONT,
    });
  });
  addText(slide, "rule", "Rule: 找不到來源時寫 not_found，不要補一個看起來合理的 PMID。", {
    left: 168,
    top: 566,
    width: 940,
    height: 34,
  }, { fontSize: 24, bold: true, color: C.coral, alignment: "center" });
  notes(slide, "對應課綱的 literature search workflow：保留來源、日期、關鍵字和排除條件。");
}

function slide8(p) {
  const slide = baseSlide(p, 8, "PROMPT 1", "設計 prompt 時先限制 agent 的輸出範圍", C.indigo);
  codeBox(slide, "prompt1", `You are assisting with a biomedical literature evidence table.

Research question:
For NSCLC, identify literature-backed claims involving EGFR,
ALK, or TP53, and separate treatment-efficacy evidence
from molecular-context evidence and model speculation.

Before searching, produce a search strategy only.

Rules:
- Do not answer the biomedical question yet.
- Do not invent PMIDs, DOIs, sample sizes, or conclusions.
- Mark unsupported guesses as model_inference_candidate.`, 110, 190, 1060, 386, 18);
  addText(slide, "file", "Full prompt: demos/lesson-04-literature-evidence-workflow/prompts.md", {
    left: 168,
    top: 604,
    width: 940,
    height: 24,
  }, { fontSize: 18, bold: true, color: C.secondary, alignment: "center", typeface: MONO });
  notes(slide, "這張示範 prompt design：先要 search strategy，而不是讓 agent 直接生成 evidence table。");
}

function slide9(p) {
  const slide = baseSlide(p, 9, "SOURCE INVENTORY", "候選文獻先進 source inventory，再進 evidence table", C.teal);
  tableHeader(slide, ["PMID", "source", "type", "n", "use"], [96, 224, 560, 780, 886], 190, [90, 300, 180, 70, 280], C.teal);
  const rows = [
    ["29151359", "Osimertinib in EGFR-mutated advanced NSCLC", "phase 3 RCT", "556", "treatment evidence"],
    ["25470694", "Crizotinib vs chemotherapy in ALK+ lung cancer", "phase 3 RCT", "343", "treatment evidence"],
    ["25079552", "TCGA lung adenocarcinoma molecular profiling", "profiling cohort", "230", "molecular context"],
  ];
  rows.forEach((row, i) => {
    const y = 228 + i * 80;
    addSurface(slide, `source-row-${i}`, 80, y - 10, 1120, 58, i % 2 === 0 ? C.white : C.grayBg, C.line);
    row.forEach((cell, j) => {
      addText(slide, `source-${i}-${j}`, cell, { left: [96, 224, 560, 780, 886][j], top: y + 3, width: [90, 300, 180, 70, 280][j], height: 28 }, {
        fontSize: j === 1 ? 17 : 16,
        bold: j === 0,
        color: j === 0 ? C.indigo : C.secondary,
        typeface: j === 0 ? EN_FONT : FONT,
      });
    });
  });
  addText(slide, "rule", "只有 source inventory 通過基本檢查後，才允許 agent 抽 evidence rows。", {
    left: 160,
    top: 548,
    width: 960,
    height: 32,
  }, { fontSize: 23, bold: true, color: C.ink, alignment: "center" });
  notes(slide, "資料來自 PubMed abstract / E-utilities：PMID 29151359、25470694、25079552。");
}

function slide10(p) {
  const slide = baseSlide(p, 10, "EVIDENCE TABLE SCHEMA", "Evidence table 欄位要能回答：誰說了什麼，憑什麼？", C.amber);
  const groups = [
    ["Entity", ["gene", "disease", "drug"], C.indigo, C.indigoLight],
    ["Evidence", ["claim", "study_type", "sample_n"], C.teal, C.tealLight],
    ["Trace", ["PMID", "DOI", "source_note"], C.amber, C.amberLight],
    ["Status", ["supported", "not_found", "needs_review"], C.coral, C.coralLight],
  ];
  groups.forEach(([head, fields, color, fill], i) => {
    const x = 100 + i * 292;
    addSurface(slide, `schema-${i}`, x, 238, 246, 210, fill, color);
    addText(slide, `schema-head-${i}`, head, { left: x + 28, top: 270, width: 160, height: 30 }, {
      fontSize: 25,
      bold: true,
      color,
      typeface: EN_FONT,
    });
    addBulletList(slide, `schema-fields-${i}`, fields, { left: x + 42, top: 330, width: 150, height: 84 }, {
      fontSize: 20,
      color: C.ink,
      typeface: EN_FONT,
      spaceAfter: 5,
    });
  });
  addText(slide, "bottom", "欄位不是越多越好；每個欄位都要支援 review。", {
    left: 250,
    top: 562,
    width: 780,
    height: 34,
  }, { fontSize: 24, bold: true, color: C.amber, alignment: "center" });
  notes(slide, "對應使用者要求的欄位：PMID、研究類型、樣本數、疾病、基因、藥物、結論。");
}

function slide11(p) {
  const slide = baseSlide(p, 11, "PROMPT 2", "抽 evidence row 時，要求 agent 只用已驗證來源", C.teal);
  codeBox(slide, "prompt2", `Convert the verified source inventory into an evidence table.

Required columns:
question, entity_type, gene, disease, drug, claim,
evidence_kind, study_type, sample_n, source_title,
PMID, DOI, year, source_note, status, model_inference.

Rules:
- One row makes one narrow claim.
- Use literature_evidence only when the source supports the claim.
- Use molecular_context when the source is biology, not treatment efficacy.
- Use model_inference when no PMID or DOI supports the statement.
- Every row starts with needs_human_review=TRUE.`, 108, 182, 1064, 404, 17);
  notes(slide, "這張是 evidence extraction prompt。重點是 evidence_kind 和 model_inference 欄位。");
}

function slide12(p) {
  const slide = baseSlide(p, 12, "DEMO TABLE", "一份好的 evidence table 應該讓錯誤容易被看見", C.amber);
  tableHeader(slide, ["gene", "drug", "PMID", "n", "evidence kind", "status"], [96, 204, 354, 474, 584, 810], 188, [80, 130, 90, 60, 180, 170], C.amber);
  const rows = [
    ["EGFR", "osimertinib", "29151359", "556", "literature_evidence", "supported"],
    ["ALK", "crizotinib", "25470694", "343", "literature_evidence", "supported"],
    ["EGFR/MET/etc.", "NA", "25079552", "230", "molecular_context", "supported"],
    ["TP53", "targeted therapy", "NA", "UNKNOWN", "model_inference", "needs_source"],
  ];
  rows.forEach((row, i) => {
    const y = 226 + i * 64;
    const statusColor = row[5] === "needs_source" ? C.coral : C.teal;
    addSurface(slide, `ev-row-${i}`, 78, y - 8, 1124, 46, i % 2 === 0 ? C.white : C.grayBg, row[5] === "needs_source" ? C.coral : C.line);
    row.forEach((cell, j) => {
      addText(slide, `ev-${i}-${j}`, cell, { left: [96, 204, 354, 474, 584, 810][j], top: y + 1, width: [80, 130, 90, 80, 184, 170][j], height: 24 }, {
        fontSize: 16,
        bold: j === 0 || j === 5,
        color: j === 5 ? statusColor : (j === 2 ? C.indigo : C.secondary),
        typeface: EN_FONT,
      });
    });
  });
  addText(slide, "bottom", "TP53 那列不是錯誤要刪掉，而是要明確標成 model inference。", {
    left: 174,
    top: 546,
    width: 930,
    height: 34,
  }, { fontSize: 24, bold: true, color: C.coral, alignment: "center" });
  notes(slide, "示範表格放在 demos/lesson-04-literature-evidence-workflow/evidence_table.demo.csv。");
}

function slide13(p) {
  const slide = baseSlide(p, 13, "FIELDS THAT MATTER", "PMID、研究類型、樣本數是 evidence table 的最小查證欄位", C.indigo);
  const checks = [
    ["PMID / DOI", "來源真的存在，且可回查"],
    ["study_type", "clinical trial、cohort、molecular profiling 不可混用"],
    ["sample_n", "只能從 source text 取得，不能由 agent 猜"],
    ["disease / gene / drug", "不要把背景關係改寫成治療證據"],
    ["conclusion", "只能寫來源支持的 narrow claim"],
  ];
  checks.forEach(([head, copy], i) => {
    const y = 176 + i * 76;
    addNode(slide, `check-head-${i}`, head, 124, y, 210, 46, [C.indigo, C.teal, C.amber, C.coral, C.secondary][i], C.white, 17, EN_FONT);
    addText(slide, `check-copy-${i}`, copy, { left: 382, top: y + 10, width: 730, height: 26 }, {
      fontSize: 22,
      color: C.secondary,
    });
  });
  notes(slide, "這張直接回應使用者列出的欄位需求。");
}

function slide14(p) {
  const slide = baseSlide(p, 14, "EVIDENCE VS INFERENCE", "模型推測可以保留，但不能偽裝成文獻證據", C.coral);
  const cols = [
    ["文獻證據", ["有 PMID / DOI", "source 支持 exact claim", "study type 與 sample_n 可查"], C.teal, C.tealLight],
    ["模型推測", ["沒有可查來源", "只是生物學上合理", "只能標 needs_source"], C.coral, C.coralLight],
  ];
  cols.forEach(([head, bullets, color, fill], i) => {
    const x = 144 + i * 560;
    addSurface(slide, `col-${i}`, x, 214, 426, 282, fill, color);
    addText(slide, `col-head-${i}`, head, { left: x + 42, top: 254, width: 220, height: 36 }, {
      fontSize: 31,
      bold: true,
      color,
    });
    addBulletList(slide, `col-bullets-${i}`, bullets, { left: x + 84, top: 342, width: 284, height: 108 }, {
      fontSize: 22,
      spaceAfter: 8,
    });
  });
  addText(slide, "rule", "這是 biomedical agent 的安全底線。", {
    left: 340,
    top: 576,
    width: 600,
    height: 34,
  }, { fontSize: 24, bold: true, color: C.ink, alignment: "center" });
  notes(slide, "這張符合使用者要求：如何要求 agent 區分文獻證據和模型推測。");
}

function slide15(p) {
  const slide = baseSlide(p, 15, "PROMPT 3", "要求 agent 自己標出哪些列不是文獻證據", C.coral);
  codeBox(slide, "prompt3", `Review this evidence table row by row.

For each row, answer:
1. Does the PMID or DOI exist?
2. Does the source support the exact claim?
3. Is sample_n copied from the source or inferred?
4. Is this literature_evidence, molecular_context,
   model_inference, conflicting, or not_found?
5. What must a human reviewer check before accepting it?

Output a corrected table plus a short review note.`, 110, 190, 1060, 378, 18);
  notes(slide, "這個 prompt 是 review prompt，不是 extraction prompt。它是把 agent 轉成 reviewer，而不是讓它繼續擴寫。");
}

function slide16(p) {
  const slide = baseSlide(p, 16, "BAD ROW DEMO", "TP53 這種合理推測要被抓出來，不是自動補成證據", C.coral);
  addSurface(slide, "bad", 108, 190, 1064, 150, C.coralLight, C.coral);
  addText(slide, "bad-row", "TP53 | NSCLC | osimertinib or ALK inhibitor | TP53 mutation predicts worse response | PMID: NA | evidence_kind: model_inference", {
    left: 144,
    top: 236,
    width: 990,
    height: 48,
  }, { fontSize: 24, bold: true, color: C.coral, alignment: "center", typeface: EN_FONT });
  const fixes = [
    ["不要做", "把它改寫成 clinical conclusion"],
    ["要做", "標記 needs_source 並產生下一個 search task"],
    ["接受條件", "找到 source 並確認 source 支持 exact claim"],
  ];
  fixes.forEach(([head, copy], i) => {
    const x = 134 + i * 360;
    addSurface(slide, `fix-${i}`, x, 424, 290, 104, i === 0 ? C.coralLight : C.white, i === 1 ? C.teal : (i === 2 ? C.amber : C.coral));
    addText(slide, `fix-head-${i}`, head, { left: x + 24, top: 448, width: 120, height: 28 }, {
      fontSize: 22,
      bold: true,
      color: i === 0 ? C.coral : (i === 1 ? C.teal : C.amber),
    });
    addText(slide, `fix-copy-${i}`, copy, { left: x + 24, top: 486, width: 230, height: 32 }, {
      fontSize: 18,
      color: C.secondary,
    });
  });
  notes(slide, "TP53 row 是教學用的壞例子，目標是示範 evidence_kind 和 needs_source 的價值。");
}

function slide17(p) {
  const slide = baseSlide(p, 17, "CITATION CHECK", "Citation check 是 workflow，不是最後才補的格式", C.amber);
  const steps = [
    ["Open", "PMID / DOI page"],
    ["Match", "title / year / journal"],
    ["Read", "abstract method/results"],
    ["Compare", "claim vs source"],
    ["Mark", "supported / needs review"],
  ];
  steps.forEach(([head, copy], i) => {
    const x = 110 + i * 214;
    if (i > 0) addLine(slide, `check-line-${i}`, x - 54, 356, x - 12, 356, C.line, 1.2);
    addNode(slide, `check-step-${i}`, `${head}\n${copy}`, x, 306, 156, 100, [C.indigo, C.teal, C.teal, C.amber, C.coral][i], i === 4 ? C.coralLight : C.white, 17, EN_FONT);
  });
  addText(slide, "bottom", "檢查失敗不是失敗；沒有標記檢查失敗才是失敗。", {
    left: 220,
    top: 540,
    width: 840,
    height: 34,
  }, { fontSize: 24, bold: true, color: C.amber, alignment: "center" });
  notes(slide, "這張的線全是水平線，避免前面投影片發生的線條方向錯誤。");
}

function slide18(p) {
  const slide = baseSlide(p, 18, "RESEARCH NOTE", "Research note 把表格變成可交接的研究紀錄", C.indigo);
  const parts = [
    ["Problem statement", "問題與範圍"],
    ["Search strategy", "query、日期、排除條件"],
    ["Evidence table", "structured rows"],
    ["Unresolved questions", "not_found / conflicting"],
    ["Human review notes", "哪些 row 被改過"],
    ["Next actions", "下一輪 search 或驗證"],
  ];
  parts.forEach(([head, copy], i) => {
    const x = 94 + (i % 3) * 380;
    const y = 208 + Math.floor(i / 3) * 144;
    addSurface(slide, `note-part-${i}`, x, y, 310, 92, i % 2 === 0 ? C.white : C.grayBg, C.line);
    addText(slide, `note-head-${i}`, head, { left: x + 22, top: y + 20, width: 250, height: 24 }, {
      fontSize: 20,
      bold: true,
      color: [C.indigo, C.teal, C.amber, C.coral, C.indigo, C.teal][i],
      typeface: EN_FONT,
    });
    addText(slide, `note-copy-${i}`, copy, { left: x + 22, top: y + 56, width: 250, height: 22 }, {
      fontSize: 17,
      color: C.secondary,
    });
  });
  notes(slide, "對應課綱 Research note structure。");
}

function slide19(p) {
  const slide = baseSlide(p, 19, "MCP / SKILLS PREVIEW", "今天只先知道會用哪些工具，細節留到明天", C.teal);
  const tools = [
    ["PubMed skill", "查 PMID、DOI、abstract metadata"],
    ["Browser", "開來源頁面做人工確認"],
    ["Spreadsheet / CSV", "保存 evidence table"],
    ["Terminal / script", "檢查欄位與格式"],
    ["Citation manager", "保存候選文獻"],
  ];
  tools.forEach(([tool, use], i) => {
    const y = 178 + i * 72;
    addNode(slide, `tool-${i}`, tool, 136, y, 220, 44, [C.teal, C.indigo, C.amber, C.coral, C.secondary][i], C.white, 17, EN_FONT);
    addText(slide, `tool-use-${i}`, use, { left: 410, top: y + 10, width: 650, height: 24 }, {
      fontSize: 22,
      color: C.secondary,
    });
  });
  addText(slide, "bottom", "工具越多，越要明確權限、輸入、輸出和 review gate。", {
    left: 220,
    top: 580,
    width: 840,
    height: 32,
  }, { fontSize: 23, bold: true, color: C.teal, alignment: "center" });
  notes(slide, "使用者要求如果需要 MCP 或 skills，要先提會用哪些，隔天再詳細介紹。");
}

function slide20(p) {
  const slide = baseSlide(p, 20, "LIVE DEMO SCRIPT", "課堂示範照著四個 checkpoint 推進", C.amber);
  const steps = [
    ["1", "show task_spec", "確認範圍與欄位"],
    ["2", "run Prompt 1", "產生 search strategy"],
    ["3", "open sources", "建立 source inventory"],
    ["4", "run Prompt 2/3", "建表並標推測"],
  ];
  steps.forEach(([num, head, copy], i) => {
    const x = 120 + i * 278;
    addSurface(slide, `demo-step-${i}`, x, 246, 216, 190, i % 2 === 0 ? C.white : C.amberLight, i === 3 ? C.coral : C.amber);
    addText(slide, `demo-num-${i}`, num, { left: x + 22, top: 274, width: 34, height: 30 }, {
      fontSize: 28,
      bold: true,
      color: i === 3 ? C.coral : C.amber,
      typeface: EN_FONT,
    });
    addText(slide, `demo-head-${i}`, head, { left: x + 66, top: 278, width: 130, height: 28 }, {
      fontSize: 20,
      bold: true,
      color: C.ink,
      typeface: EN_FONT,
    });
    addText(slide, `demo-copy-${i}`, copy, { left: x + 28, top: 352, width: 160, height: 46 }, {
      fontSize: 18,
      color: C.secondary,
      alignment: "center",
    });
  });
  addText(slide, "rule", "示範中要故意留下 TP53 needs_source row，讓學生看到 agent 不是全知。", {
    left: 170,
    top: 546,
    width: 940,
    height: 34,
  }, { fontSize: 24, bold: true, color: C.coral, alignment: "center" });
  notes(slide, "這張可當教師上課時的示範腳本。");
}

function slide21(p) {
  const slide = baseSlide(p, 21, "MINI EXERCISE", "學生不需要重做 demo，只要檢查一列 evidence row", C.teal);
  addSurface(slide, "task", 130, 210, 1020, 112, C.tealLight, C.teal);
  addText(slide, "task-text", "請每組挑一列：判斷它是 literature evidence、molecular context，還是 model inference。", {
    left: 170,
    top: 250,
    width: 940,
    height: 34,
  }, { fontSize: 25, bold: true, color: C.teal, alignment: "center" });
  const questions = [
    "PMID / DOI 是否存在？",
    "source 是否支持 exact claim？",
    "sample_n 是否照來源填？",
    "需要 human review 的原因是什麼？",
  ];
  addBulletList(slide, "questions", questions, { left: 280, top: 386, width: 690, height: 132 }, {
    fontSize: 24,
    spaceAfter: 10,
  });
  notes(slide, "這個活動設計為短時間檢查，為 Lesson 05 hands-on 做準備。");
}

function slide22(p) {
  const slide = p.slides.add();
  slide.background.fill = C.dark;
  addText(slide, "title", "Next: build and validate your own table", {
    left: 118,
    top: 130,
    width: 980,
    height: 72,
  }, { fontSize: 42, bold: true, color: C.white, typeface: EN_FONT });
  addText(slide, "subtitle", "明天會把 PubMed / browser / CSV / validation script 接進 hands-on workflow", {
    left: 122,
    top: 230,
    width: 920,
    height: 42,
  }, { fontSize: 25, bold: true, color: "#DDE4E8" });
  const nodes = [
    ["Spec", 230, 410, C.indigo],
    ["Sources", 430, 410, C.teal],
    ["Table", 642, 410, C.amber],
    ["Review", 842, 410, C.coral],
  ];
  nodes.forEach(([label, x, y, color], i) => {
    if (i > 0) addLine(slide, `next-line-${i}`, x - 68, y + 28, x - 12, y + 28, "#52616D", 1.3);
    addNode(slide, `next-${label}`, label, x, y, 132, 56, color, "#26313A", 18, EN_FONT);
  });
  addText(slide, "wrap", "Lesson 04 看完整示範；Lesson 05 開始自己做，並用檢查規則讓表格能被信任。", {
    left: 166,
    top: 550,
    width: 900,
    height: 50,
  }, { fontSize: 23, color: "#DDE4E8", alignment: "center" });
  addFooter(slide, 22, true);
  notes(slide, "收束到下一堂 hands-on lab。線條只用水平線，避免 connector 錯位。");
}

async function main() {
  await fs.mkdir(OUT_DIR, { recursive: true });
  await fs.mkdir(path.dirname(FINAL_PPTX), { recursive: true });

  const presentation = Presentation.create({ slideSize: { width: W, height: H } });
  [
    titleSlide,
    slide2,
    slide3,
    slide4,
    slide5,
    slide6,
    slide7,
    slide8,
    slide9,
    slide10,
    slide11,
    slide12,
    slide13,
    slide14,
    slide15,
    slide16,
    slide17,
    slide18,
    slide19,
    slide20,
    slide21,
    slide22,
  ].forEach((fn) => fn(presentation));

  for (const [index, slide] of presentation.slides.items.entries()) {
    const stem = `slide-${String(index + 1).padStart(2, "0")}`;
    const png = await presentation.export({ slide, format: "png", scale: 1 });
    await writeBlob(path.join(OUT_DIR, `${stem}.png`), png);
    const layout = await slide.export({ format: "layout" });
    await fs.writeFile(path.join(OUT_DIR, `${stem}.layout.json`), await layout.text());
  }

  const inspect = await presentation.inspect({ kind: "slide,textbox,shape,notes", maxChars: 80000 });
  await fs.writeFile(`${FINAL_PPTX}.inspect.ndjson`, inspect.ndjson);
  console.log(`Inspect result written to file: ${FINAL_PPTX}.inspect.ndjson`);

  const pptx = await PresentationFile.exportPptx(presentation);
  await pptx.save(FINAL_PPTX);
  console.log(FINAL_PPTX);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

