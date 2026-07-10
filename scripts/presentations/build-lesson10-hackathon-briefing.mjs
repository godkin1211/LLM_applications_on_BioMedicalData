import fs from "node:fs/promises";
import path from "node:path";
import { Presentation, PresentationFile } from "@oai/artifact-tool";

const SCRIPT_DIR = path.dirname(new URL(import.meta.url).pathname);
const REPO_ROOT = process.env.REPO_ROOT ? path.resolve(process.env.REPO_ROOT) : path.resolve(SCRIPT_DIR, "../..");
const OUT_DIR = path.join(REPO_ROOT, "previews", "lesson-10-biomedical-hackathon-briefing");
const FINAL_PPTX = path.join(REPO_ROOT, "slides", "lesson-10-biomedical-hackathon-briefing.pptx");

const W = 1280;
const H = 720;
const TOTAL = 34;
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
  violet: "#6B4AA0",
  violetLight: "#F1ECFA",
  line: "#D4DADD",
  white: "#FFFFFF",
  dark: "#17202A",
  darkPanel: "#26313A",
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

function addNode(slide, name, label, x, y, w, h, color, fill = C.white, fontSize = 18, typeface = FONT) {
  const node = addSurface(slide, name, x, y, w, h, fill, color);
  node.text = label;
  node.text.style = {
    fontSize,
    bold: true,
    color,
    alignment: "center",
    verticalAlignment: "middle",
    lineSpacing: 1.03,
    typeface,
    insets: { top: 6, right: 8, bottom: 6, left: 8 },
  };
  return node;
}

function addLine(slide, name, x1, y1, x2, y2, color = C.line, width = 1.5, dashed = false) {
  return slide.shapes.add({
    geometry: "line",
    name,
    position: { left: x1, top: y1, width: x2 - x1, height: y2 - y1 },
    fill: "none",
    line: { style: dashed ? "dashed" : "solid", fill: color, width },
  });
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
    fontSize: options.fontSize ?? 21,
    color: options.color ?? C.ink,
    lineSpacing: options.lineSpacing ?? 1.08,
    typeface: options.typeface ?? FONT,
    insets: { top: 0, right: 0, bottom: 0, left: 0 },
  };
  return shape;
}

function addCodeBox(slide, name, code, x, y, w, h, fontSize = 16) {
  addSurface(slide, `${name}-bg`, x, y, w, h, C.codeBg, "#3A4650");
  addText(slide, name, code, { left: x + 18, top: y + 16, width: w - 36, height: h - 32 }, {
    fontSize,
    color: "#F3F7FA",
    typeface: MONO,
    lineSpacing: 1.1,
  });
}

function addEyebrow(slide, text, color = C.indigo) {
  addText(slide, "eyebrow", text, { left: frame.left, top: frame.top, width: 840, height: 30 }, {
    fontSize: 15,
    bold: true,
    color,
    typeface: EN_FONT,
  });
}

function addTitle(slide, text, y = 96, size = 36, width = 1060, color = C.ink) {
  addText(slide, "title", text, { left: frame.left, top: y, width, height: 96 }, {
    fontSize: size,
    bold: true,
    color,
    lineSpacing: 0.98,
  });
}

function sectionForSlide(n) {
  if (n <= 5) return ["FRAME", C.indigo];
  if (n <= 12) return ["TRACKS", C.teal];
  if (n <= 17) return ["PLAN", C.amber];
  if (n <= 27) return ["BUILD", C.coral];
  if (n <= 33) return ["SCORE", C.violet];
  return ["START", C.teal];
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
    color: dark ? "#C3CDD4" : color,
    alignment: "right",
    typeface: EN_FONT,
  });
  addLine(slide, `progress-track-${n}`, 930, 681, 1204, 681, dark ? "#3A4650" : C.line, 2);
  addLine(slide, `progress-fill-${n}`, 930, 681, 930 + 274 * (n / TOTAL), 681, color, 3);
}

function addFooter(slide, n, dark = false) {
  addText(slide, dark ? "footer-dark" : "footer", `Biomedical hackathon briefing  |  ${n}/${TOTAL}`, {
    left: frame.left,
    top: 668,
    width: 500,
    height: 22,
  }, { fontSize: 12, color: dark ? "#C3CDD4" : C.secondary, typeface: EN_FONT });
}

function baseSlide(presentation, n, eyebrow, title, color = C.indigo) {
  const slide = presentation.slides.add();
  slide.background.fill = C.bg;
  addSlideChrome(slide, n, color);
  addEyebrow(slide, eyebrow, color);
  addTitle(slide, title);
  addFooter(slide, n);
  return slide;
}

function notes(slide, text) {
  slide.speakerNotes.textFrame.setText(text);
  slide.speakerNotes.setVisible(true);
}

function titleSlide(presentation) {
  const slide = presentation.slides.add();
  slide.background.fill = C.dark;
  addSlideChrome(slide, 1, C.teal, true);
  addText(slide, "eyebrow", "DAY 3  |  BIOMEDICAL HACKATHON", { left: 82, top: 66, width: 600, height: 26 }, {
    fontSize: 16, bold: true, color: "#74D8D0", typeface: EN_FONT,
  });
  addText(slide, "title", "Biomedical Hackathon Briefing", { left: 82, top: 132, width: 880, height: 72 }, {
    fontSize: 48, bold: true, color: C.white, typeface: EN_FONT,
  });
  addText(slide, "subtitle", "把一個生醫問題縮成可執行、可驗證、可解釋的 agent workflow", {
    left: 86, top: 238, width: 870, height: 50,
  }, { fontSize: 27, bold: true, color: "#DDE4E8" });
  const nodes = [
    ["Frame", 156, C.indigo],
    ["Build", 356, C.teal],
    ["Check", 556, C.amber],
    ["Demo", 756, C.coral],
    ["Reflect", 956, C.violet],
  ];
  nodes.forEach(([label, x, color], i) => {
    if (i > 0) addLine(slide, `title-flow-${i}`, nodes[i - 1][1] + 132, 452, x, 452, "#6A7984", 1.8);
    addNode(slide, `title-node-${i}`, label, x, 420, 132, 64, color, C.white, 18, EN_FONT);
  });
  addText(slide, "callout", "Success = a small workflow another person can inspect and run again.", {
    left: 170, top: 560, width: 930, height: 34,
  }, { fontSize: 22, color: "#C7D2D8", alignment: "center", typeface: EN_FONT });
  addFooter(slide, 1, true);
  notes(slide, "開場先定義這不是比誰的 AI 回答最華麗，而是比誰能把一個小型 biomedical workflow 做得可驗證、可重跑、可說明限制。今天上午建立 scaffold，下午實作與驗證，最後展示。 ");
}

function slide2(presentation) {
  const slide = baseSlide(presentation, 2, "WHAT YOU WILL LEAVE WITH", "今天結束時，每一組都要帶走四件事", C.teal);
  const items = [
    ["01", "一個小而完整的問題", "scope、input、output 都寫清楚", C.indigo, C.indigoLight],
    ["02", "一條可展示的 workflow", "agent + tool + human review gate", C.teal, C.tealLight],
    ["03", "一組可檢查的 artifacts", "spec、logs、output、tests", C.amber, C.amberLight],
    ["04", "一段誠實的 demo", "知道什麼可相信、什麼要停止", C.coral, C.coralLight],
  ];
  items.forEach(([num, head, copy, color, fill], i) => {
    const x = 88 + i * 292;
    addSurface(slide, `outcome-card-${i}`, x, 220, 250, 258, fill, color);
    addText(slide, `outcome-num-${i}`, num, { left: x + 28, top: 248, width: 68, height: 44 }, {
      fontSize: 34, bold: true, color, typeface: EN_FONT,
    });
    addText(slide, `outcome-head-${i}`, head, { left: x + 28, top: 324, width: 194, height: 52 }, {
      fontSize: 23, bold: true, color: C.ink, lineSpacing: 1.08,
    });
    addText(slide, `outcome-copy-${i}`, copy, { left: x + 28, top: 408, width: 194, height: 44 }, {
      fontSize: 18, color: C.secondary, lineSpacing: 1.1,
    });
  });
  addText(slide, "rule", "不是完成最多功能；是完成最可信的最小版本。", {
    left: 180, top: 562, width: 920, height: 34,
  }, { fontSize: 25, bold: true, color: C.teal, alignment: "center" });
  notes(slide, "這張是 briefing 的終點定義。學生最後不必做成產品，不必訓練新模型，也不必使用所有工具；但每組都必須留下可查看的 workflow artifact。 ");
}

function slide3(presentation) {
  const slide = baseSlide(presentation, 3, "DAY 3 MAP", "第三天不是一段長時間 coding，而是四個明確階段", C.indigo);
  const stages = [
    ["08:30–10:00", "Loop engineering", "設計檢查、修正與停止", C.indigo, C.indigoLight],
    ["10:20–11:50", "Hackathon briefing", "選題、縮 scope、建 scaffold", C.teal, C.tealLight],
    ["13:00–14:30", "Build + evidence check", "做 MVP、跑 test、補 evidence trail", C.amber, C.amberLight],
    ["14:50–16:20", "Demo + QA", "5 分鐘展示、3 分鐘問答", C.coral, C.coralLight],
  ];
  stages.forEach(([time, head, copy, color, fill], i) => {
    const x = 82 + i * 294;
    if (i > 0) addLine(slide, `day3-line-${i}`, x - 42, 350, x, 350, C.line, 1.7);
    addSurface(slide, `day3-card-${i}`, x, 248, 252, 214, fill, color);
    addText(slide, `day3-time-${i}`, time, { left: x + 24, top: 274, width: 204, height: 28 }, {
      fontSize: 18, bold: true, color, typeface: EN_FONT, alignment: "center",
    });
    addText(slide, `day3-head-${i}`, head, { left: x + 24, top: 334, width: 204, height: 44 }, {
      fontSize: 22, bold: true, color: C.ink, alignment: "center", typeface: EN_FONT,
    });
    addText(slide, `day3-copy-${i}`, copy, { left: x + 26, top: 404, width: 200, height: 36 }, {
      fontSize: 17, color: C.secondary, alignment: "center", lineSpacing: 1.1,
    });
  });
  addText(slide, "bottom", "上午的成果不是 code，而是下午能完成的 plan。", {
    left: 250, top: 548, width: 780, height: 34,
  }, { fontSize: 24, bold: true, color: C.indigo, alignment: "center" });
  notes(slide, "提醒學生 Day 3 的時間節點。上午 hackathon briefing 結束時必須有題目、scope、task spec 和 demo plan。下午才開始 build。 ");
}

function slide4(presentation) {
  const slide = baseSlide(presentation, 4, "SUCCESS DEFINITION", "一個成功作品要能回答五個問題", C.teal);
  const checks = [
    ["Problem", "要解決什麼？", C.indigo],
    ["Input", "資料從哪裡來？", C.teal],
    ["Workflow", "agent + tools 做什麼？", C.amber],
    ["Check", "如何驗證、何時停止？", C.coral],
    ["Limit", "哪些結果不能信？", C.violet],
  ];
  checks.forEach(([head, copy, color], i) => {
    const x = 76 + i * 228;
    if (i > 0) addLine(slide, `success-line-${i}`, x - 48, 356, x, 356, C.line, 1.8);
    addNode(slide, `success-node-${i}`, head, x, 306, 180, 100, color, C.white, 20, EN_FONT);
    addText(slide, `success-copy-${i}`, copy, { left: x - 4, top: 440, width: 188, height: 52 }, {
      fontSize: 18, color: C.secondary, alignment: "center", lineSpacing: 1.1,
    });
  });
  addText(slide, "bottom", "少任何一項，demo 就會變成只展示答案，而非展示 workflow。", {
    left: 170, top: 570, width: 940, height: 34,
  }, { fontSize: 23, bold: true, color: C.coral, alignment: "center" });
  notes(slide, "這是之後評分與問答的共同框架。五個問題可以當成學生在 demo 前自我檢查的最低門檻。 ");
}

function slide5(presentation) {
  const slide = baseSlide(presentation, 5, "HACKATHON PRINCIPLES", "四條規則，決定作品會不會被信任", C.coral);
  const rules = [
    ["Small", "把題目縮到一個下午能完成", "避免做全自動研究平台", C.teal, C.tealLight],
    ["Traceable", "每個 claim 或欄位可回查", "保留 source、log、version", C.indigo, C.indigoLight],
    ["Testable", "有正常與失敗案例", "schema、not_found、conflict", C.amber, C.amberLight],
    ["Honest", "明確標記限制與人工關卡", "不把推測包裝成證據", C.coral, C.coralLight],
  ];
  rules.forEach(([head, lead, example, color, fill], i) => {
    const x = 84 + (i % 2) * 580;
    const y = 204 + Math.floor(i / 2) * 166;
    addSurface(slide, `principle-${i}`, x, y, 510, 126, fill, color);
    addText(slide, `principle-head-${i}`, head, { left: x + 28, top: y + 22, width: 140, height: 30 }, {
      fontSize: 26, bold: true, color, typeface: EN_FONT,
    });
    addText(slide, `principle-lead-${i}`, lead, { left: x + 200, top: y + 22, width: 280, height: 30 }, {
      fontSize: 20, bold: true, color: C.ink,
    });
    addText(slide, `principle-example-${i}`, example, { left: x + 200, top: y + 70, width: 280, height: 24 }, {
      fontSize: 17, color: C.secondary,
    });
  });
  notes(slide, "四條原則會一直出現在後面的規範與評分中。請特別強調 Honest：找不到證據或工具失敗都不是扣分本身，沒有誠實標記才是問題。 ");
}

function slide6(presentation) {
  const slide = baseSlide(presentation, 6, "CHALLENGE TRACKS", "五個題目方向，先選資料與驗證方式，再選 agent", C.teal);
  const tracks = [
    ["01", "Evidence Atlas", "gene–drug–disease evidence table", C.indigo, C.indigoLight],
    ["02", "Trial Extractor", "clinical trial eligibility criteria", C.teal, C.tealLight],
    ["03", "Dataset Scout", "metadata + data dictionary assistant", C.amber, C.amberLight],
    ["04", "Variant Triage", "variant evidence collection", C.coral, C.coralLight],
    ["05", "Workflow QA", "bioinformatics pipeline helper", C.violet, C.violetLight],
  ];
  tracks.forEach(([num, head, copy, color, fill], i) => {
    const x = 76 + i * 230;
    addSurface(slide, `track-${i}`, x, 214, 204, 270, fill, color);
    addText(slide, `track-num-${i}`, num, { left: x + 22, top: 240, width: 54, height: 34 }, {
      fontSize: 25, bold: true, color, typeface: EN_FONT,
    });
    addText(slide, `track-head-${i}`, head, { left: x + 22, top: 310, width: 160, height: 54 }, {
      fontSize: 22, bold: true, color: C.ink, typeface: EN_FONT, lineSpacing: 1.04,
    });
    addText(slide, `track-copy-${i}`, copy, { left: x + 22, top: 400, width: 160, height: 56 }, {
      fontSize: 16, color: C.secondary, lineSpacing: 1.12,
    });
  });
  addText(slide, "bottom", "所有 track 都必須產生 structured output、evidence trail 與 human review boundary。", {
    left: 126, top: 548, width: 1028, height: 34,
  }, { fontSize: 22, bold: true, color: C.teal, alignment: "center" });
  notes(slide, "讓學生先看全貌。題目不是封閉的，只要符合公開資料、可驗證、範圍可在下午完成的原則，也可以提出自己的變體。 ");
}

function trackSlide(presentation, n, eyebrow, title, source, transformation, artifact, guardrail, color, fill, note) {
  const slide = baseSlide(presentation, n, eyebrow, title, color);
  const blocks = [
    ["INPUT / SOURCE", source, color, fill],
    ["AGENT JOB", transformation, C.indigo, C.white],
    ["MVP OUTPUT", artifact, C.amber, C.amberLight],
  ];
  blocks.forEach(([head, copy, blockColor, blockFill], i) => {
    const x = 104 + i * 384;
    if (i > 0) addLine(slide, `track-flow-${n}-${i}`, x - 52, 360, x, 360, C.line, 1.8);
    addSurface(slide, `track-block-${n}-${i}`, x, 226, 332, 258, blockFill, blockColor);
    addText(slide, `track-block-head-${n}-${i}`, head, { left: x + 26, top: 256, width: 270, height: 28 }, {
      fontSize: 16, bold: true, color: blockColor, typeface: EN_FONT,
    });
    addText(slide, `track-block-copy-${n}-${i}`, copy, { left: x + 26, top: 318, width: 274, height: 134 }, {
      fontSize: 20, bold: true, color: C.ink, lineSpacing: 1.13,
    });
  });
  addSurface(slide, `track-guard-${n}`, 154, 544, 972, 54, C.coralLight, C.coral);
  addText(slide, `track-guard-copy-${n}`, `安全界線：${guardrail}`, { left: 184, top: 560, width: 912, height: 26 }, {
    fontSize: 19, bold: true, color: C.coral, alignment: "center", typeface: FONT,
  });
  notes(slide, note);
}

function slide7(presentation) {
  trackSlide(
    presentation, 7, "TRACK 01  |  EVIDENCE ATLAS", "Gene–Drug–Disease Evidence Atlas",
    "PubMed + Open Targets；一個小型 gene / drug / disease 問題",
    "找候選來源，萃取有限 claim，分開標記文獻證據與模型推論",
    "evidence_table.csv + source_inventory.csv + review note",
    "不得把文獻整理直接轉成治療建議。",
    C.indigo, C.indigoLight,
    "最推薦的預設題目。學生可以重用 Lesson 04 和 Lesson 05 的 evidence table workflow。MVP 只需要 3 到 6 個可回查 rows，不必追求完整文獻回顧。"
  );
}

function slide8(presentation) {
  trackSlide(
    presentation, 8, "TRACK 02  |  TRIAL EXTRACTOR", "Clinical Trial Eligibility Extractor",
    "ClinicalTrials.gov study records；一個 disease 或 biomarker cohort",
    "把 inclusion / exclusion criteria 轉成結構化欄位，同時保留 raw text",
    "eligibility_table.csv + raw_source_note.md + validation checklist",
    "限於 study discovery 與整理，不做病人個別 trial matching。",
    C.teal, C.tealLight,
    "學生應選 3 到 5 筆 study records，而不是試圖抓取整個資料庫。每一列需要保留 NCT ID、原文 criteria、結構化欄位與不確定狀態。"
  );
}

function slide9(presentation) {
  trackSlide(
    presentation, 9, "TRACK 03  |  DATASET SCOUT", "Public Dataset Metadata Assistant",
    "GEO / GDC / cBioPortal 的公開 metadata 與 data dictionary",
    "依研究問題比較資料集，整理範圍、欄位、存取條件與限制",
    "dataset_cards.csv + fit_for_question.md + data_dictionary.md",
    "沒有 metadata 或 data dictionary 支持，不得宣稱資料集包含某欄位。",
    C.amber, C.amberLight,
    "這個題目適合不想碰臨床 evidence 的同學。關鍵是把 dataset 的 sample type、disease、assay、metadata fields、access limits 正確整理，而不是做資料分析。"
  );
}

function slide10(presentation) {
  trackSlide(
    presentation, 10, "TRACK 04  |  VARIANT TRIAGE", "Variant Evidence Triage Assistant",
    "小型 variant list；ClinVar / gnomAD / Ensembl records",
    "標準化 identifier，蒐集資料庫 evidence fields，區分事實與解讀",
    "variant_review.csv + source_links.md + unresolved_cases.md",
    "不可做臨床解讀、致病性判定，或對個別病人的建議。",
    C.coral, C.coralLight,
    "Variant track 的難點是不要過度解讀。MVP 可用 3 至 5 個變異；保留 raw variant text、normalized field、database record、status 和 review note。"
  );
}

function slide11(presentation) {
  trackSlide(
    presentation, 11, "TRACK 05  |  WORKFLOW QA", "Bioinformatics Workflow QA Copilot",
    "小型 Nextflow / nf-core scaffold、manifest 或 synthetic run log",
    "讀取檔案，找出 contract violation，提出最小 patch 並跑 validation",
    "issue_report.md + validation output + small diff or corrected config",
    "不得啟動 cloud run、使用敏感資料或重寫整條 pipeline。",
    C.violet, C.violetLight,
    "這題延續 Coding Agents 與 Seqera AI 課程。最重要的是 repo-grounded work：先讀檔、說明假設、提出小 patch、跑 validation、回報 diff。"
  );
}

function slide12(presentation) {
  const slide = baseSlide(presentation, 12, "CHOOSING A TRACK", "用三個問題選題，不要先選看起來最酷的工具", C.teal);
  const questions = [
    ["1", "資料能取得嗎？", "今天可使用公開或去識別資料嗎？", C.indigo],
    ["2", "輸出可驗證嗎？", "能否定義 schema、source 與 test？", C.teal],
    ["3", "下午做得完嗎？", "最小版本能在 90 分鐘 build + check 嗎？", C.amber],
  ];
  questions.forEach(([num, head, copy, color], i) => {
    const x = 106 + i * 374;
    addSurface(slide, `choose-${i}`, x, 226, 314, 220, C.white, color);
    addText(slide, `choose-num-${i}`, num, { left: x + 28, top: 252, width: 44, height: 42 }, {
      fontSize: 34, bold: true, color, typeface: EN_FONT,
    });
    addText(slide, `choose-head-${i}`, head, { left: x + 30, top: 324, width: 240, height: 34 }, {
      fontSize: 24, bold: true, color: C.ink,
    });
    addText(slide, `choose-copy-${i}`, copy, { left: x + 30, top: 386, width: 244, height: 44 }, {
      fontSize: 18, color: C.secondary, lineSpacing: 1.12,
    });
  });
  addText(slide, "bottom", "三題中任何一題回答「否」，就縮小 scope 或換題。", {
    left: 200, top: 550, width: 880, height: 34,
  }, { fontSize: 24, bold: true, color: C.coral, alignment: "center" });
  notes(slide, "這張是學生選題時的停損規則。資料不可得、輸出無法驗證或下午完成不了，都不是硬撐的理由。請要求每組在這張規則下確認題目。"
  );
}

function slide13(presentation) {
  const slide = baseSlide(presentation, 13, "TEAM OPERATING MODEL", "四個角色可以由 2–4 人兼任，但責任不能消失", C.indigo);
  const roles = [
    ["Problem owner", "定義問題、範圍、完成條件", C.indigo, C.indigoLight],
    ["Agent / tool operator", "執行 prompt、工具、檔案與 log", C.teal, C.tealLight],
    ["Validation owner", "檢查 source、schema、failure case", C.amber, C.amberLight],
    ["Demo narrator", "整理故事、限制、5 分鐘展示", C.coral, C.coralLight],
  ];
  roles.forEach(([head, copy, color, fill], i) => {
    const x = 88 + (i % 2) * 582;
    const y = 206 + Math.floor(i / 2) * 162;
    addSurface(slide, `role-card-${i}`, x, y, 514, 120, fill, color);
    addText(slide, `role-head-${i}`, head, { left: x + 28, top: y + 28, width: 190, height: 30 }, {
      fontSize: 23, bold: true, color, typeface: EN_FONT,
    });
    addText(slide, `role-copy-${i}`, copy, { left: x + 244, top: y + 30, width: 232, height: 46 }, {
      fontSize: 18, color: C.ink, lineSpacing: 1.1,
    });
  });
  addText(slide, "bottom", "每個人都能 prompt；但每個 artifact 都要有明確 owner。", {
    left: 170, top: 566, width: 940, height: 34,
  }, { fontSize: 23, bold: true, color: C.indigo, alignment: "center" });
  notes(slide, "不強制四人一組，但要明確責任。兩人組可由一人同時負責 problem 與 demo，另一人負責 agent operation 與 validation；重點是不讓 validation 成為沒有人做的最後一步。"
  );
}

function slide14(presentation) {
  const slide = baseSlide(presentation, 14, "MVP SCOPE CONTRACT", "最小可行專題必須有一條完整、可檢查的路徑", C.amber);
  const steps = [
    ["One input", "一個小型資料集、問題或 manifest", C.indigo],
    ["One transform", "一個 agent-assisted step", C.teal],
    ["One check", "一個外部來源或 validation", C.amber],
    ["One output", "一個可讀、可驗證的 artifact", C.coral],
  ];
  steps.forEach(([head, copy, color], i) => {
    const x = 98 + i * 286;
    if (i > 0) addLine(slide, `scope-line-${i}`, x - 54, 344, x, 344, C.line, 2);
    addNode(slide, `scope-node-${i}`, head, x, 292, 232, 104, color, C.white, 21, EN_FONT);
    addText(slide, `scope-copy-${i}`, copy, { left: x + 6, top: 438, width: 220, height: 52 }, {
      fontSize: 18, color: C.secondary, alignment: "center", lineSpacing: 1.1,
    });
  });
  addSurface(slide, "scope-callout", 188, 556, 904, 48, C.amberLight, C.amber);
  addText(slide, "scope-callout-copy", "任何額外功能，都必須在這條主路徑成功後才開始。", { left: 216, top: 569, width: 848, height: 24 }, {
    fontSize: 20, bold: true, color: C.amber, alignment: "center",
  });
  notes(slide, "這是最重要的 scope 控制工具。要求學生先寫出 input、transform、check、output 這四個節點；若說不清楚，專題還不能開始。"
  );
}

function slide15(presentation) {
  const slide = baseSlide(presentation, 15, "SCOPE EXAMPLES", "好題目不是大題目，而是能在下午證明的題目", C.coral);
  const cols = [
    ["Too broad", ["建立所有癌別的藥物推薦 agent", "自動判讀病人所有 variant", "把整個 GEO 資料庫變成聊天機器人"], C.coral, C.coralLight],
    ["Good MVP", ["整理 EGFR / ALK 的 4 筆 evidence rows", "對 5 個 public variants 做資料庫 evidence triage", "比較 3 個 GEO datasets 是否符合一個問題"], C.teal, C.tealLight],
  ];
  cols.forEach(([head, items, color, fill], i) => {
    const x = 114 + i * 570;
    addSurface(slide, `scope-example-${i}`, x, 202, 468, 310, fill, color);
    addText(slide, `scope-example-head-${i}`, head, { left: x + 34, top: 238, width: 200, height: 36 }, {
      fontSize: 30, bold: true, color, typeface: EN_FONT,
    });
    addBulletList(slide, `scope-example-list-${i}`, items, { left: x + 66, top: 324, width: 354, height: 140 }, {
      fontSize: 20, spaceAfter: 12,
    });
  });
  addText(slide, "bottom", "你的 demo 必須能跑完；你的野心可以寫在 next actions。", {
    left: 200, top: 566, width: 880, height: 34,
  }, { fontSize: 24, bold: true, color: C.coral, alignment: "center" });
  notes(slide, "這裡用具體對比阻止 scope creep。若學生有宏大方向，請他們把它放在 future work，而不是當天 MVP。"
  );
}

function slide16(presentation) {
  const slide = baseSlide(presentation, 16, "REQUIRED TASK SPEC", "在呼叫 agent 前，先寫一份兩分鐘能讀懂的 task spec", C.indigo);
  const fields = [
    ["Problem", "問題與不做什麼"],
    ["Input", "檔案、欄位、允許來源"],
    ["Output", "schema、格式、sample row"],
    ["Rules", "引用、找不到、人工審查"],
    ["Check", "驗收標準與 eval cases"],
    ["Stop", "何時停止、何時升級處理"],
  ];
  fields.forEach(([head, copy], i) => {
    const x = 90 + (i % 3) * 390;
    const y = 202 + Math.floor(i / 3) * 164;
    const color = [C.indigo, C.teal, C.amber, C.coral, C.violet, C.green][i];
    const fill = [C.indigoLight, C.tealLight, C.amberLight, C.coralLight, C.violetLight, C.greenLight][i];
    addSurface(slide, `spec-field-${i}`, x, y, 324, 112, fill, color);
    addText(slide, `spec-field-head-${i}`, head, { left: x + 24, top: y + 24, width: 110, height: 28 }, {
      fontSize: 22, bold: true, color, typeface: EN_FONT,
    });
    addText(slide, `spec-field-copy-${i}`, copy, { left: x + 150, top: y + 27, width: 148, height: 54 }, {
      fontSize: 18, color: C.ink, lineSpacing: 1.1,
    });
  });
  addText(slide, "bottom", "Spec 的功能不是限制創意，而是讓錯誤可以被看見。", {
    left: 250, top: 564, width: 780, height: 34,
  }, { fontSize: 23, bold: true, color: C.indigo, alignment: "center" });
  notes(slide, "提醒學生 task spec 不需要很長，但必須涵蓋 Problem、Input、Output、Rules、Check、Stop。這也是下午請助教檢查 scope 時的共同語言。"
  );
}

function slide17(presentation) {
  const slide = baseSlide(presentation, 17, "TASK SPEC EXAMPLE", "把模糊需求改成可接受或拒絕的規格", C.teal);
  addSurface(slide, "weak-spec", 92, 212, 470, 272, C.coralLight, C.coral);
  addText(slide, "weak-spec-head", "Too vague", { left: 124, top: 242, width: 180, height: 32 }, {
    fontSize: 28, bold: true, color: C.coral, typeface: EN_FONT,
  });
  addText(slide, "weak-spec-copy", "「分析這些基因和肺癌的關係，整理成表格。」\n\n沒有來源、欄位、not_found rule、review boundary。", {
    left: 124, top: 320, width: 386, height: 112,
  }, { fontSize: 21, color: C.ink, lineSpacing: 1.18 });
  addSurface(slide, "strong-spec", 618, 174, 564, 348, C.tealLight, C.teal);
  addText(slide, "strong-spec-head", "Reviewable MVP", { left: 654, top: 208, width: 240, height: 32 }, {
    fontSize: 28, bold: true, color: C.teal, typeface: EN_FONT,
  });
  addText(slide, "strong-spec-copy", "Input: EGFR, ALK, TP53 + NSCLC\nSources: PubMed records opened by the team\nOutput: CSV with PMID, study_type, sample_n, claim, status\nRules: one narrow claim per row; missing evidence = not_found\nCheck: verify 3 rows; all accepted rows need human review", {
    left: 654, top: 282, width: 480, height: 178,
  }, { fontSize: 18, color: C.ink, typeface: MONO, lineSpacing: 1.16 });
  notes(slide, "左邊是常見的自然語言需求，右邊是可在下午完成的 task spec。請老師示範如何從模糊題目問回 Input、Output、Source、Rule、Check。"
  );
}

function slide18(presentation) {
  const slide = baseSlide(presentation, 18, "DATA AND SOURCE POLICY", "資料越敏感，agent 的權限與你的責任就越高", C.coral);
  const panels = [
    ["Use", "公開、合法存取或去識別資料", "記錄來源與使用日期", C.teal, C.tealLight],
    ["Do not use", "真實病歷、可識別資料、未授權資料", "不要把敏感內容貼進 prompt", C.coral, C.coralLight],
    ["Document", "來源 URL / ID、license、retrieval date", "不確定權限時先問助教", C.amber, C.amberLight],
  ];
  panels.forEach(([head, copy, action, color, fill], i) => {
    const x = 94 + i * 394;
    addSurface(slide, `data-policy-${i}`, x, 218, 338, 258, fill, color);
    addText(slide, `data-policy-head-${i}`, head, { left: x + 30, top: 248, width: 272, height: 34 }, {
      fontSize: 28, bold: true, color, typeface: EN_FONT, alignment: "center",
    });
    addText(slide, `data-policy-copy-${i}`, copy, { left: x + 34, top: 330, width: 270, height: 56 }, {
      fontSize: 20, bold: true, color: C.ink, alignment: "center", lineSpacing: 1.12,
    });
    addText(slide, `data-policy-action-${i}`, action, { left: x + 34, top: 414, width: 270, height: 40 }, {
      fontSize: 17, color: C.secondary, alignment: "center", lineSpacing: 1.1,
    });
  });
  addText(slide, "bottom", "本課的 output 是研究與工程示範，不是個人化 clinical decision support。", {
    left: 130, top: 564, width: 1020, height: 34,
  }, { fontSize: 22, bold: true, color: C.coral, alignment: "center" });
  notes(slide, "資料規範要在 hackathon 開始前講清楚。這堂課只使用公開資料、教學用資料或已去識別的資料，不接受實際病人資料或未公開研究資料。"
  );
}

function slide19(presentation) {
  const slide = baseSlide(presentation, 19, "AGENT ACTION POLICY", "Read 與 summarize 可以自動；write 與 execute 必須有人負責", C.indigo);
  const rows = [
    ["Read", "讀取公開 record、檔案、schema", "可由 agent 協助；來源視為不可信 data", C.teal],
    ["Transform", "摘要、正規化、產生 structured output", "可由 agent 協助；輸出要標 review status", C.indigo],
    ["Write", "修改 repo、建立檔案、覆寫內容", "先看 diff；不要覆蓋他人或未備份輸出", C.amber],
    ["Execute", "跑 script、外部 API、cloud / terminal action", "明確說明命令與影響，再取得同意", C.coral],
  ];
  rows.forEach(([action, scope, rule, color], i) => {
    const y = 184 + i * 88;
    addNode(slide, `action-policy-${i}`, action, 110, y, 170, 54, color, C.white, 20, EN_FONT);
    addText(slide, `action-scope-${i}`, scope, { left: 340, top: y + 14, width: 320, height: 28 }, {
      fontSize: 19, bold: true, color: C.ink,
    });
    addText(slide, `action-rule-${i}`, rule, { left: 724, top: y + 14, width: 420, height: 34 }, {
      fontSize: 18, color: C.secondary, lineSpacing: 1.1,
    });
  });
  addText(slide, "bottom", "外部網頁與 PDF 也可能包含 prompt injection；只把它們當資料，不當指令。", {
    left: 140, top: 564, width: 1000, height: 34,
  }, { fontSize: 21, bold: true, color: C.coral, alignment: "center" });
  notes(slide, "這張要將 agent 的操作權限說清楚。學生可以使用工具，但必須理解工具輸入、輸出與 side effect；尤其不要把網頁文字當成比 system 或 project rule 更高的指令。"
  );
}

function slide20(presentation) {
  const slide = baseSlide(presentation, 20, "REQUIRED PROJECT FOLDER", "讓老師與助教可以在兩分鐘內看懂你的專題", C.teal);
  addCodeBox(slide, "folder-tree", `project/\n  project_spec.md\n  tool_inventory.md\n  task_spec.md\n  loop_design.md\n  harness_checklist.md\n  data/               # public inputs\n  logs/\n    run_log.md\n    agent_notes.md\n  outputs/\n    result.csv\n    validation_report.md\n  demo_notes.md`, 104, 188, 546, 374, 17);
  const cards = [
    ["Spec", "問題、範圍與 input / output", C.indigo, C.indigoLight],
    ["Trace", "工具、來源、log、版本", C.teal, C.tealLight],
    ["Check", "eval cases + schema + review", C.amber, C.amberLight],
    ["Demo", "5 分鐘故事 + 限制", C.coral, C.coralLight],
  ];
  cards.forEach(([head, copy, color, fill], i) => {
    const x = 720 + (i % 2) * 236;
    const y = 196 + Math.floor(i / 2) * 168;
    addSurface(slide, `folder-card-${i}`, x, y, 204, 132, fill, color);
    addText(slide, `folder-card-head-${i}`, head, { left: x + 22, top: y + 22, width: 160, height: 28 }, {
      fontSize: 23, bold: true, color, typeface: EN_FONT,
    });
    addText(slide, `folder-card-copy-${i}`, copy, { left: x + 22, top: y + 62, width: 160, height: 48 }, {
      fontSize: 16, color: C.ink, lineSpacing: 1.1,
    });
  });
  notes(slide, "要求每組使用相同的 folder contract。這不是形式主義；它讓助教能快速定位 spec、logs、outputs，並可讓學生在 demo 時不需要到處找檔案。"
  );
}

function slide21(presentation) {
  const slide = baseSlide(presentation, 21, "OUTPUT SCHEMA", "任何題目都至少要回答：這筆輸出從哪裡來、現在可信嗎？", C.amber);
  const headers = ["input_id", "source_id / URL", "claim or field", "status", "review_note"];
  const xs = [90, 276, 516, 758, 962];
  const ws = [156, 210, 212, 164, 220];
  headers.forEach((head, i) => {
    addText(slide, `schema-head-${i}`, head, { left: xs[i], top: 198, width: ws[i], height: 28 }, {
      fontSize: 16, bold: true, color: C.amber, typeface: MONO, alignment: i === 0 ? "center" : "left",
    });
  });
  const rows = [
    ["EGFR", "PMID: 29151359", "osimertinib PFS claim", "supported", "human review pending"],
    ["NCT01234567", "ClinicalTrials.gov", "EGFR mutation criterion", "needs_review", "raw text retained"],
    ["GSEXXXXX", "GEO series record", "bulk RNA-seq metadata", "supported", "assay field checked"],
    ["TP53", "search log run 04", "targeted outcome claim", "not_found", "no exact source found"],
  ];
  rows.forEach((row, i) => {
    const y = 238 + i * 70;
    addSurface(slide, `schema-row-${i}`, 78, y, 1124, 50, i % 2 === 0 ? C.white : C.grayBg, C.line);
    row.forEach((cell, j) => {
      addText(slide, `schema-cell-${i}-${j}`, cell, { left: xs[j], top: y + 14, width: ws[j], height: 24 }, {
        fontSize: 16, bold: j === 0 || j === 3, color: j === 3 ? [C.teal, C.amber, C.teal, C.coral][i] : C.secondary, typeface: j < 2 ? EN_FONT : FONT,
        alignment: j === 0 ? "center" : "left",
      });
    });
  });
  addText(slide, "bottom", "欄位可以因 track 調整；trace、status、review note 不能缺。", {
    left: 180, top: 564, width: 920, height: 34,
  }, { fontSize: 22, bold: true, color: C.amber, alignment: "center" });
  notes(slide, "輸出 schema 不必和這張完全相同，但所有題目都必須保留 input identifier、source、output claim/field、status 和 human review note。這是 workflow traceability 的底線。"
  );
}

function slide22(presentation) {
  const slide = baseSlide(presentation, 22, "EVIDENCE AND NOT-FOUND RULE", "找不到是有效輸出；編造來源才是失敗", C.coral);
  const states = [
    ["supported", "已開啟來源，來源支持 exact claim", "可進入 demo summary", C.teal, C.tealLight],
    ["needs_review", "來源存在，但 claim / denominator 尚未確認", "保留 row + 指定 reviewer", C.amber, C.amberLight],
    ["not_found", "已執行合理搜尋，仍沒有 exact source", "保留 query、日期、scope", C.coral, C.coralLight],
  ];
  states.forEach(([status, meaning, action, color, fill], i) => {
    const x = 96 + i * 394;
    addSurface(slide, `status-card-${i}`, x, 222, 338, 262, fill, color);
    addText(slide, `status-name-${i}`, status, { left: x + 28, top: 254, width: 282, height: 32 }, {
      fontSize: 24, bold: true, color, typeface: MONO, alignment: "center",
    });
    addText(slide, `status-meaning-${i}`, meaning, { left: x + 32, top: 334, width: 274, height: 54 }, {
      fontSize: 19, bold: true, color: C.ink, alignment: "center", lineSpacing: 1.1,
    });
    addText(slide, `status-action-${i}`, action, { left: x + 32, top: 420, width: 274, height: 36 }, {
      fontSize: 17, color: C.secondary, alignment: "center", lineSpacing: 1.1,
    });
  });
  addText(slide, "bottom", "任何 biological plausibility 都不能自動升級成 literature evidence。", {
    left: 160, top: 564, width: 960, height: 34,
  }, { fontSize: 22, bold: true, color: C.coral, alignment: "center" });
  notes(slide, "這張回收 Lesson 04 的 evidence/inference distinction。學生必須把 not_found 視為有用的結果，並能在 demo 中說明搜尋策略與範圍。"
  );
}

function slide23(presentation) {
  const slide = baseSlide(presentation, 23, "HARNESS AND EVAL", "每組至少要準備三個 case，證明 workflow 不只會在順利時運作", C.violet);
  const cases = [
    ["Normal", "輸入符合預期，產出 schema-valid 結果", "check: required fields + source trace", C.teal, C.tealLight],
    ["Not found", "來源或必要欄位找不到", "check: status=not_found + reason preserved", C.amber, C.amberLight],
    ["Conflicting", "兩個來源或輸入不一致", "check: do not merge; escalate review", C.coral, C.coralLight],
  ];
  cases.forEach(([head, scenario, check, color, fill], i) => {
    const x = 94 + i * 394;
    addSurface(slide, `eval-case-${i}`, x, 210, 338, 286, fill, color);
    addText(slide, `eval-head-${i}`, head, { left: x + 28, top: 242, width: 282, height: 34 }, {
      fontSize: 28, bold: true, color, typeface: EN_FONT, alignment: "center",
    });
    addText(slide, `eval-scenario-${i}`, scenario, { left: x + 34, top: 330, width: 270, height: 58 }, {
      fontSize: 19, bold: true, color: C.ink, alignment: "center", lineSpacing: 1.12,
    });
    addText(slide, `eval-check-${i}`, check, { left: x + 34, top: 424, width: 270, height: 42 }, {
      fontSize: 16, color: C.secondary, alignment: "center", lineSpacing: 1.1, typeface: EN_FONT,
    });
  });
  addText(slide, "bottom", "至少一個 case 必須告訴 agent 或人類：現在不該繼續。", {
    left: 190, top: 564, width: 900, height: 34,
  }, { fontSize: 23, bold: true, color: C.violet, alignment: "center" });
  notes(slide, "把 harness 具體化成三個 cases。學生不必寫測試框架，但必須準備可實際執行或人工檢查的正常、not found、conflicting case。"
  );
}

function slide24(presentation) {
  const slide = baseSlide(presentation, 24, "LOOP AND STOP", "好的 agent workflow 要知道何時 revise，也要知道何時 stop", C.teal);
  const steps = [
    ["Plan", "success criteria", C.indigo],
    ["Act", "agent / tool", C.teal],
    ["Observe", "file / source / log", C.amber],
    ["Evaluate", "schema / evidence", C.coral],
    ["Revise", "query / prompt / patch", C.violet],
    ["Stop", "accept / escalate", C.green],
  ];
  steps.forEach(([head, copy, color], i) => {
    const x = 80 + i * 190;
    if (i > 0) addLine(slide, `loop-line-${i}`, x - 52, 350, x, 350, C.line, 1.8);
    addNode(slide, `loop-node-${i}`, head, x, 298, 138, 104, color, C.white, 18, EN_FONT);
    addText(slide, `loop-copy-${i}`, copy, { left: x - 8, top: 438, width: 154, height: 42 }, {
      fontSize: 16, color: C.secondary, alignment: "center", lineSpacing: 1.1,
    });
  });
  addSurface(slide, "stop-box", 202, 548, 876, 54, C.tealLight, C.teal);
  addText(slide, "stop-copy", "Stop when acceptance criteria pass, evidence is insufficient, a tool fails repeatedly, or human review is required.", {
    left: 230, top: 563, width: 820, height: 25,
  }, { fontSize: 17, bold: true, color: C.teal, alignment: "center", typeface: EN_FONT });
  notes(slide, "這張要連回前一堂 loop engineering。每組的 demo 都必須有至少一個 stop condition，不能讓 agent 無限 retry 或把未知結果變成假確定答案。"
  );
}

function slide25(presentation) {
  const slide = baseSlide(presentation, 25, "MORNING CHECKPOINTS", "上午 90 分鐘的目標：把下午風險先排掉", C.amber);
  const checkpoints = [
    ["10:35", "Scope check", "題目、資料、output 是否可在下午完成？", "提交：track + one-sentence MVP", C.indigo, C.indigoLight],
    ["11:05", "Spec check", "input、output、rules、驗收標準是否具體？", "提交：project_spec.md + task_spec.md", C.teal, C.tealLight],
    ["11:35", "Scaffold check", "folder、tool inventory、demo plan 是否就緒？", "提交：folder tree + demo plan", C.amber, C.amberLight],
  ];
  checkpoints.forEach(([time, head, question, deliverable, color, fill], i) => {
    const x = 98 + i * 392;
    addSurface(slide, `checkpoint-${i}`, x, 206, 336, 304, fill, color);
    addText(slide, `checkpoint-time-${i}`, time, { left: x + 28, top: 236, width: 100, height: 30 }, {
      fontSize: 21, bold: true, color, typeface: EN_FONT,
    });
    addText(slide, `checkpoint-head-${i}`, head, { left: x + 28, top: 292, width: 252, height: 34 }, {
      fontSize: 26, bold: true, color: C.ink, typeface: EN_FONT,
    });
    addText(slide, `checkpoint-question-${i}`, question, { left: x + 28, top: 356, width: 272, height: 58 }, {
      fontSize: 18, color: C.ink, lineSpacing: 1.12,
    });
    addText(slide, `checkpoint-deliverable-${i}`, deliverable, { left: x + 28, top: 446, width: 272, height: 38 }, {
      fontSize: 16, bold: true, color, lineSpacing: 1.1,
    });
  });
  notes(slide, "這張可讓老師和助教照時間巡組。若學生在 11:35 還沒有 scaffold 和 demo plan，下午很可能做不完，應要求縮小 scope。"
  );
}

function slide26(presentation) {
  const slide = baseSlide(presentation, 26, "AFTERNOON RUN OF SHOW", "下午的節奏：先做主路徑，再做檢查，最後才美化 demo", C.coral);
  const phases = [
    ["13:00", "Reconfirm MVP", "重讀 spec；只做一條主路徑", C.indigo],
    ["13:20", "Build", "agent + tool + structured output", C.teal],
    ["13:50", "Validate", "run eval cases; inspect sources", C.amber],
    ["14:15–14:50", "Rehearse + handoff", "定稿、整理交付物、確認 demo", C.coral],
  ];
  phases.forEach(([time, head, copy, color], i) => {
    const x = 90 + i * 298;
    if (i > 0) addLine(slide, `afternoon-line-${i}`, x - 58, 356, x, 356, C.line, 2);
    addNode(slide, `afternoon-node-${i}`, time, x, 300, 240, 74, color, C.white, 23, EN_FONT);
    addText(slide, `afternoon-head-${i}`, head, { left: x + 4, top: 410, width: 232, height: 30 }, {
      fontSize: 21, bold: true, color: C.ink, alignment: "center", typeface: EN_FONT,
    });
    addText(slide, `afternoon-copy-${i}`, copy, { left: x + 10, top: 458, width: 220, height: 44 }, {
      fontSize: 17, color: C.secondary, alignment: "center", lineSpacing: 1.1,
    });
  });
  addSurface(slide, "afternoon-rule", 178, 562, 924, 44, C.coralLight, C.coral);
  addText(slide, "afternoon-rule-copy", "14:15–14:50：定稿、整理桌面與交付物；14:50 準時 demo。", { left: 204, top: 574, width: 872, height: 22 }, {
    fontSize: 18, bold: true, color: C.coral, alignment: "center",
  });
  notes(slide, "下午最常見的錯誤是一直加功能，卻沒有足夠時間驗證。設定 14:15 freeze，讓學生有時間整理 demo、補上 evidence trail 和 limitations。"
  );
}

function slide27(presentation) {
  const slide = baseSlide(presentation, 27, "HOW TO ASK FOR HELP", "請助教協助時，先提供能讓人判斷的最小資訊", C.indigo);
  const ticket = [
    ["1. Goal", "我們正在完成哪一個 acceptance criterion？"],
    ["2. Evidence", "目前的 input、command、source 或 screenshot 是什麼？"],
    ["3. Expected", "原本應該發生什麼？"],
    ["4. Observed", "實際輸出、error 或不一致在哪裡？"],
    ["5. Boundary", "我們已經嘗試什麼？哪些 action 不應執行？"],
  ];
  ticket.forEach(([head, copy], i) => {
    const y = 174 + i * 72;
    addNode(slide, `help-head-${i}`, head, 110, y, 170, 44, [C.indigo, C.teal, C.amber, C.coral, C.violet][i], C.white, 17, EN_FONT);
    addText(slide, `help-copy-${i}`, copy, { left: 340, top: y + 9, width: 760, height: 26 }, {
      fontSize: 19, color: C.secondary,
    });
  });
  addSurface(slide, "help-callout", 180, 570, 920, 34, C.indigoLight, C.indigo);
  addText(slide, "help-callout-copy", "「agent 壞掉了」不是可處理的 bug report。", { left: 208, top: 578, width: 864, height: 20 }, {
    fontSize: 18, bold: true, color: C.indigo, alignment: "center",
  });
  notes(slide, "示範好問題的格式。這能讓助教在短時間內判斷是 scope、source、prompt、schema、tool 或 runtime 的問題，也能訓練學生用工程語言描述失敗。"
  );
}

function slide28(presentation) {
  const slide = baseSlide(presentation, 28, "SCORING OVERVIEW", "總分 100 分，獎勵可驗證的 workflow，而不是功能堆疊", C.violet);
  const items = [
    ["Problem framing", 20, C.indigo],
    ["Evidence + traceability", 25, C.teal],
    ["Harness design", 20, C.amber],
    ["Loop + safety", 20, C.coral],
    ["Demo clarity", 15, C.violet],
  ];
  const totalWidth = 1020;
  let x = 130;
  items.forEach(([label, points, color], i) => {
    const w = totalWidth * (points / 100);
    slide.shapes.add({
      geometry: "rect",
      name: `score-bar-${i}`,
      position: { left: x, top: 266, width: w, height: 126 },
      fill: color,
      line: { style: "solid", fill: color, width: 0 },
    });
    addText(slide, `score-points-${i}`, `${points}`, { left: x, top: 286, width: w, height: 44 }, {
      fontSize: 34, bold: true, color: i === 2 ? C.ink : C.white, alignment: "center", typeface: EN_FONT,
    });
    addText(slide, `score-label-${i}`, label, { left: x + 8, top: 342, width: w - 16, height: 26 }, {
      fontSize: w < 180 ? 14 : 16, bold: true, color: i === 2 ? C.ink : C.white, alignment: "center", typeface: EN_FONT,
    });
    x += w;
  });
  const descriptions = [
    "題目、scope、input/output 清楚",
    "來源可回查、not_found 不編造",
    "schema、eval cases、logs、failure policy",
    "checkpoints、stop conditions、human gate",
    "五分鐘內讓人理解限制與價值",
  ];
  items.forEach(([label, points, color], i) => {
    const y = 464 + i * 28;
    addText(slide, `score-detail-label-${i}`, `${points}  ${label}`, { left: 170, top: y, width: 250, height: 22 }, {
      fontSize: 16, bold: true, color, typeface: EN_FONT,
    });
    addText(slide, `score-detail-${i}`, descriptions[i], { left: 450, top: y, width: 630, height: 22 }, {
      fontSize: 16, color: C.secondary,
    });
  });
  notes(slide, "先給學生總覽：Evidence + traceability 最高分，但其他項目也重要。這告訴學生不要只做漂亮 demo，要留下可檢查的 engineering evidence。"
  );
}

function slide29(presentation) {
  const slide = baseSlide(presentation, 29, "RUBRIC 01", "Problem framing 20 分 + Evidence and traceability 25 分", C.teal);
  const rows = [
    ["Problem framing", "20", "題目具體、scope 合理、input/output 明確、MVP 可在下午完成", C.indigo],
    ["Evidence and traceability", "25", "來源可回查、claim 不誇大、log 與 not_found rule 完整", C.teal],
  ];
  rows.forEach(([head, points, desc, color], i) => {
    const y = 220 + i * 164;
    addSurface(slide, `rubric1-${i}`, 122, y, 1036, 126, i === 0 ? C.indigoLight : C.tealLight, color);
    addText(slide, `rubric1-points-${i}`, points, { left: 158, top: y + 34, width: 86, height: 44 }, {
      fontSize: 36, bold: true, color, alignment: "center", typeface: EN_FONT,
    });
    addText(slide, `rubric1-head-${i}`, head, { left: 300, top: y + 28, width: 310, height: 34 }, {
      fontSize: 27, bold: true, color: C.ink, typeface: EN_FONT,
    });
    addText(slide, `rubric1-desc-${i}`, desc, { left: 650, top: y + 32, width: 460, height: 50 }, {
      fontSize: 19, color: C.secondary, lineSpacing: 1.1,
    });
  });
  addText(slide, "bottom", "高分不是資料最多，而是每一個重要欄位都知道從哪裡來。", {
    left: 190, top: 564, width: 900, height: 34,
  }, { fontSize: 23, bold: true, color: C.teal, alignment: "center" });
  notes(slide, "解釋前兩項分數。Problem framing 的高分關鍵是具體、可做；Evidence 的高分關鍵是 traceability、not_found honesty 和 human review。"
  );
}

function slide30(presentation) {
  const slide = baseSlide(presentation, 30, "RUBRIC 02", "Harness 20 分 + Loop & safety 20 分 + Demo 15 分", C.coral);
  const rows = [
    ["Harness design", "20", "有 schema、正常/失敗案例、validation output、log", C.amber, C.amberLight],
    ["Loop and safety", "20", "有 check/revise/stop，清楚標 human review boundary", C.coral, C.coralLight],
    ["Demo clarity", "15", "五分鐘內說清楚問題、流程、證據、限制與下一步", C.violet, C.violetLight],
  ];
  rows.forEach(([head, points, desc, color, fill], i) => {
    const y = 174 + i * 122;
    addSurface(slide, `rubric2-${i}`, 110, y, 1060, 92, fill, color);
    addText(slide, `rubric2-points-${i}`, points, { left: 138, top: y + 22, width: 80, height: 34 }, {
      fontSize: 30, bold: true, color, alignment: "center", typeface: EN_FONT,
    });
    addText(slide, `rubric2-head-${i}`, head, { left: 270, top: y + 24, width: 250, height: 30 }, {
      fontSize: 23, bold: true, color: C.ink, typeface: EN_FONT,
    });
    addText(slide, `rubric2-desc-${i}`, desc, { left: 568, top: y + 25, width: 548, height: 32 }, {
      fontSize: 18, color: C.secondary, lineSpacing: 1.1,
    });
  });
  addText(slide, "bottom", "一個正常 output 不夠；你必須示範 workflow 對不確定性做了什麼。", {
    left: 160, top: 570, width: 960, height: 34,
  }, { fontSize: 22, bold: true, color: C.coral, alignment: "center" });
  notes(slide, "這張要讓學生知道 Harness、Loop、安全不是額外加分，而是總分四成。Demo clarity 不是講得漂亮而已，而是能在短時間讓人看懂 workflow 和 limitation。"
  );
}

function slide31(presentation) {
  const slide = baseSlide(presentation, 31, "WHAT EARNS OR LOSES POINTS", "評分看你的判斷品質，不看你讓 agent 產生多少字", C.violet);
  const cols = [
    ["Earns points", ["明確拒絕超出來源的 claim", "保留 not_found 與 failing case", "小 patch + validation + diff", "demo 直接展示 limitation"], C.teal, C.tealLight],
    ["Loses points", ["用模型猜 PMID / sample_n", "只有漂亮答案，沒有 sources / logs", "scope 太大，無法跑出完整路徑", "把 clinical inference 當一般摘要"], C.coral, C.coralLight],
  ];
  cols.forEach(([head, items, color, fill], i) => {
    const x = 116 + i * 566;
    addSurface(slide, `points-col-${i}`, x, 200, 448, 320, fill, color);
    addText(slide, `points-head-${i}`, head, { left: x + 38, top: 238, width: 360, height: 34 }, {
      fontSize: 29, bold: true, color, typeface: EN_FONT,
    });
    addBulletList(slide, `points-list-${i}`, items, { left: x + 68, top: 322, width: 316, height: 154 }, {
      fontSize: 20, spaceAfter: 10,
    });
  });
  addText(slide, "bottom", "被發現一個誠實的 failure，比藏起十個 failure 更值得信任。", {
    left: 140, top: 566, width: 1000, height: 34,
  }, { fontSize: 23, bold: true, color: C.violet, alignment: "center" });
  notes(slide, "這張避免學生誤以為只有成功結果才可展示。請明講：誠實的 failure log 和限制說明可以得分；編造來源或誇大 output 才會失分。"
  );
}

function slide32(presentation) {
  const slide = baseSlide(presentation, 32, "DEMO FORMAT", "5 分鐘 demo + 3 分鐘 QA：展示 workflow，不只是給結論", C.indigo);
  const steps = [
    ["0:00", "Problem", "題目與 scope"],
    ["0:45", "Spec", "input / output / rules"],
    ["1:30", "Run", "agent + tool main path"],
    ["2:45", "Check", "source / test / validation"],
    ["3:45", "Limit", "not_found / safety boundary"],
    ["4:30", "Next", "what you would improve"],
  ];
  steps.forEach(([time, head, copy], i) => {
    const x = 72 + i * 198;
    if (i > 0) addLine(slide, `demo-line-${i}`, x - 38, 364, x, 364, C.line, 1.6);
    addSurface(slide, `demo-step-${i}`, x, 278, 160, 172, i % 2 === 0 ? C.indigoLight : C.white, C.indigo);
    addText(slide, `demo-time-${i}`, time, { left: x + 18, top: 298, width: 124, height: 22 }, {
      fontSize: 16, bold: true, color: C.indigo, alignment: "center", typeface: EN_FONT,
    });
    addText(slide, `demo-head-${i}`, head, { left: x + 18, top: 336, width: 124, height: 28 }, {
      fontSize: 20, bold: true, color: C.ink, alignment: "center", typeface: EN_FONT,
    });
    addText(slide, `demo-copy-${i}`, copy, { left: x + 16, top: 382, width: 128, height: 48 }, {
      fontSize: 15, color: C.secondary, alignment: "center", lineSpacing: 1.1,
    });
  });
  addSurface(slide, "qa-box", 160, 530, 960, 64, C.indigoLight, C.indigo);
  addText(slide, "qa-copy", "3 分鐘 Q&A：會問來源、失敗案例、停止條件與人工審查界線。", {
    left: 196, top: 542, width: 888, height: 40,
  }, { fontSize: 16, bold: true, color: C.indigo, alignment: "center", typeface: EN_FONT, lineSpacing: 1.1 });
  notes(slide, "這是展示格式。學生必須先展示 runnable or inspectable workflow，再展示 output；不能花四分鐘講背景，最後三十秒才提 validation。"
  );
}

function slide33(presentation) {
  const slide = baseSlide(presentation, 33, "FINAL HANDOFF", "上台前 10 分鐘，請用這張清單逐項確認", C.teal);
  const items = [
    ["Spec", "題目、輸入、輸出、規則可在 30 秒內說清楚", C.indigo],
    ["Run", "主路徑從 input 到 output 可重跑或可檢視", C.teal],
    ["Trace", "來源、log、status、review note 都在 folder 裡", C.amber],
    ["Test", "至少 normal / not_found / conflicting 三種 case", C.coral],
    ["Limit", "準備一句不該相信或不該自動化的結果", C.violet],
    ["Demo", "檔案、終端、網頁、投影片開在正確位置", C.green],
  ];
  items.forEach(([head, copy, color], i) => {
    const x = 90 + (i % 2) * 580;
    const y = 178 + Math.floor(i / 2) * 116;
    addNode(slide, `handoff-head-${i}`, head, x, y, 148, 52, color, C.white, 18, EN_FONT);
    addText(slide, `handoff-copy-${i}`, copy, { left: x + 190, top: y + 12, width: 354, height: 30 }, {
      fontSize: 18, color: C.secondary, lineSpacing: 1.1,
    });
  });
  addText(slide, "bottom", "一組完整的 demo folder 比一張精美但不可回查的截圖更有價值。", {
    left: 140, top: 566, width: 1000, height: 34,
  }, { fontSize: 22, bold: true, color: C.teal, alignment: "center" });
  notes(slide, "讓學生在登台前做最後清點。助教可以用這張當作 pass/fail checklist，確保每組至少有 demo folder、source trail、test case 和 limitation。"
  );
}

function slide34(presentation) {
  const slide = presentation.slides.add();
  slide.background.fill = C.dark;
  addSlideChrome(slide, 34, C.teal, true);
  addText(slide, "eyebrow", "BIOMEDICAL HACKATHON", { left: 84, top: 76, width: 640, height: 28 }, {
    fontSize: 16, bold: true, color: "#74D8D0", typeface: EN_FONT,
  });
  addText(slide, "title", "Start small.\nPreserve evidence.\nStop honestly.", { left: 86, top: 152, width: 820, height: 192 }, {
    fontSize: 49, bold: true, color: C.white, lineSpacing: 1.02, typeface: EN_FONT,
  });
  const cards = [
    ["Frame", "one verifiable task", C.indigo],
    ["Build", "one complete path", C.teal],
    ["Check", "one honest boundary", C.amber],
  ];
  cards.forEach(([head, copy, color], i) => {
    const x = 88 + i * 344;
    addSurface(slide, `close-card-${i}`, x, 454, 282, 82, C.white, color);
    addText(slide, `close-head-${i}`, head, { left: x + 20, top: 472, width: 242, height: 24 }, {
      fontSize: 21, bold: true, color, typeface: EN_FONT, alignment: "center",
    });
    addText(slide, `close-copy-${i}`, copy, { left: x + 20, top: 506, width: 242, height: 18 }, {
      fontSize: 15, color: C.secondary, alignment: "center", typeface: EN_FONT,
    });
  });
  addText(slide, "closing", "Your next action: choose a track, write the smallest task spec, and ask for a scope check.", {
    left: 170, top: 590, width: 930, height: 32,
  }, { fontSize: 20, bold: true, color: "#C7D2D8", alignment: "center", typeface: EN_FONT });
  addFooter(slide, 34, true);
  notes(slide, "最後收束。請學生在下一個 10 分鐘內選 track、寫下最小 task spec，並向助教申請 scope check。"
  );
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
  ].forEach((fn) => fn(presentation));

  for (const [index, slide] of presentation.slides.items.entries()) {
    const stem = `slide-${String(index + 1).padStart(2, "0")}`;
    const png = await presentation.export({ slide, format: "png", scale: 1 });
    await writeBlob(path.join(OUT_DIR, `${stem}.png`), png);
    const layout = await slide.export({ format: "layout" });
    await fs.writeFile(path.join(OUT_DIR, `${stem}.layout.json`), await layout.text());
  }

  const inspect = await presentation.inspect({ kind: "slide,textbox,shape,notes", maxChars: 120000 });
  await fs.writeFile(`${FINAL_PPTX}.inspect.ndjson`, inspect.ndjson);

  const pptx = await PresentationFile.exportPptx(presentation);
  await pptx.save(FINAL_PPTX);
  console.log(FINAL_PPTX);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
