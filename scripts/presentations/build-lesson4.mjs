import fs from "node:fs/promises";
import path from "node:path";
import { Presentation, PresentationFile } from "@oai/artifact-tool";

const SCRIPT_DIR = path.dirname(new URL(import.meta.url).pathname);
const REPO_ROOT = process.env.REPO_ROOT ? path.resolve(process.env.REPO_ROOT) : path.resolve(SCRIPT_DIR, "../..");
const OUT_DIR = path.join(REPO_ROOT, "previews", "lesson-04-desktop-agent-literature-evidence-workflow");
const FINAL_PPTX = path.join(REPO_ROOT, "slides", "lesson-04-desktop-agent-literature-evidence-workflow.pptx");

const W = 1280;
const H = 720;
const TOTAL = 40;
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

function sectionForSlide(n) {
  if (n <= 6) return ["FRAME", C.indigo];
  if (n <= 12) return ["SEARCH", C.teal];
  if (n <= 18) return ["EXTRACT", C.amber];
  if (n <= 21) return ["VERIFY", C.coral];
  if (n <= 29) return ["SEARCH+", C.teal];
  if (n <= 39) return ["HARDEN", C.teal];
  return ["NEXT", C.indigo];
}

function addSlideChrome(slide, n, color, dark = false) {
  slide.shapes.add({
    geometry: "rect",
    name: `accent-rail-${n}`,
    position: { left: 0, top: 0, width: 10, height: H },
    fill: color,
    line: { style: "solid", fill: color, width: 0 },
  });
  const [section] = sectionForSlide(n);
  addText(slide, `section-${n}`, section, { left: 1030, top: 58, width: 174, height: 24 }, {
    fontSize: 12,
    bold: true,
    color: dark ? "#AEB8C0" : color,
    alignment: "right",
    typeface: EN_FONT,
  });
  addLine(slide, `progress-track-${n}`, 930, 681, 1204, 681, dark ? "#3A4650" : C.line, 2);
  addLine(slide, `progress-fill-${n}`, 930, 681, 930 + 274 * (n / TOTAL), 681, color, 3);
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
  addSlideChrome(slide, n, color);
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
  addSlideChrome(slide, 1, C.teal);
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
  const slide = baseSlide(p, 5, "DEMO FILES", "Demo 會留下七個可以檢查的檔案", C.amber);
  const files = [
    ["task_spec.md", "研究問題、欄位、規則"],
    ["prompts.md", "設計過的 agent prompts"],
    ["query_log.demo.md", "query ladder、排除條件、停止規則"],
    ["source_inventory.csv", "PMID / DOI / title / n"],
    ["evidence_table.demo.csv", "可審核 evidence rows"],
    ["evidence_review.demo.md", "逐列查證與修正決策"],
    ["research_note.demo.md", "摘要、限制、下一步"],
  ];
  files.forEach(([file, desc], i) => {
    const y = 166 + i * 56;
    addSurface(slide, `file-${i}`, 132, y, 442, 42, i % 2 === 0 ? C.white : C.grayBg, C.line);
    addText(slide, `file-name-${i}`, file, { left: 154, top: y + 10, width: 390, height: 22 }, {
      fontSize: 17,
      bold: true,
      color: [C.indigo, C.teal, C.coral, C.amber, C.secondary, C.coral, C.indigo][i],
      typeface: EN_FONT,
    });
    addText(slide, `file-desc-${i}`, desc, { left: 642, top: y + 10, width: 430, height: 22 }, {
      fontSize: 18,
      color: C.secondary,
    });
  });
  addText(slide, "path", "demos/lesson-04-literature-evidence-workflow/", {
    left: 260,
    top: 584,
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
    if (i > 0) addLine(slide, `flow-line-${i}`, x - 52, 360, x, 360, C.line, 1.4);
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
- Every row starts with needs_human_review=TRUE.`, 108, 182, 1064, 404, 18);
  notes(slide, "這張是 evidence extraction prompt。重點是 evidence_kind 和 model_inference 欄位。");
}

function slide12(p) {
  const slide = baseSlide(p, 12, "DEMO TABLE", "一份好的 evidence table 應該讓錯誤容易被看見", C.amber);
  const xs = [96, 230, 430, 570, 690, 940];
  const widths = [120, 180, 130, 100, 220, 210];
  tableHeader(slide, ["gene", "drug", "PMID", "n", "evidence kind", "status"], xs, 188, widths, C.amber);
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
      addText(slide, `ev-${i}-${j}`, cell, { left: xs[j], top: y + 1, width: widths[j], height: 24 }, {
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
    addSurface(slide, `fix-${i}`, x, 414, 290, 138, i === 0 ? C.coralLight : C.white, i === 1 ? C.teal : (i === 2 ? C.amber : C.coral));
    addText(slide, `fix-head-${i}`, head, { left: x + 24, top: 440, width: 220, height: 28 }, {
      fontSize: 22,
      bold: true,
      color: i === 0 ? C.coral : (i === 1 ? C.teal : C.amber),
    });
    addText(slide, `fix-copy-${i}`, copy, { left: x + 24, top: 486, width: 242, height: 56 }, {
      fontSize: 17,
      color: C.secondary,
      lineSpacing: 1.12,
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
    if (i > 0) addLine(slide, `check-line-${i}`, x - 58, 356, x, 356, C.line, 1.2);
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
  addSlideChrome(slide, 22, C.teal, true);
  addText(slide, "chapter", "DEEP DIVE 01", { left: 92, top: 104, width: 400, height: 30 }, {
    fontSize: 16,
    bold: true,
    color: "#75D7CF",
    typeface: EN_FONT,
  });
  addText(slide, "chapter-number", "01", { left: 84, top: 156, width: 190, height: 150 }, {
    fontSize: 112,
    bold: true,
    color: "#3B4B55",
    typeface: EN_FONT,
  });
  addText(slide, "title", "Make the search reproducible", { left: 278, top: 176, width: 850, height: 64 }, {
    fontSize: 43,
    bold: true,
    color: C.white,
    typeface: EN_FONT,
  });
  addText(slide, "subtitle", "從問題類型、query ladder 到 search log，讓別人知道你找過什麼、為何停下來", {
    left: 284,
    top: 264,
    width: 830,
    height: 62,
  }, { fontSize: 24, bold: true, color: "#DDE4E8" });
  const takeaways = ["question type", "query ladder", "stopping rule"];
  takeaways.forEach((label, i) => {
    addNode(slide, `deep-search-${i}`, label, 286 + i * 274, 420, 222, 60, C.teal, C.tealLight, 18, EN_FONT);
  });
  addFooter(slide, 22, true);
  notes(slide, "這是新增的深度模組分隔頁。先告訴學生：可重現搜尋不是一條完美 query，而是一串可解釋的搜尋決策。");
}

function slide23(p) {
  const slide = baseSlide(p, 23, "QUESTION TYPE", "先判斷問題類型，才知道需要多嚴格的證據", C.teal);
  const types = [
    ["Explore", "有哪些可能關係？", "允許廣搜與候選線索\n輸出 hypothesis backlog", C.indigo, C.indigoLight],
    ["Map", "目前有哪些研究？", "要求來源完整與分類\n輸出 evidence landscape", C.teal, C.tealLight],
    ["Decide", "證據足以支持決策嗎？", "要求預先標準與風險評估\n輸出 review-ready synthesis", C.coral, C.coralLight],
  ];
  types.forEach(([head, question, copy, color, fill], i) => {
    const x = 96 + i * 386;
    addSurface(slide, `qtype-${i}`, x, 202, 330, 300, fill, color);
    addText(slide, `qtype-head-${i}`, head, { left: x + 30, top: 230, width: 150, height: 34 }, {
      fontSize: 28,
      bold: true,
      color,
      typeface: EN_FONT,
    });
    addText(slide, `qtype-question-${i}`, question, { left: x + 30, top: 300, width: 270, height: 54 }, {
      fontSize: 22,
      bold: true,
      color: C.ink,
    });
    addText(slide, `qtype-copy-${i}`, copy, { left: x + 30, top: 404, width: 270, height: 60 }, {
      fontSize: 18,
      color: C.secondary,
      lineSpacing: 1.18,
    });
  });
  addText(slide, "bottom", "本課 Demo 是 Map 型問題；不應被誤用成臨床決策建議。", {
    left: 190,
    top: 560,
    width: 900,
    height: 34,
  }, { fontSize: 24, bold: true, color: C.coral, alignment: "center" });
  notes(slide, "把問題分成 Explore、Map、Decide，目的不是創造新術語，而是讓學生把 evidence threshold 說清楚。");
}

function slide24(p) {
  const slide = baseSlide(p, 24, "QUESTION FRAME", "用 PICO / PECO 當拆題鏡頭，不要把它當固定模板", C.indigo);
  const blocks = [
    ["P", "Population", "advanced NSCLC\n或 lung adenocarcinoma", C.indigo, C.indigoLight],
    ["I / E", "Intervention / Exposure", "osimertinib、crizotinib\n或 gene alteration", C.teal, C.tealLight],
    ["C", "Comparator", "standard EGFR-TKI\n或 chemotherapy", C.amber, C.amberLight],
    ["O", "Outcome", "PFS、response\n或 molecular context", C.coral, C.coralLight],
  ];
  blocks.forEach(([letter, head, copy, color, fill], i) => {
    const x = 84 + i * 300;
    addSurface(slide, `pico-${i}`, x, 212, 252, 250, fill, color);
    addText(slide, `pico-letter-${i}`, letter, { left: x + 24, top: 238, width: 76, height: 52 }, {
      fontSize: 42,
      bold: true,
      color,
      typeface: EN_FONT,
    });
    addText(slide, `pico-head-${i}`, head, { left: x + 24, top: 310, width: 204, height: 42 }, {
      fontSize: 19,
      bold: true,
      color: C.ink,
      typeface: EN_FONT,
    });
    addText(slide, `pico-copy-${i}`, copy, { left: x + 24, top: 382, width: 204, height: 58 }, {
      fontSize: 17,
      color: C.secondary,
      lineSpacing: 1.16,
    });
  });
  addText(slide, "rule", "對 molecular profiling 問題，I / C 可能不存在；不要硬填不存在的 comparator。", {
    left: 154,
    top: 548,
    width: 972,
    height: 40,
  }, { fontSize: 23, bold: true, color: C.indigo, alignment: "center" });
  notes(slide, "示範 PICO 與 PECO 的實用定位：協助拆題，不是要求每個研究問題都有四個完整欄位。");
}

function slide25(p) {
  const slide = baseSlide(p, 25, "QUERY LADDER", "不要追求一條神奇 query；建立可迭代的 query ladder", C.teal);
  const levels = [
    ["Q1  Broad", "NSCLC AND (EGFR OR ALK OR TP53)", "盤點詞彙與研究類型"],
    ["Q2  Treatment", "NSCLC AND EGFR AND osimertinib AND trial", "定位治療效益研究"],
    ["Q3  Molecular", "lung adenocarcinoma AND molecular profiling", "補足 molecular context"],
    ["Q4  Rescue", "TP53 AND NSCLC AND outcome AND targeted therapy", "針對 needs_source 缺口"],
  ];
  levels.forEach(([head, query, use], i) => {
    const y = 172 + i * 98;
    if (i > 0) addLine(slide, `ladder-line-${i}`, 214, y - 42, 214, y, C.line, 2);
    addNode(slide, `ladder-head-${i}`, head, 104, y, 220, 56, [C.indigo, C.teal, C.amber, C.coral][i], C.white, 17, EN_FONT);
    addSurface(slide, `ladder-query-bg-${i}`, 360, y, 520, 56, i % 2 === 0 ? C.white : C.grayBg, C.line);
    addText(slide, `ladder-query-${i}`, query, { left: 384, top: y + 16, width: 474, height: 24 }, {
      fontSize: 17,
      bold: true,
      color: C.ink,
      typeface: MONO,
    });
    addText(slide, `ladder-use-${i}`, use, { left: 924, top: y + 15, width: 256, height: 26 }, {
      fontSize: 18,
      color: C.secondary,
    });
  });
  addText(slide, "bottom", "每次改 query 都要記錄：改了什麼、為什麼、結果是否更接近問題。", {
    left: 160,
    top: 590,
    width: 960,
    height: 34,
  }, { fontSize: 23, bold: true, color: C.teal, alignment: "center" });
  notes(slide, "Query ladder 讓 agent 的搜尋行為可重現。實際搜尋時還要記錄日期、資料庫與 filters。");
}

function slide26(p) {
  const slide = baseSlide(p, 26, "ELIGIBILITY RULES", "納入與排除條件要在看結果之前先寫下來", C.amber);
  const columns = [
    ["Include", ["NSCLC 或 lung adenocarcinoma", "可回查 PMID / DOI", "研究類型與問題相符", "來源能支持至少一個 narrow claim"], C.teal, C.tealLight],
    ["Exclude / park", ["只有二手摘要且無原始來源", "疾病或介入不在範圍", "只有背景敘述、無可抽取結果", "同一研究重複報告，先標記 linkage"], C.coral, C.coralLight],
  ];
  columns.forEach(([head, items, color, fill], i) => {
    const x = 124 + i * 570;
    addSurface(slide, `eligibility-${i}`, x, 206, 466, 304, fill, color);
    addText(slide, `eligibility-head-${i}`, head, { left: x + 34, top: 238, width: 300, height: 34 }, {
      fontSize: 29,
      bold: true,
      color,
      typeface: EN_FONT,
    });
    addBulletList(slide, `eligibility-items-${i}`, items, { left: x + 64, top: 316, width: 352, height: 150 }, {
      fontSize: 20,
      spaceAfter: 9,
    });
  });
  addText(slide, "bottom", "排除不是刪除：保留 reason，才能重跑、審查與解釋搜尋偏差。", {
    left: 170,
    top: 566,
    width: 940,
    height: 34,
  }, { fontSize: 23, bold: true, color: C.amber, alignment: "center" });
  notes(slide, "先寫 eligibility rules，可以降低看到喜歡的結果後才改標準的風險。");
}

function slide27(p) {
  const slide = baseSlide(p, 27, "SEARCH LOG", "Search log 要留下決策，不只是複製 query", C.indigo);
  tableHeader(slide, ["run", "query focus", "change", "decision"], [92, 184, 468, 760], 178, [70, 250, 254, 398], C.indigo);
  const rows = [
    ["01", "broad gene map", "baseline search", "保留常見詞彙與候選 study types"],
    ["02", "EGFR treatment", "add drug + trial", "進入 treatment evidence inventory"],
    ["03", "ALK treatment", "change gene + comparator", "檢查同類問題是否可重用 schema"],
    ["04", "TP53 rescue", "add outcome terms", "仍無 exact source 時回報 not_found"],
  ];
  rows.forEach((row, i) => {
    const y = 216 + i * 76;
    addSurface(slide, `log-row-${i}`, 76, y, 1128, 58, i % 2 === 0 ? C.white : C.grayBg, C.line);
    row.forEach((cell, j) => {
      addText(slide, `log-${i}-${j}`, cell, { left: [92, 184, 468, 760][j], top: y + 15, width: [70, 250, 254, 398][j], height: 28 }, {
        fontSize: j === 0 ? 17 : 18,
        bold: j === 0,
        color: j === 0 ? C.indigo : C.secondary,
        typeface: j === 0 ? EN_FONT : FONT,
        alignment: j === 0 ? "center" : "left",
      });
    });
  });
  addText(slide, "stop", "Stop rule: 新 query 不再增加可驗證來源，或需要付費全文／專家判讀時停下來。", {
    left: 150,
    top: 548,
    width: 980,
    height: 48,
  }, { fontSize: 22, bold: true, color: C.coral, alignment: "center" });
  notes(slide, "Search log 不需要記錄假精確的 hit count；重要的是資料庫、日期、query、filters 與決策。");
}

function slide28(p) {
  const slide = baseSlide(p, 28, "SOURCE DEPTH", "不同來源層級能支持的欄位不同", C.teal);
  const sources = [
    ["Record", "title / PMID / DOI / year", "只能確認書目存在", C.indigo],
    ["Abstract", "design / sample / main result", "適合初步 inventory", C.teal],
    ["Full text", "methods / subgroup / limitation", "用於 exact claim review", C.amber],
    ["Supplement / registry", "protocol / endpoints / extra tables", "解決 denominator 與版本問題", C.coral],
  ];
  sources.forEach(([head, fields, role, color], i) => {
    const y = 178 + i * 94;
    addNode(slide, `source-depth-${i}`, head, 104, y, 214, 58, color, C.white, 19, EN_FONT);
    addText(slide, `source-fields-${i}`, fields, { left: 370, top: y + 8, width: 330, height: 42 }, {
      fontSize: 19,
      bold: true,
      color: C.ink,
      typeface: EN_FONT,
    });
    addText(slide, `source-role-${i}`, role, { left: 760, top: y + 14, width: 390, height: 30 }, {
      fontSize: 19,
      color: C.secondary,
    });
  });
  addText(slide, "bottom", "不要讓 abstract-only workflow 產生 full-text 級別的確定語氣。", {
    left: 220,
    top: 576,
    width: 840,
    height: 34,
  }, { fontSize: 24, bold: true, color: C.teal, alignment: "center" });
  notes(slide, "這張不是 evidence hierarchy，而是 source depth：不同層級能抽取與驗證的欄位不同。");
}

function slide29(p) {
  const slide = baseSlide(p, 29, "SOURCE TRIAGE", "候選來源先看相關性與可驗證性，再決定下一步", C.coral);
  const quadrants = [
    ["HIGH relevance\nHIGH verifiability", "優先抽取\n建立 evidence row", C.teal, C.tealLight],
    ["HIGH relevance\nLOW verifiability", "保留候選\n尋找全文或替代來源", C.amber, C.amberLight],
    ["LOW relevance\nHIGH verifiability", "可作背景\n不得升級成核心 claim", C.indigo, C.indigoLight],
    ["LOW relevance\nLOW verifiability", "排除並記錄 reason", C.coral, C.coralLight],
  ];
  quadrants.forEach(([head, action, color, fill], i) => {
    const x = 126 + (i % 2) * 540;
    const y = 198 + Math.floor(i / 2) * 172;
    addSurface(slide, `triage-${i}`, x, y, 454, 132, fill, color);
    addText(slide, `triage-head-${i}`, head, { left: x + 28, top: y + 22, width: 210, height: 52 }, {
      fontSize: 19,
      bold: true,
      color,
      typeface: EN_FONT,
      lineSpacing: 1.08,
    });
    addText(slide, `triage-action-${i}`, action, { left: x + 266, top: y + 28, width: 154, height: 62 }, {
      fontSize: 18,
      bold: true,
      color: C.ink,
      lineSpacing: 1.12,
    });
  });
  addText(slide, "bottom", "Triage 只決定處理順序，不等於研究品質評分。", {
    left: 250,
    top: 566,
    width: 780,
    height: 34,
  }, { fontSize: 23, bold: true, color: C.coral, alignment: "center" });
  notes(slide, "學生容易把是否相關與研究品質混在一起。這張只處理候選來源的 workflow triage。");
}

function slide30(p) {
  const slide = p.slides.add();
  slide.background.fill = C.dark;
  addSlideChrome(slide, 30, C.amber, true);
  addText(slide, "chapter", "DEEP DIVE 02", { left: 92, top: 104, width: 400, height: 30 }, {
    fontSize: 16,
    bold: true,
    color: "#F0C765",
    typeface: EN_FONT,
  });
  addText(slide, "chapter-number", "02", { left: 84, top: 156, width: 190, height: 150 }, {
    fontSize: 112,
    bold: true,
    color: "#3B4B55",
    typeface: EN_FONT,
  });
  addText(slide, "title", "Make each row defensible", { left: 278, top: 176, width: 850, height: 64 }, {
    fontSize: 43,
    bold: true,
    color: C.white,
    typeface: EN_FONT,
  });
  addText(slide, "subtitle", "把長句拆成 atomic claim，再檢查 study type、sample_n、entity 與衝突證據", {
    left: 284,
    top: 264,
    width: 830,
    height: 62,
  }, { fontSize: 24, bold: true, color: "#DDE4E8" });
  ["atomic claim", "schema checks", "safety gate"].forEach((label, i) => {
    addNode(slide, `deep-row-${i}`, label, 286 + i * 274, 420, 222, 60, C.amber, C.amberLight, 18, EN_FONT);
  });
  addFooter(slide, 30, true);
  notes(slide, "第二個深度模組從搜尋轉向 evidence row 的品質控制。");
}

function slide31(p) {
  const slide = baseSlide(p, 31, "ATOMIC CLAIM", "一列只放一個可以被來源支持或否定的 claim", C.amber);
  addSurface(slide, "claim-bad", 112, 180, 1056, 92, C.coralLight, C.coral);
  addText(slide, "claim-bad-text", "EGFR、ALK 與 TP53 都和 NSCLC 有關，標靶治療有效，而且某些突變預後較差。", {
    left: 150,
    top: 210,
    width: 980,
    height: 34,
  }, { fontSize: 23, bold: true, color: C.coral, alignment: "center" });
  const rows = [
    ["Claim A", "EGFR-mutated advanced NSCLC", "osimertinib improves PFS vs comparator", C.teal],
    ["Claim B", "ALK-positive advanced NSCLC", "crizotinib improves PFS vs chemotherapy", C.indigo],
    ["Claim C", "TP53 + targeted therapy outcome", "needs source; do not merge with A or B", C.amber],
  ];
  rows.forEach(([label, scope, claim, color], i) => {
    const y = 332 + i * 76;
    addNode(slide, `atomic-label-${i}`, label, 112, y, 150, 52, color, C.white, 17, EN_FONT);
    addText(slide, `atomic-scope-${i}`, scope, { left: 306, top: y + 14, width: 330, height: 28 }, {
      fontSize: 18,
      bold: true,
      color: C.ink,
      typeface: EN_FONT,
    });
    addText(slide, `atomic-claim-${i}`, claim, { left: 680, top: y + 14, width: 460, height: 28 }, {
      fontSize: 18,
      color: C.secondary,
      typeface: EN_FONT,
    });
  });
  notes(slide, "先示範一個不可查證的長句，再拆成三個 atomic claims。每列都可有自己的 source、status 與 review note。");
}

function slide32(p) {
  const slide = baseSlide(p, 32, "EVIDENCE TAXONOMY", "五種 evidence_kind 對應五種處理方式", C.teal);
  const kinds = [
    ["literature_evidence", "來源直接支持 exact claim", "可進 synthesis", C.teal, C.tealLight],
    ["molecular_context", "支持生物背景，不支持療效", "限制語氣", C.indigo, C.indigoLight],
    ["conflicting", "來源間方向或條件不一致", "保留並分層", C.amber, C.amberLight],
    ["not_found", "完成合理搜尋仍無來源", "回報缺口", C.secondary, C.grayBg],
    ["model_inference", "模型推測且無可查來源", "隔離、不可升級", C.coral, C.coralLight],
  ];
  kinds.forEach(([kind, meaning, action, color, fill], i) => {
    const x = i < 3 ? 70 + i * 400 : 270 + (i - 3) * 400;
    const y = i < 3 ? 202 : 404;
    addSurface(slide, `kind-${i}`, x, y, 342, 142, fill, color);
    addText(slide, `kind-name-${i}`, kind, { left: x + 22, top: y + 22, width: 292, height: 28 }, {
      fontSize: 18,
      bold: true,
      color,
      typeface: MONO,
      alignment: "center",
    });
    addText(slide, `kind-meaning-${i}`, meaning, { left: x + 24, top: y + 66, width: 294, height: 34 }, {
      fontSize: 17,
      color: C.ink,
      alignment: "center",
    });
    addText(slide, `kind-action-${i}`, action, { left: x + 24, top: y + 108, width: 294, height: 24 }, {
      fontSize: 16,
      bold: true,
      color,
      alignment: "center",
    });
  });
  notes(slide, "Evidence taxonomy 不只是標籤；每個 evidence_kind 都要觸發不同的 downstream action。");
}

function slide33(p) {
  const slide = baseSlide(p, 33, "SAMPLE SIZE", "sample_n 最常見的錯誤，是抄對數字卻抄錯 denominator", C.coral);
  const stages = ["screened", "randomized", "treated", "analyzed"];
  stages.forEach((stage, i) => {
    const x = 104 + i * 286;
    if (i > 0) addLine(slide, `sample-line-${i}`, x - 82, 304, x, 304, C.line, 2);
    addNode(slide, `sample-stage-${i}`, `${stage}\nn = ?`, x, 260, 204, 88, [C.indigo, C.teal, C.amber, C.coral][i], C.white, 18, EN_FONT);
  });
  const rules = [
    ["Outcome claim", "使用實際分析 population 的 denominator"],
    ["Trial description", "可記 randomized n，但要標清楚欄位語意"],
    ["Abstract unclear", "sample_n = UNKNOWN，並在 source_note 記原因"],
  ];
  rules.forEach(([head, copy], i) => {
    const y = 408 + i * 58;
    addText(slide, `sample-rule-head-${i}`, head, { left: 180, top: y, width: 220, height: 26 }, {
      fontSize: 19,
      bold: true,
      color: [C.indigo, C.teal, C.coral][i],
      typeface: EN_FONT,
    });
    addText(slide, `sample-rule-copy-${i}`, copy, { left: 430, top: y, width: 700, height: 26 }, {
      fontSize: 19,
      color: C.secondary,
    });
  });
  notes(slide, "提醒學生 sample_n 不是單一真值；它必須和 claim、analysis population 與欄位定義對齊。");
}

function slide34(p) {
  const slide = baseSlide(p, 34, "STUDY TYPE MISMATCH", "研究設計決定 claim 能走多遠", C.indigo);
  const rows = [
    ["Randomized trial", "比較介入結果", "可描述該研究中的 comparative outcome", C.teal],
    ["Observational cohort", "關聯與自然病程", "不可自動改寫成因果療效", C.indigo],
    ["Molecular profiling", "alteration landscape", "不可直接產生 treatment recommendation", C.amber],
    ["Narrative review", "背景與線索", "回到 primary source 再建立核心 row", C.coral],
  ];
  tableHeader(slide, ["study type", "what it measures", "claim boundary"], [104, 392, 706], 182, [250, 274, 462], C.indigo);
  rows.forEach(([type, measures, boundary, color], i) => {
    const y = 224 + i * 82;
    addSurface(slide, `study-row-${i}`, 82, y, 1120, 62, i % 2 === 0 ? C.white : C.grayBg, C.line);
    addText(slide, `study-type-${i}`, type, { left: 104, top: y + 17, width: 250, height: 28 }, {
      fontSize: 19,
      bold: true,
      color,
      typeface: EN_FONT,
    });
    addText(slide, `study-measures-${i}`, measures, { left: 392, top: y + 17, width: 274, height: 28 }, {
      fontSize: 19,
      color: C.secondary,
    });
    addText(slide, `study-boundary-${i}`, boundary, { left: 706, top: y + 17, width: 456, height: 28 }, {
      fontSize: 18,
      color: C.ink,
    });
  });
  addText(slide, "bottom", "先判 study type，再讓 agent 寫 conclusion。", {
    left: 310,
    top: 574,
    width: 660,
    height: 34,
  }, { fontSize: 24, bold: true, color: C.indigo, alignment: "center" });
  notes(slide, "這張專門處理常見 overclaim：把 molecular context 或 observational association 改寫成治療結論。");
}

function slide35(p) {
  const slide = baseSlide(p, 35, "ENTITY NORMALIZATION", "保留原文，同時建立可比較的 normalized 欄位", C.teal);
  tableHeader(slide, ["raw text", "normalized field", "review note"], [106, 420, 772], 184, [280, 316, 380], C.teal);
  const rows = [
    ["P53", "gene_symbol = TP53", "保留 raw text，避免 silently rewrite"],
    ["lung cancer", "disease_scope = NSCLC?", "來源未指明時標 needs_review"],
    ["EGFR-TKI", "drug_class = EGFR-TKI", "不要猜成特定藥物"],
    ["EGFR exon 19 deletion", "variant_text + normalized term", "版本與轉錄本另欄處理"],
  ];
  rows.forEach((row, i) => {
    const y = 226 + i * 82;
    addSurface(slide, `norm-row-${i}`, 82, y, 1120, 62, i % 2 === 0 ? C.white : C.grayBg, C.line);
    row.forEach((cell, j) => {
      addText(slide, `norm-${i}-${j}`, cell, { left: [106, 420, 772][j], top: y + 17, width: [280, 316, 380][j], height: 28 }, {
        fontSize: 18,
        bold: j === 1,
        color: j === 1 ? C.teal : C.secondary,
        typeface: j < 2 ? EN_FONT : FONT,
      });
    });
  });
  addText(slide, "bottom", "Normalization 是新增欄位，不是抹掉來源中的原始表述。", {
    left: 220,
    top: 574,
    width: 840,
    height: 34,
  }, { fontSize: 23, bold: true, color: C.teal, alignment: "center" });
  notes(slide, "生醫 entity 常有別名與不同粒度。最安全的做法是 raw 與 normalized 並存，並保留 review note。");
}

function slide36(p) {
  const slide = baseSlide(p, 36, "CONFLICTING EVIDENCE", "衝突證據不要平均掉；先找出差異在哪裡", C.amber);
  const steps = [
    ["Keep", "保留兩列"],
    ["Compare", "population / design"],
    ["Stratify", "outcome / subgroup"],
    ["Explain", "可能的差異來源"],
    ["Escalate", "needs expert review"],
  ];
  steps.forEach(([head, copy], i) => {
    const x = 100 + i * 222;
    if (i > 0) addLine(slide, `conflict-line-${i}`, x - 56, 332, x, 332, C.line, 2);
    addNode(slide, `conflict-step-${i}`, `${head}\n${copy}`, x, 280, 166, 104, [C.indigo, C.teal, C.amber, C.coral, C.secondary][i], C.white, 17, EN_FONT);
  });
  addSurface(slide, "conflict-example", 152, 458, 976, 92, C.amberLight, C.amber);
  addText(slide, "conflict-example-text", "conflict_note: outcome definition、line of therapy、follow-up 或 subgroup 不同；目前不能合併成單一結論。", {
    left: 192,
    top: 490,
    width: 896,
    height: 34,
  }, { fontSize: 21, bold: true, color: C.ink, alignment: "center" });
  notes(slide, "學生常讓模型把衝突來源平均成一句模糊結論。正確做法是保留差異並升級 review。");
}

function slide37(p) {
  const slide = baseSlide(p, 37, "NOT FOUND RULE", "找不到不是空白，也不是要求模型補完", C.coral);
  const states = [
    ["not_searched", "尚未執行足夠搜尋", "建立下一個 query task", C.secondary, C.grayBg],
    ["not_found", "依目前 strategy 未找到來源", "回報範圍、日期與限制", C.amber, C.amberLight],
    ["not_accessible", "知道來源存在但無法檢查", "不要宣稱來源支持 claim", C.coral, C.coralLight],
  ];
  states.forEach(([state, meaning, action, color, fill], i) => {
    const x = 92 + i * 398;
    addSurface(slide, `notfound-${i}`, x, 224, 342, 238, fill, color);
    addText(slide, `notfound-state-${i}`, state, { left: x + 26, top: 252, width: 290, height: 30 }, {
      fontSize: 20,
      bold: true,
      color,
      typeface: MONO,
      alignment: "center",
    });
    addText(slide, `notfound-meaning-${i}`, meaning, { left: x + 32, top: 326, width: 278, height: 48 }, {
      fontSize: 20,
      bold: true,
      color: C.ink,
      alignment: "center",
    });
    addText(slide, `notfound-action-${i}`, action, { left: x + 32, top: 410, width: 278, height: 36 }, {
      fontSize: 18,
      color: C.secondary,
      alignment: "center",
    });
  });
  addText(slide, "bottom", "空白欄位會被下游誤讀；明確 status 才能讓 workflow 正確停止。", {
    left: 160,
    top: 562,
    width: 960,
    height: 34,
  }, { fontSize: 23, bold: true, color: C.coral, alignment: "center" });
  notes(slide, "Not found rule 是 agent stop condition 的一部分，也是避免 hallucination 的結構化方法。");
}

function slide38(p) {
  const slide = baseSlide(p, 38, "SAFETY BOUNDARY", "網頁與 PDF 也是不可信輸入；agent 不能照單全收", C.coral);
  const risks = [
    ["Prompt injection", "來源文字要求忽略任務、改規則或外傳資料", "只把來源當 data；系統規則優先", C.coral, C.coralLight],
    ["Sensitive data", "病歷、未公開結果、帳號或 token 被放進 prompt", "使用去識別資料與最小必要權限", C.amber, C.amberLight],
    ["Scope creep", "搜尋工具開始寫檔、寄信或啟動外部工作", "每種 action 都要明確 approval gate", C.indigo, C.indigoLight],
  ];
  risks.forEach(([head, risk, control, color, fill], i) => {
    const x = 92 + i * 398;
    addSurface(slide, `risk-${i}`, x, 208, 342, 300, fill, color);
    addText(slide, `risk-head-${i}`, head, { left: x + 28, top: 238, width: 286, height: 34 }, {
      fontSize: 25,
      bold: true,
      color,
      typeface: EN_FONT,
      alignment: "center",
    });
    addText(slide, `risk-copy-${i}`, risk, { left: x + 32, top: 318, width: 278, height: 68 }, {
      fontSize: 19,
      color: C.ink,
      alignment: "center",
      lineSpacing: 1.12,
    });
    addText(slide, `risk-control-${i}`, control, { left: x + 32, top: 430, width: 278, height: 50 }, {
      fontSize: 18,
      bold: true,
      color,
      alignment: "center",
    });
  });
  addText(slide, "bottom", "Read permission 不等於 execute permission。", {
    left: 330,
    top: 572,
    width: 620,
    height: 34,
  }, { fontSize: 24, bold: true, color: C.coral, alignment: "center", typeface: EN_FONT });
  notes(slide, "補上 desktop agent 處理外部來源時的安全邊界：prompt injection、敏感資料與 scope creep。");
}

function slide39(p) {
  const slide = baseSlide(p, 39, "REPRODUCIBILITY BUNDLE", "交付的不只是答案，而是一個能重跑與審查的 bundle", C.teal);
  const artifacts = [
    ["01", "task_spec.md", "範圍與驗收標準", C.indigo],
    ["02", "query_log.demo.md", "搜尋決策與停止規則", C.teal],
    ["03", "source_inventory.csv", "候選來源與驗證狀態", C.teal],
    ["04", "evidence_table.demo.csv", "atomic claims 與 evidence_kind", C.amber],
    ["05", "evidence_review.demo.md", "逐列查證與修正", C.coral],
    ["06", "research_note.demo.md", "限制、缺口與下一步", C.indigo],
  ];
  artifacts.forEach(([num, file, purpose, color], i) => {
    const y = 172 + i * 66;
    addNode(slide, `bundle-num-${i}`, num, 96, y, 58, 42, color, C.white, 16, EN_FONT);
    addText(slide, `bundle-file-${i}`, file, { left: 186, top: y + 10, width: 340, height: 24 }, {
      fontSize: 18,
      bold: true,
      color: C.ink,
      typeface: MONO,
    });
    addText(slide, `bundle-purpose-${i}`, purpose, { left: 548, top: y + 10, width: 320, height: 24 }, {
      fontSize: 18,
      color: C.secondary,
    });
  });
  addSurface(slide, "exit-gate", 910, 176, 286, 388, C.tealLight, C.teal);
  addText(slide, "exit-title", "Exit gate", { left: 942, top: 208, width: 220, height: 32 }, {
    fontSize: 28,
    bold: true,
    color: C.teal,
    typeface: EN_FONT,
    alignment: "center",
  });
  addBulletList(slide, "exit-items", ["每列可回查來源", "sample_n 有語意", "推測被隔離", "not_found 有範圍", "人工 review 有紀錄"], {
    left: 962,
    top: 296,
    width: 184,
    height: 190,
  }, { fontSize: 19, spaceAfter: 10 });
  notes(slide, "用 bundle 與 exit gate 收束新增內容，讓學生知道完成的定義不是表格看起來漂亮。");
}

function slide40(p) {
  const slide = p.slides.add();
  slide.background.fill = C.dark;
  addSlideChrome(slide, 40, C.teal, true);
  addText(slide, "title", "Next: build and validate your own table", {
    left: 118,
    top: 130,
    width: 980,
    height: 72,
  }, { fontSize: 42, bold: true, color: C.white, typeface: EN_FONT });
  addText(slide, "subtitle", "下一堂會把 PubMed / browser / CSV / validation script 接進 hands-on workflow", {
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
    if (i > 0) {
      const previousX = nodes[i - 1][1];
      addLine(slide, `next-line-${i}`, previousX + 132, y + 28, x, y + 28, "#8FA0AA", 1.5);
    }
    addNode(slide, `next-${label}`, label, x, y, 132, 56, color, C.white, 18, EN_FONT);
  });
  addText(slide, "wrap", "Lesson 04 看完整示範；Lesson 05 開始自己做，並用檢查規則讓表格能被信任。", {
    left: 166,
    top: 550,
    width: 900,
    height: 50,
  }, { fontSize: 23, color: "#DDE4E8", alignment: "center" });
  addFooter(slide, 40, true);
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
    slide23,
    slide24,
    slide25,
    slide26,
    slide27,
    slide28,
    slide29,
    slide30,
    slide31,
    slide32,
    slide33,
    slide34,
    slide35,
    slide36,
    slide37,
    slide38,
    slide39,
    slide40,
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
