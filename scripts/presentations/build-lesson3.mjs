import fs from "node:fs/promises";
import path from "node:path";
import { Presentation, PresentationFile } from "@oai/artifact-tool";

const SCRIPT_DIR = path.dirname(new URL(import.meta.url).pathname);
const REPO_ROOT = path.resolve(SCRIPT_DIR, "../..");
const OUT_DIR = path.join(REPO_ROOT, "previews", "lesson-03-llm-basics-for-agent-users");
const FINAL_PPTX = path.join(REPO_ROOT, "slides", "lesson-03-llm-basics-for-agent-users.pptx");

const W = 1280;
const H = 720;
const frame = { left: 76, top: 58, width: 1128, height: 594 };
const TOTAL = 15;

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
  line: "#D4DADD",
  white: "#FFFFFF",
  dark: "#17202A",
};

const FONT = "PingFang TC";
const EN_FONT = "Aptos";

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
    fontSize: style.fontSize ?? 24,
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

function addEyebrow(slide, text, color = C.indigo) {
  return addText(slide, "eyebrow", text, { left: frame.left, top: frame.top, width: 620, height: 30 }, {
    fontSize: 15,
    bold: true,
    color,
    typeface: EN_FONT,
  });
}

function addTitle(slide, text, y = 96, size = 36, width = 1040) {
  return addText(slide, "title", text, { left: frame.left, top: y, width, height: 96 }, {
    fontSize: size,
    bold: true,
    color: C.ink,
    lineSpacing: 0.96,
  });
}

function addFooter(slide, n) {
  addText(slide, "footer", `LLM basics for agent users  |  ${n}/${TOTAL}`, {
    left: frame.left,
    top: 668,
    width: 420,
    height: 22,
  }, { fontSize: 12, color: C.secondary, typeface: EN_FONT });
}

function addDarkFooter(slide, n) {
  addText(slide, "footer-dark", `LLM basics for agent users  |  ${n}/${TOTAL}`, {
    left: frame.left,
    top: 668,
    width: 420,
    height: 22,
  }, { fontSize: 12, color: "#B7C0C7", typeface: EN_FONT });
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
    bulletCharacter: "•",
    marginLeft: options.marginLeft ?? 24,
    indent: options.indent ?? -12,
    spaceAfter: options.spaceAfter ?? 9,
    runs: Array.isArray(item) ? item : [item],
  })));
  shape.text.style = {
    fontSize: options.fontSize ?? 24,
    color: options.color ?? C.ink,
    lineSpacing: options.lineSpacing ?? 1.08,
    typeface: options.typeface ?? FONT,
    insets: { top: 0, right: 0, bottom: 0, left: 0 },
  };
  return shape;
}

function addNode(slide, name, label, x, y, w, h, color, fill = C.white, fontSize = 18, typeface = FONT) {
  const node = slide.shapes.add({
    geometry: "roundRect",
    name,
    position: { left: x, top: y, width: w, height: h },
    fill,
    line: { style: "solid", fill: color, width: 1.4 },
    borderRadius: 8,
  });
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

function addLine(slide, name, x1, y1, x2, y2, color, width = 1.5, dashed = false) {
  return slide.shapes.add({
    geometry: "line",
    name,
    position: { left: x1, top: y1, width: x2 - x1, height: y2 - y1 },
    fill: "none",
    line: { style: dashed ? "dashed" : "solid", fill: color, width },
  });
}

function connect(slide, from, to, color = C.secondary, dashed = false, kind = "straight") {
  return slide.shapes.connect(from, to, {
    kind,
    fromSide: "right",
    toSide: "left",
    line: { style: dashed ? "dashed" : "solid", fill: color, width: 1.6 },
    tail: { type: "arrow", width: "sm", length: "sm" },
  });
}

function vConnect(slide, from, to, color = C.secondary, dashed = false) {
  return slide.shapes.connect(from, to, {
    kind: "straight",
    fromSide: "bottom",
    toSide: "top",
    line: { style: dashed ? "dashed" : "solid", fill: color, width: 1.5 },
    tail: { type: "arrow", width: "sm", length: "sm" },
  });
}

function addSpeakerNotes(slide, notes) {
  slide.speakerNotes.textFrame.setText(notes);
  slide.speakerNotes.setVisible(true);
}

function addMiniModelBreadcrumb(slide, n) {
  addText(slide, "breadcrumb", "agent loop: model layer", {
    left: 980,
    top: 58,
    width: 210,
    height: 24,
  }, { fontSize: 13, bold: true, color: C.muted, alignment: "right", typeface: EN_FONT });
  const model = addNode(slide, "crumb-model", "Model", 1072, 88, 82, 30, C.indigo, C.indigoLight, 13, EN_FONT);
  const tools = addNode(slide, "crumb-tools", "Tools", 1164, 88, 62, 30, C.muted, C.white, 12, EN_FONT);
  connect(slide, model, tools, C.line);
  if (n) addFooter(slide, n);
}

function slide1(p) {
  const slide = p.slides.add();
  slide.background.fill = C.bg;
  addEyebrow(slide, "LESSON 03", C.indigo);
  addTitle(slide, "今天放大看 agent loop 裡的 model 層", 112, 36, 700);
  addBulletList(slide, "questions", [
    "LLM 到底在做什麼？",
    "為什麼它有時很強、有時很危險？",
    "如何把 LLM 放進可檢查的 biomedical workflow？",
  ], { left: 92, top: 270, width: 520, height: 158 }, { fontSize: 25, spaceAfter: 14 });

  const goal = addNode(slide, "goal", "Goal", 720, 224, 100, 44, C.muted, C.white, 15, EN_FONT);
  const model = addNode(slide, "model", "Model\nLLM call", 884, 198, 156, 70, C.indigo, C.indigoLight, 20, EN_FONT);
  const tools = addNode(slide, "tools", "Tools", 1100, 224, 100, 44, C.muted, C.white, 15, EN_FONT);
  const verify = addNode(slide, "verify", "Verify", 886, 384, 150, 54, C.amber, C.amberLight, 18, EN_FONT);
  connect(slide, goal, model, C.line);
  connect(slide, model, tools, C.line);
  vConnect(slide, model, verify, C.amber, true);
  addText(slide, "zoom", "Prompt, context, retrieved evidence, temperature, hallucination\n都會影響這一層的輸出。", {
    left: 704,
    top: 498,
    width: 500,
    height: 70,
  }, { fontSize: 22, color: C.secondary, alignment: "center" });
  addFooter(slide, 1);
  addSpeakerNotes(slide, "設定本堂課定位：不是模型架構課，也不是 prompt 技巧課，而是幫 agent 使用者理解 LLM 的行為邊界，知道什麼能信、什麼要查、什麼要留下紀錄。");
}

function slide2(p) {
  const slide = p.slides.add();
  slide.background.fill = C.bg;
  addEyebrow(slide, "LLM IS NOT A DATABASE", C.indigo);
  addTitle(slide, "LLM 不是資料庫；它產生最像答案的文字");
  addSurface(slide, "db-surface", 110, 230, 440, 300, C.white, C.line);
  addText(slide, "db-title", "Database", { left: 150, top: 260, width: 180, height: 38 }, { fontSize: 28, bold: true, color: C.teal, typeface: EN_FONT });
  addNode(slide, "query", "query", 160, 360, 110, 48, C.teal, C.tealLight, 18, EN_FONT);
  addNode(slide, "record", "record", 380, 360, 110, 48, C.teal, C.white, 18, EN_FONT);
  addLine(slide, "db-line", 270, 384, 380, 384, C.teal, 1.6);
  addText(slide, "db-copy", "查表：有明確來源、版本與結果。", { left: 150, top: 454, width: 320, height: 32 }, { fontSize: 21, color: C.secondary });

  addSurface(slide, "llm-surface", 730, 230, 440, 300, C.white, C.line);
  addText(slide, "llm-title", "LLM", { left: 770, top: 260, width: 180, height: 38 }, { fontSize: 28, bold: true, color: C.indigo, typeface: EN_FONT });
  addNode(slide, "context", "context", 760, 348, 126, 48, C.indigo, C.indigoLight, 18, EN_FONT);
  addNode(slide, "token", "next token", 984, 348, 136, 48, C.indigo, C.white, 18, EN_FONT);
  addLine(slide, "llm-line", 886, 372, 984, 372, C.indigo, 1.6);
  addText(slide, "llm-copy", "生成：依上下文預測下一段文字。", { left: 770, top: 454, width: 340, height: 32 }, { fontSize: 21, color: C.secondary });
  addFooter(slide, 2);
  addSpeakerNotes(slide, "用直觀方式說明：LLM 是根據上下文預測下一段最可能的文字。它可能記得常見知識，但不是穩定、可查詢、可保證更新的 biomedical database。");
}

function slide3(p) {
  const slide = p.slides.add();
  slide.background.fill = C.bg;
  addEyebrow(slide, "NEXT-TOKEN PREDICTION", C.indigo);
  addTitle(slide, "Next-token prediction 是判斷接下來最像什麼");
  const tokens = ["TP53", "is", "associated", "with"];
  tokens.forEach((t, i) => addNode(slide, `tok-${i}`, t, 128 + i * 140, 288, 112, 46, i === 0 ? C.teal : C.secondary, C.white, 17, EN_FONT));
  addText(slide, "ellipsis", "...", { left: 664, top: 286, width: 50, height: 40 }, { fontSize: 28, bold: true, color: C.secondary, typeface: EN_FONT });
  const probs = [
    ["cancer", "42%", C.indigo],
    ["mutation", "21%", C.teal],
    ["risk", "13%", C.amber],
  ];
  probs.forEach((p2, i) => {
    const y = 218 + i * 82;
    addNode(slide, `prob-${i}`, `${p2[0]}\n${p2[1]}`, 820, y, 148, 58, p2[2], p2[2] === C.amber ? C.amberLight : C.white, 18, EN_FONT);
    addLine(slide, `fan-${i}`, 704, 310, 820, y + 29, p2[2], 1.4);
  });
  addNode(slide, "chosen", "chosen next token", 1026, 300, 168, 58, C.indigo, C.indigoLight, 17, EN_FONT);
  addLine(slide, "chosen-line", 968, 329, 1026, 329, C.indigo, 1.6);
  addText(slide, "note", "流暢 ≠ 查證過；機率最高也不一定是真實。", { left: 258, top: 530, width: 760, height: 40 }, { fontSize: 27, bold: true, color: C.coral, alignment: "center" });
  addFooter(slide, 3);
  addSpeakerNotes(slide, "這張只建立直覺，不講模型細節。LLM 的輸出是根據上下文一步步產生的，因此它可能非常流暢，但流暢不代表有查過資料來源。");
}

function slide4(p) {
  const slide = p.slides.add();
  slide.background.fill = C.bg;
  addEyebrow(slide, "TOKENS AND CONTEXT", C.teal);
  addTitle(slide, "Token 不是字；context 是模型當下看得到的材料");
  addText(slide, "prompt", "Prompt example: summarize EGFR exon 19 deletion evidence", {
    left: 112,
    top: 206,
    width: 760,
    height: 34,
  }, { fontSize: 22, color: C.secondary, typeface: EN_FONT });
  const chips = ["summarize", "EGFR", "exon", "19", "deletion", "evidence"];
  chips.forEach((c, i) => addNode(slide, `chip-${i}`, c, 118 + i * 164, 292, 136, 44, i === 1 ? C.teal : C.secondary, C.white, 17, EN_FONT));
  addSurface(slide, "window", 184, 428, 898, 94, C.indigoLight, C.indigo);
  addText(slide, "window-text", "context window = prompt + selected excerpts + tables + tool outputs", {
    left: 210,
    top: 462,
    width: 846,
    height: 34,
  }, { fontSize: 24, bold: true, color: C.indigo, alignment: "center", typeface: EN_FONT });
  addText(slide, "note", "長文件需要選擇、壓縮、切段；沒放進 context 的內容不能可靠引用。", {
    left: 188,
    top: 584,
    width: 880,
    height: 34,
  }, { fontSize: 23, bold: true, color: C.secondary, alignment: "center" });
  addFooter(slide, 4);
  addSpeakerNotes(slide, "解釋 token 對使用者的實際影響：context 放不下所有 PDF、表格、程式碼。agent workflow 必須設計放什麼進去，以及怎麼檢查沒放進去的部分。");
}

function slide5(p) {
  const slide = p.slides.add();
  slide.background.fill = C.bg;
  addEyebrow(slide, "EMBEDDINGS", C.teal);
  addTitle(slide, "Embedding 找語意相近內容，但相近不等於正確");
  addSurface(slide, "map", 176, 190, 880, 400, C.white, C.line);
  const terms = [
    ["EGFR", 300, 280, C.teal],
    ["ALK", 374, 338, C.teal],
    ["lung cancer", 470, 260, C.teal],
    ["osimertinib", 662, 250, C.indigo],
    ["TKI", 760, 318, C.indigo],
    ["variant", 404, 476, C.amber],
    ["HGVS", 520, 510, C.amber],
    ["citation", 778, 480, C.secondary],
  ];
  terms.forEach((t) => addNode(slide, `term-${t[0]}`, t[0], t[1], t[2], 128, 42, t[3], t[3] === C.amber ? C.amberLight : C.white, 16, EN_FONT));
  addLine(slide, "axis-x", 236, 548, 990, 548, C.line, 1);
  addLine(slide, "axis-y", 236, 226, 236, 548, C.line, 1);
  addText(slide, "map-label", "semantic proximity", { left: 786, top: 552, width: 200, height: 24 }, { fontSize: 15, color: C.secondary, typeface: EN_FONT });
  addText(slide, "note", "Embedding 支援 retrieval、clustering、deduplication；retrieval 後仍要查來源。", {
    left: 146,
    top: 622,
    width: 940,
    height: 34,
  }, { fontSize: 23, bold: true, color: C.secondary, alignment: "center" });
  addFooter(slide, 5);
  addSpeakerNotes(slide, "說明 RAG 背後直覺：embedding 幫我們找到可能相關的段落，但不能保證段落就是答案，也不能保證模型正確引用。retrieval 後仍需要來源檢查。");
}

function slide6(p) {
  const slide = p.slides.add();
  slide.background.fill = C.bg;
  addEyebrow(slide, "PROMPT PACKET", C.indigo);
  addTitle(slide, "System prompt、task、context、evidence 要分清楚");
  const layers = [
    ["System", "role / rules / boundaries", C.indigo, C.indigoLight],
    ["User task", "this request", C.teal, C.white],
    ["Context", "working material", C.secondary, C.white],
    ["Retrieved content", "external evidence", C.teal, C.tealLight],
    ["Tool result", "structured output", C.amber, C.amberLight],
  ];
  layers.forEach((l, i) => {
    const y = 190 + i * 74;
    addNode(slide, `layer-${i}`, l[0], 230, y, 210, 54, l[2], l[3], 20, EN_FONT);
    addText(slide, `layer-copy-${i}`, l[1], { left: 480, top: y + 14, width: 440, height: 26 }, {
      fontSize: 20,
      color: C.secondary,
      typeface: EN_FONT,
    });
  });
  addText(slide, "debug", "Debug agent 行為時，先問：規則、任務、材料、證據哪一層錯了？", {
    left: 176,
    top: 594,
    width: 900,
    height: 34,
  }, { fontSize: 23, bold: true, color: C.ink, alignment: "center" });
  addFooter(slide, 6);
  addSpeakerNotes(slide, "建立詞彙精準度。未來設計 agent 時，要能分清楚規則、任務、材料、證據來源。這也是 debug agent 行為的基礎。");
}

function slide7(p) {
  const slide = p.slides.add();
  slide.background.fill = C.bg;
  addEyebrow(slide, "CONTEXT WINDOW", C.teal);
  addTitle(slide, "Context window 是有限工作桌面，不是無限記憶");
  addSurface(slide, "desk", 220, 190, 760, 380, C.white, C.indigo);
  addText(slide, "desk-title", "current model workspace", { left: 242, top: 214, width: 320, height: 28 }, { fontSize: 18, bold: true, color: C.indigo, typeface: EN_FONT });
  addNode(slide, "prompt", "prompt", 270, 294, 118, 44, C.indigo, C.indigoLight, 16, EN_FONT);
  addNode(slide, "paper", "paper excerpt", 432, 294, 160, 44, C.teal, C.tealLight, 16, EN_FONT);
  addNode(slide, "table", "table rows", 636, 294, 132, 44, C.secondary, C.white, 16, EN_FONT);
  addNode(slide, "tool", "tool output", 812, 294, 132, 44, C.amber, C.amberLight, 16, EN_FONT);
  addNode(slide, "source", "source IDs", 418, 424, 150, 44, C.teal, C.white, 16, EN_FONT);
  addNode(slide, "schema", "output schema", 626, 424, 170, 44, C.indigo, C.white, 16, EN_FONT);
  addText(slide, "outside", "full PDF\nraw dataset\nold chat\nunloaded files", { left: 1006, top: 250, width: 120, height: 120 }, { fontSize: 18, color: C.muted, alignment: "center", typeface: EN_FONT });
  addLine(slide, "outside-line", 970, 310, 1000, 310, C.line, 1, true);
  addText(slide, "note", "可重現的 workflow 要保存 prompt、context、retrieved files、tool outputs。", {
    left: 170,
    top: 610,
    width: 900,
    height: 34,
  }, { fontSize: 23, bold: true, color: C.secondary, alignment: "center" });
  addFooter(slide, 7);
  addSpeakerNotes(slide, "同一個問題，如果 context 不同，答案可能不同。可重現的 agent workflow 必須保存 prompt、context、retrieved files、tool outputs。");
}

function slide8(p) {
  const slide = p.slides.add();
  slide.background.fill = C.bg;
  addEyebrow(slide, "HALLUCINATION", C.coral);
  addTitle(slide, "Hallucination 常是合理語氣加上不可靠內容");
  const headers = ["Failure pattern", "Why it happens", "How to check"];
  headers.forEach((h, i) => addText(slide, `head-${i}`, h, { left: 130 + i * 330, top: 202, width: 260, height: 30 }, { fontSize: 18, bold: true, color: i === 0 ? C.coral : C.secondary, alignment: "center", typeface: EN_FONT }));
  const rows = [
    ["Fabricated citation", "text looks plausible", "open PMID / DOI"],
    ["Merged concepts", "similar patterns mix", "check source terms"],
    ["Unsupported claim", "answer pressure", "require evidence field"],
  ];
  rows.forEach((r, row) => {
    const y = 258 + row * 92;
    r.forEach((cell, col) => addNode(slide, `r${row}c${col}`, cell, 112 + col * 330, y, 288, 58, col === 0 ? C.coral : C.secondary, col === 0 ? C.coralLight : C.white, 17, EN_FONT));
  });
  addText(slide, "note", "語言流暢度不是 evidence；缺證據時要讓模型說不知道。", {
    left: 190,
    top: 584,
    width: 880,
    height: 34,
  }, { fontSize: 24, bold: true, color: C.coral, alignment: "center" });
  addFooter(slide, 8);
  addSpeakerNotes(slide, "避免把 hallucination 講成單純模型笨。它是生成式模型的自然風險：語言流暢度不等於事實正確性。尤其生醫領域中，錯誤可能很像真的。");
}

function slide9(p) {
  const slide = p.slides.add();
  slide.background.fill = C.bg;
  addEyebrow(slide, "BIOMEDICAL FAILURE MODES", C.coral);
  addTitle(slide, "Biomedical 錯誤要用具體欄位來檢查");
  const rows = [
    ["Citation", "PMID / DOI 編造", "PubMed / DOI lookup"],
    ["Gene symbol", "舊名、物種混淆", "HGNC / organism check"],
    ["Variant", "HGVS、座標版本錯", "ClinVar / genome build"],
    ["Drug claim", "適應症與證據等級混淆", "guideline / label"],
    ["Clinical claim", "過度推論", "human review"],
  ];
  addText(slide, "h1", "Field", { left: 120, top: 200, width: 180, height: 26 }, { fontSize: 18, bold: true, color: C.secondary, typeface: EN_FONT });
  addText(slide, "h2", "Risk", { left: 394, top: 200, width: 260, height: 26 }, { fontSize: 18, bold: true, color: C.coral, typeface: EN_FONT });
  addText(slide, "h3", "Check", { left: 762, top: 200, width: 260, height: 26 }, { fontSize: 18, bold: true, color: C.teal, typeface: EN_FONT });
  rows.forEach((r, i) => {
    const y = 244 + i * 66;
    addText(slide, `field-${i}`, r[0], { left: 120, top: y + 10, width: 190, height: 26 }, { fontSize: 19, bold: true, color: C.indigo, typeface: EN_FONT });
    addText(slide, `risk-${i}`, r[1], { left: 392, top: y + 10, width: 300, height: 26 }, { fontSize: 19, color: C.coral });
    addText(slide, `check-${i}`, r[2], { left: 762, top: y + 10, width: 320, height: 26 }, { fontSize: 19, color: C.teal, typeface: EN_FONT });
    addLine(slide, `rowline-${i}`, 112, y + 50, 1120, y + 50, C.line, 1);
  });
  addFooter(slide, 9);
  addSpeakerNotes(slide, "給具體風險邊界。生醫 workflow 中，citation、gene symbol、variant、drug、clinical claim 等欄位不能只靠語言模型判斷，必須用外部來源檢查。");
}

function slide10(p) {
  const slide = p.slides.add();
  slide.background.fill = C.bg;
  addEyebrow(slide, "REASONING LIMITS", C.indigo);
  addTitle(slide, "Reasoning 很有用，但不能保證事實正確");
  const steps = [
    ["Summarize", C.teal],
    ["Compare", C.teal],
    ["Plan", C.indigo],
    ["Infer", C.indigo],
  ];
  steps.forEach((s, i) => {
    const x = 150 + i * 205;
    const y = 430 - i * 58;
    addNode(slide, `step-${i}`, s[0], x, y, 150, 52, s[1], C.white, 19, EN_FONT);
    if (i > 0) addLine(slide, `ladder-${i}`, x - 70, y + 26, x, y + 26, C.line, 1.4);
  });
  addLine(slide, "ladder-to-gate", 915, 282, 952, 282, C.line, 1.4);
  addSurface(slide, "gate", 952, 224, 236, 196, C.amberLight, C.amber);
  addText(slide, "gate-title", "Verification gate", { left: 980, top: 254, width: 180, height: 30 }, { fontSize: 21, bold: true, color: C.amber, alignment: "center", typeface: EN_FONT });
  addText(slide, "gate-list", "資料來源\n程式輸出\n統計假設\n人工判斷", { left: 1004, top: 312, width: 150, height: 84 }, { fontSize: 16, color: C.secondary, lineSpacing: 1.12 });
  addText(slide, "note", "推理若建立在錯誤事實上，結論仍然錯。", { left: 210, top: 586, width: 820, height: 34 }, { fontSize: 25, bold: true, color: C.coral, alignment: "center" });
  addFooter(slide, 10);
  addSpeakerNotes(slide, "區分 reasoning-like behavior 和 validated reasoning。LLM 可以幫忙規劃分析、提出候選解釋，但 biomedical 結論必須回到資料、文獻、程式、統計結果檢查。");
}

function slide11(p) {
  const slide = p.slides.add();
  slide.background.fill = C.bg;
  addEyebrow(slide, "TOOL USE", C.teal);
  addTitle(slide, "Tool use 讓 LLM 請外部系統做可檢查的事");
  const llm = addNode(slide, "llm", "LLM", 106, 324, 120, 56, C.indigo, C.indigoLight, 22, EN_FONT);
  const call = addNode(slide, "call", "function call\nstructured args", 310, 310, 178, 76, C.indigo, C.white, 17, EN_FONT);
  const tool = addNode(slide, "tool", "database / script / API", 578, 310, 210, 76, C.teal, C.tealLight, 17, EN_FONT);
  const result = addNode(slide, "result", "structured result", 878, 310, 176, 76, C.teal, C.white, 18, EN_FONT);
  const summary = addNode(slide, "summary", "model summarizes", 1040, 442, 160, 58, C.indigo, C.white, 16, EN_FONT);
  connect(slide, llm, call, C.indigo);
  connect(slide, call, tool, C.teal);
  connect(slide, tool, result, C.teal);
  vConnect(slide, result, summary, C.indigo, true);
  addText(slide, "note", "Agent = LLM + tools + loop + checks", {
    left: 310,
    top: 552,
    width: 640,
    height: 40,
  }, { fontSize: 30, bold: true, color: C.ink, alignment: "center", typeface: EN_FONT });
  addFooter(slide, 11);
  addSpeakerNotes(slide, "建立和第二堂課的銜接：agent 不是比較聰明的聊天。agent 的價值在於能把不可靠的文字生成，接到可靠的工具執行與檢查流程。");
}

function slide12(p) {
  const slide = p.slides.add();
  slide.background.fill = C.bg;
  addEyebrow(slide, "BACK TO THE AGENT LOOP", C.indigo);
  addTitle(slide, "Agent 把 model 放進 tools、state 與 review loop");
  addLine(slide, "goal-model-a", 248, 336, 300, 336, C.line, 1.4);
  addLine(slide, "goal-model-b", 300, 280, 300, 336, C.line, 1.4);
  addLine(slide, "goal-model-c", 300, 280, 338, 280, C.line, 1.4);
  addLine(slide, "model-tools", 508, 280, 622, 280, C.indigo, 1.8);
  addLine(slide, "tools-observe-a", 742, 280, 800, 280, C.teal, 1.8);
  addLine(slide, "tools-observe-b", 800, 280, 800, 339, C.teal, 1.8);
  addLine(slide, "tools-observe-c", 800, 339, 868, 339, C.teal, 1.8);
  addLine(slide, "observe-verify-a", 933, 366, 933, 424, C.amber, 1.8);
  addLine(slide, "observe-verify-b", 685, 424, 933, 424, C.amber, 1.8);
  addLine(slide, "observe-verify-c", 685, 424, 685, 464, C.amber, 1.8);
  addLine(slide, "verify-state", 470, 491, 620, 491, C.amber, 1.8);
  addLine(slide, "state-goal-a", 120, 491, 344, 491, C.line, 1.4, true);
  addLine(slide, "state-goal-b", 120, 336, 120, 491, C.line, 1.4, true);
  addLine(slide, "state-goal-c", 120, 336, 144, 336, C.line, 1.4, true);
  const goal = addNode(slide, "goal", "Goal", 144, 312, 104, 48, C.muted, C.white, 15, EN_FONT);
  const model = addNode(slide, "model", "Model\nLLM call", 338, 242, 170, 76, C.indigo, C.indigoLight, 21, EN_FONT);
  const tools = addNode(slide, "tools", "Tools", 622, 253, 120, 54, C.teal, C.tealLight, 18, EN_FONT);
  const observe = addNode(slide, "observe", "Observe", 868, 312, 130, 54, C.secondary, C.white, 18, EN_FONT);
  const verify = addNode(slide, "verify", "Verify", 620, 464, 130, 54, C.amber, C.amberLight, 20, EN_FONT);
  const state = addNode(slide, "state", "State", 344, 464, 126, 54, C.secondary, C.white, 18, EN_FONT);
  addText(slide, "note", "今天學的是 model 層；可靠 workflow 還需要 tools、state、verification。", {
    left: 210,
    top: 592,
    width: 840,
    height: 34,
  }, { fontSize: 23, bold: true, color: C.secondary, alignment: "center" });
  addFooter(slide, 12);
  addSpeakerNotes(slide, "回到第二堂 agent loop，這次只高亮 model decision point。學生要理解，今天學的是 model 層，但可靠 agent workflow 還需要 tools、state、verification。");
}

function slide13(p) {
  const slide = p.slides.add();
  slide.background.fill = C.bg;
  addEyebrow(slide, "TEMPERATURE AND REPRODUCIBILITY", C.indigo);
  addTitle(slide, "Temperature 影響穩定性，不等於聰明程度");
  addLine(slide, "slider", 226, 284, 1010, 284, C.line, 6);
  addNode(slide, "low", "low temp\nrepeatable", 174, 230, 160, 74, C.indigo, C.indigoLight, 18, EN_FONT);
  addNode(slide, "mid", "default\nbalanced", 552, 230, 160, 74, C.secondary, C.white, 18, EN_FONT);
  addNode(slide, "high", "high temp\nvaried", 910, 230, 160, 74, C.coral, C.coralLight, 18, EN_FONT);
  const variants = [
    "EGFR is linked to targeted therapy.",
    "EGFR mutations can guide TKI selection.",
    "Evidence should be checked against sources.",
  ];
  variants.forEach((v, i) => addNode(slide, `variant-${i}`, v, 158 + i * 330, 416, 288, 66, i === 2 ? C.amber : C.secondary, C.white, 17, EN_FONT));
  addText(slide, "note", "可重現要保存 model、prompt、context、工具版本與資料版本。", {
    left: 204,
    top: 586,
    width: 820,
    height: 34,
  }, { fontSize: 23, bold: true, color: C.secondary, alignment: "center" });
  addFooter(slide, 13);
  addSpeakerNotes(slide, "讓學生理解同樣問題為什麼答案不同。實務上要記錄 model、日期、prompt、context、工具版本、資料版本、輸出檔案，必要時固定 seed 或 deterministic 設定。");
}

function slide14(p) {
  const slide = p.slides.add();
  slide.background.fill = C.bg;
  addEyebrow(slide, "BIOMEDICAL SAFETY BOUNDARY", C.coral);
  addTitle(slide, "Biomedical LLM 可以協助，但要知道何時停止");
  addSurface(slide, "assist", 120, 226, 420, 280, C.tealLight, C.teal);
  addText(slide, "assist-title", "Can assist", { left: 166, top: 260, width: 240, height: 34 }, { fontSize: 28, bold: true, color: C.teal, typeface: EN_FONT });
  addBulletList(slide, "assist-list", ["摘要與分類", "整理 evidence table", "草擬分析步驟", "提出檢查清單"], { left: 170, top: 330, width: 300, height: 130 }, { fontSize: 22, color: C.ink, spaceAfter: 8 });

  addSurface(slide, "stop", 720, 226, 420, 280, C.coralLight, C.coral);
  addText(slide, "stop-title", "Stop / review", { left: 768, top: 260, width: 260, height: 34 }, { fontSize: 28, bold: true, color: C.coral, typeface: EN_FONT });
  addBulletList(slide, "stop-list", ["診斷或治療建議", "drug dosage", "variant pathogenicity", "clinical action"], { left: 768, top: 330, width: 300, height: 130 }, { fontSize: 22, color: C.ink, spaceAfter: 8 });
  addNode(slide, "gate", "Human review gate", 488, 548, 270, 54, C.amber, C.amberLight, 22, EN_FONT);
  addFooter(slide, 14);
  addSpeakerNotes(slide, "把安全講成工程規格，而不是抽象倫理。任何會影響臨床解讀、病人風險、藥物建議、variant pathogenicity 的內容，都要有 evidence trail 和 human review。");
}

function slide15(p) {
  const slide = p.slides.add();
  slide.background.fill = C.ink;
  addText(slide, "title", "Good task specs make LLM output checkable", {
    left: 84,
    top: 78,
    width: 950,
    height: 58,
  }, { fontSize: 42, bold: true, color: C.white, typeface: EN_FONT });
  addText(slide, "subtitle", "Mini exercise: 把不可靠 prompt 改成可檢查的 task spec", {
    left: 88,
    top: 154,
    width: 900,
    height: 36,
  }, { fontSize: 24, color: "#DDE4E8" });
  addSurface(slide, "bad", 96, 248, 390, 224, "#26313A", "#52616D");
  addText(slide, "bad-title", "Unreliable prompt", { left: 126, top: 278, width: 250, height: 30 }, { fontSize: 21, bold: true, color: C.coral, typeface: EN_FONT });
  addText(slide, "bad-copy", "分析這些基因和癌症的關係，整理成表格。", { left: 126, top: 340, width: 300, height: 78 }, { fontSize: 23, color: "#DDE4E8", lineSpacing: 1.15 });
  addSurface(slide, "spec", 638, 230, 474, 272, "#26313A", C.indigo);
  addText(slide, "spec-title", "Checkable task spec", { left: 668, top: 260, width: 260, height: 30 }, { fontSize: 21, bold: true, color: "#AEBBFF", typeface: EN_FONT });
  const specItems = ["Goal", "Inputs + versions", "Evidence sources", "Output schema", "Checks + not found rule"];
  specItems.forEach((s, i) => addNode(slide, `spec-${i}`, s, 676 + (i % 2) * 210, 318 + Math.floor(i / 2) * 58, i === 4 ? 296 : 178, 38, i === 4 ? C.amber : C.indigo, i === 4 ? C.amberLight : C.indigoLight, 15, EN_FONT));
  addText(slide, "next", "Next: desktop agent workflow 將把 task spec 接到檔案、瀏覽器、terminal 和資料來源。", {
    left: 132,
    top: 570,
    width: 980,
    height: 34,
  }, { fontSize: 22, bold: true, color: "#DDE4E8", alignment: "center" });
  addDarkFooter(slide, 15);
  addSpeakerNotes(slide, "本堂核心轉換：從『請幫我分析』改成『可檢查任務規格』。練習可用不可靠 prompt：請幫我找出 TP53、EGFR、ALK 跟肺癌的關係，整理成表格。要求學生指定 gene symbol 標準、癌別範圍、資料來源、欄位格式、citation 欄位、找不到證據時填 not found、不得編造 PMID。");
}

async function main() {
  await fs.mkdir(OUT_DIR, { recursive: true });
  await fs.mkdir(path.dirname(FINAL_PPTX), { recursive: true });

  const presentation = Presentation.create({ slideSize: { width: W, height: H } });
  slide1(presentation);
  slide2(presentation);
  slide3(presentation);
  slide4(presentation);
  slide5(presentation);
  slide6(presentation);
  slide7(presentation);
  slide8(presentation);
  slide9(presentation);
  slide10(presentation);
  slide11(presentation);
  slide12(presentation);
  slide13(presentation);
  slide14(presentation);
  slide15(presentation);

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
