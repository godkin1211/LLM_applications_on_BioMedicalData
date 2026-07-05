import fs from "node:fs/promises";
import path from "node:path";
import { Presentation, PresentationFile } from "@oai/artifact-tool";

const SCRIPT_DIR = path.dirname(new URL(import.meta.url).pathname);
const REPO_ROOT = process.env.REPO_ROOT ? path.resolve(process.env.REPO_ROOT) : path.resolve(SCRIPT_DIR, "../..");
const OUT_DIR = path.join(REPO_ROOT, "previews", "lesson-03-llm-basics-for-agent-users");
const FINAL_PPTX = path.join(REPO_ROOT, "slides", "lesson-03-llm-basics-for-agent-users.pptx");

const W = 1280;
const H = 720;
const TOTAL = 35;
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

function addEyebrow(slide, text, color = C.indigo) {
  addText(slide, "eyebrow", text, { left: frame.left, top: frame.top, width: 780, height: 30 }, {
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
  addText(slide, dark ? "footer-dark" : "footer", `LLM basics for agent users  |  ${n}/${TOTAL}`, {
    left: frame.left,
    top: 668,
    width: 420,
    height: 22,
  }, { fontSize: 12, color: dark ? "#B7C0C7" : C.secondary, typeface: EN_FONT });
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

function addLine(slide, name, x1, y1, x2, y2, color, width = 1.5, dashed = false) {
  return slide.shapes.add({
    geometry: "line",
    name,
    position: { left: x1, top: y1, width: x2 - x1, height: y2 - y1 },
    fill: "none",
    line: { style: dashed ? "dashed" : "solid", fill: color, width },
  });
}

function connect(slide, from, to, color = C.secondary, dashed = false) {
  return slide.shapes.connect(from, to, {
    kind: "straight",
    fromSide: "right",
    toSide: "left",
    line: { style: dashed ? "dashed" : "solid", fill: color, width: 1.6 },
    tail: { type: "arrow", width: "sm", length: "sm" },
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
    bulletCharacter: "•",
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
  addEyebrow(slide, "LESSON 03", C.indigo);
  addText(slide, "title", "LLM basics for agent users", {
    left: 78,
    top: 116,
    width: 820,
    height: 70,
  }, { fontSize: 46, bold: true, color: C.ink, typeface: EN_FONT });
  addText(slide, "subtitle", "從 token、context、tool use 到 biomedical hallucination 驗證", {
    left: 82,
    top: 204,
    width: 880,
    height: 44,
  }, { fontSize: 27, bold: true, color: C.secondary });
  addBulletList(slide, "goals", [
    "看懂 LLM 為什麼會這樣回答",
    "知道 biomedical 任務何時要查、何時要停",
    "把模糊 prompt 改成可驗證 task spec",
  ], { left: 96, top: 352, width: 560, height: 150 }, { fontSize: 25, spaceAfter: 14 });
  const llm = addNode(slide, "llm", "LLM", 770, 304, 120, 58, C.indigo, C.indigoLight, 23, EN_FONT);
  const tools = addNode(slide, "tools", "Tools", 1010, 304, 120, 58, C.teal, C.tealLight, 21, EN_FONT);
  const verify = addNode(slide, "verify", "Verify", 890, 454, 130, 58, C.amber, C.amberLight, 21, EN_FONT);
  connect(slide, llm, tools, C.teal);
  addLine(slide, "verify-a", 950, 362, 950, 454, C.amber, 1.6, true);
  addFooter(slide, n);
  notes(slide, "設定這堂課的定位：不是模型數學課，也不是單純 prompt tips，而是讓學生能安全使用 LLM 和 agent 做 biomedical 任務。");
}

function agendaSlide(p, n) {
  const slide = baseSlide(p, n, "90-MINUTE MAP", "35 張投影片，分成 5 個學習段落");
  const rows = [
    ["0-10", "先拆錯誤直覺", "LLM 很會講話，但不是資料庫。"],
    ["10-30", "理解模型輸入輸出", "token、next-token、context window。"],
    ["30-48", "理解 agent 裡的 LLM", "system prompt、tool use、memory。"],
    ["48-70", "辨識 biomedical 風險", "hallucination、citation、gene、版本、臨床推論。"],
    ["70-90", "練習可驗證任務", "task spec、schema、checklist、human review。"],
  ];
  rows.forEach((r, i) => {
    const y = 184 + i * 78;
    addNode(slide, `time-${i}`, `${r[0]} min`, 110, y, 126, 48, i < 2 ? C.indigo : i < 4 ? C.teal : C.amber, i < 2 ? C.indigoLight : i < 4 ? C.tealLight : C.amberLight, 15, EN_FONT);
    addText(slide, `role-${i}`, r[1], { left: 284, top: y + 4, width: 286, height: 28 }, { fontSize: 22, bold: true });
    addText(slide, `copy-${i}`, r[2], { left: 610, top: y + 7, width: 500, height: 28 }, { fontSize: 19, color: C.secondary });
    if (i < rows.length - 1) addLine(slide, `step-line-${i}`, 173, y + 48, 173, y + 78, C.line);
  });
  notes(slide, "這張讓學生知道 90 分鐘的路線。重點是學會判斷與驗證，不是背術語。");
}

function thesisSlide(p, n) {
  const slide = baseSlide(p, n, "ONE SENTENCE", "這堂課只要先記住一句話");
  addSurface(slide, "quote-box", 142, 228, 996, 190, C.indigoLight, C.indigo);
  addText(slide, "quote", "LLM 很會產生文字；\nbiomedical workflow 要求可驗證。", {
    left: 190,
    top: 268,
    width: 900,
    height: 110,
  }, { fontSize: 38, bold: true, color: C.indigo, alignment: "center", lineSpacing: 1.14 });
  addText(slide, "sub", "所以我們不是問「它答得像不像」，而是問「它能不能被查」。", {
    left: 224,
    top: 500,
    width: 820,
    height: 40,
  }, { fontSize: 26, bold: true, color: C.coral, alignment: "center" });
  notes(slide, "用一句話建立整堂課的標準。之後所有概念都回到可驗證性。");
}

function compareSlide(p, n, eyebrow, title, left, right, note, color = C.indigo) {
  const slide = baseSlide(p, n, eyebrow, title, color);
  addSurface(slide, "left-box", 100, 220, 480, 272, left.fill ?? C.coralLight, left.color ?? C.coral);
  addText(slide, "left-title", left.title, { left: 140, top: 254, width: 360, height: 32 }, {
    fontSize: 26,
    bold: true,
    color: left.color ?? C.coral,
    typeface: left.typeface ?? FONT,
  });
  addBulletList(slide, "left-list", left.items, { left: 142, top: 326, width: 350, height: 118 }, {
    fontSize: 22,
    color: C.ink,
    spaceAfter: 9,
    typeface: left.typeface ?? FONT,
  });
  addSurface(slide, "right-box", 700, 220, 480, 272, right.fill ?? C.tealLight, right.color ?? C.teal);
  addText(slide, "right-title", right.title, { left: 740, top: 254, width: 360, height: 32 }, {
    fontSize: 26,
    bold: true,
    color: right.color ?? C.teal,
    typeface: right.typeface ?? FONT,
  });
  addBulletList(slide, "right-list", right.items, { left: 742, top: 326, width: 350, height: 118 }, {
    fontSize: 22,
    color: C.ink,
    spaceAfter: 9,
    typeface: right.typeface ?? FONT,
  });
  addText(slide, "note", note, { left: 170, top: 586, width: 940, height: 36 }, {
    fontSize: 24,
    bold: true,
    color: C.secondary,
    alignment: "center",
  });
  notes(slide, note);
}

function conceptSlide(p, n, eyebrow, title, bullets, callout, color = C.indigo) {
  const slide = baseSlide(p, n, eyebrow, title, color);
  addBulletList(slide, "bullets", bullets, { left: 106, top: 214, width: 560, height: 250 }, {
    fontSize: 24,
    spaceAfter: 13,
  });
  addSurface(slide, "callout", 760, 238, 360, 220, color === C.coral ? C.coralLight : color === C.teal ? C.tealLight : C.indigoLight, color);
  addText(slide, "callout-text", callout, { left: 802, top: 292, width: 276, height: 110 }, {
    fontSize: 25,
    bold: true,
    color,
    alignment: "center",
    verticalAlignment: "middle",
    lineSpacing: 1.14,
  });
  notes(slide, `${title}。教學重點：${callout}`);
}

function tokenExampleSlide(p, n) {
  const slide = baseSlide(p, n, "TOKENIZATION EXAMPLE", "生醫文字常常不是照你想的方式被切開");
  addText(slide, "prompt", "Example input", { left: 118, top: 198, width: 280, height: 30 }, { fontSize: 20, bold: true, color: C.secondary, typeface: EN_FONT });
  addSurface(slide, "input", 118, 236, 1040, 64, C.white, C.line);
  addText(slide, "input-text", "EGFR exon 19 deletion, TP53 p.R175H, 非小細胞肺癌", {
    left: 146,
    top: 254,
    width: 960,
    height: 30,
  }, { fontSize: 24, bold: true, color: C.ink, typeface: EN_FONT });
  const tokens = ["EGFR", "exon", "19", "deletion", "TP53", "p.", "R175H", "非小細胞", "肺癌"];
  tokens.forEach((t, i) => {
    const x = 124 + (i % 5) * 206;
    const y = 374 + Math.floor(i / 5) * 78;
    addNode(slide, `tok-${i}`, t, x, y, 168, 44, i < 7 ? C.indigo : C.teal, C.white, 17, i < 7 ? EN_FONT : FONT);
  });
  addText(slide, "note", "重點不是背 tokenization，而是知道模型看到的文字單位和人類直覺不同。", {
    left: 158,
    top: 588,
    width: 960,
    height: 34,
  }, { fontSize: 23, bold: true, color: C.secondary, alignment: "center" });
  notes(slide, "用 gene、variant、中文疾病名稱做 tokenization 直覺。提醒學生：罕見符號、座標、變異名稱可能讓模型更容易出錯。");
}

function flowSlide(p, n, eyebrow, title, nodes, footerNote, color = C.indigo) {
  const slide = baseSlide(p, n, eyebrow, title, color);
  const x0 = 112;
  nodes.forEach((node, i) => {
    const x = x0 + i * 250;
    const shape = addNode(slide, `flow-${i}`, node.label, x, 315, node.w ?? 160, node.h ?? 62, node.color ?? color, node.fill ?? C.white, node.fontSize ?? 18, node.typeface ?? FONT);
    if (i > 0) {
      addLine(slide, `flow-line-${i}`, x - 88, 346, x, 346, nodes[i - 1].color ?? C.line, 1.7);
    }
    if (node.caption) {
      addText(slide, `caption-${i}`, node.caption, { left: x - 18, top: 404, width: 200, height: 46 }, {
        fontSize: 17,
        color: C.secondary,
        alignment: "center",
        lineSpacing: 1.06,
      });
    }
    return shape;
  });
  addText(slide, "note", footerNote, { left: 160, top: 566, width: 960, height: 42 }, {
    fontSize: 24,
    bold: true,
    color: C.secondary,
    alignment: "center",
    lineSpacing: 1.08,
  });
  notes(slide, footerNote);
}

function tableSlide(p, n, eyebrow, title, columns, rows, color = C.teal) {
  const slide = baseSlide(p, n, eyebrow, title, color);
  const left = 92;
  const top = 198;
  const colW = [220, 394, 384];
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
    const y = top + 50 + row * 66;
    r.forEach((cell, col) => {
      const x = left + colW.slice(0, col).reduce((a, b) => a + b, 0);
      addText(slide, `r${row}c${col}`, cell, { left: x + 12, top: y + 8, width: colW[col] - 24, height: 42 }, {
        fontSize: col === 0 ? 18 : 17,
        bold: col === 0,
        color: col === 1 ? C.coral : col === 2 ? C.teal : C.indigo,
        lineSpacing: 1.06,
        typeface: /[A-Za-z]/.test(cell) ? EN_FONT : FONT,
      });
    });
    addLine(slide, `rowline-${row}`, left, y + 54, 1090, y + 54, C.line, 1);
  });
  addFooter(slide, n);
  notes(slide, `${title}。逐列說明風險與檢查方式。`);
}

function exerciseSlide(p, n, title, prompt, tasks, timing, color = C.coral) {
  const slide = baseSlide(p, n, "CLASS EXERCISE", title, color);
  addSurface(slide, "prompt-box", 96, 198, 500, 294, C.coralLight, C.coral);
  addText(slide, "prompt-label", "給學生的壞 prompt", { left: 132, top: 232, width: 260, height: 28 }, {
    fontSize: 22,
    bold: true,
    color: C.coral,
  });
  addText(slide, "prompt", prompt, { left: 136, top: 306, width: 370, height: 120 }, {
    fontSize: 27,
    bold: true,
    color: C.ink,
    lineSpacing: 1.13,
  });
  addSurface(slide, "task-box", 690, 198, 460, 294, C.white, C.line);
  addText(slide, "task-label", "要補上的規格", { left: 730, top: 232, width: 230, height: 28 }, {
    fontSize: 22,
    bold: true,
    color: C.indigo,
  });
  addBulletList(slide, "tasks", tasks, { left: 732, top: 294, width: 330, height: 150 }, {
    fontSize: 21,
    spaceAfter: 8,
  });
  addText(slide, "timing", timing, { left: 310, top: 578, width: 660, height: 40 }, {
    fontSize: 28,
    bold: true,
    color,
    alignment: "center",
  });
  notes(slide, "讓學生真的改寫 prompt。討論時請聚焦在來源、版本、schema、not found rule 與 review boundary。");
}

function checklistSlide(p, n) {
  const slide = p.slides.add();
  slide.background.fill = C.dark;
  addText(slide, "title", "每次用 LLM 做 biomedical 任務前，問這 6 件事", {
    left: 84,
    top: 74,
    width: 980,
    height: 62,
  }, { fontSize: 39, bold: true, color: C.white });
  const items = [
    "資料來源和版本在哪？",
    "哪些內容真的進了 context？",
    "哪些 claim 需要 citation？",
    "輸出 schema 能不能暴露錯誤？",
    "找不到證據時會不會停止？",
    "哪一步需要 human review？",
  ];
  items.forEach((item, i) => {
    const x = 110 + (i % 2) * 540;
    const y = 184 + Math.floor(i / 2) * 112;
    addNode(slide, `num-${i}`, `${i + 1}`, x, y, 50, 50, i < 3 ? C.teal : C.amber, i < 3 ? C.tealLight : C.amberLight, 20, EN_FONT);
    addText(slide, `item-${i}`, item, { left: x + 72, top: y + 8, width: 390, height: 48 }, {
      fontSize: 24,
      bold: true,
      color: "#DDE4E8",
      lineSpacing: 1.08,
    });
  });
  addText(slide, "bottom", "AI 很會講話，工程師和研究者要很會驗證。", {
    left: 210,
    top: 594,
    width: 860,
    height: 34,
  }, { fontSize: 25, bold: true, color: "#FFD98A", alignment: "center" });
  addFooter(slide, n, true);
  notes(slide, "把全課收斂成可帶走的 checklist。");
}

function sectionSlide(p, n, eyebrow, title, subtitle, color = C.indigo) {
  const slide = p.slides.add();
  slide.background.fill = color === C.coral ? C.coralLight : color === C.teal ? C.tealLight : C.indigoLight;
  addEyebrow(slide, eyebrow, color);
  addText(slide, "section-title", title, { left: 84, top: 210, width: 940, height: 94 }, {
    fontSize: 44,
    bold: true,
    color,
    lineSpacing: 1.02,
  });
  addText(slide, "section-subtitle", subtitle, { left: 88, top: 338, width: 880, height: 64 }, {
    fontSize: 26,
    bold: true,
    color: C.secondary,
    lineSpacing: 1.12,
  });
  addFooter(slide, n);
  notes(slide, subtitle);
}

function buildSlides(p) {
  titleSlide(p, 1);
  agendaSlide(p, 2);
  thesisSlide(p, 3);
  compareSlide(p, 4, "WRONG INTUITION 1", "LLM 不是 biomedical database", {
    title: "不要這樣想",
    items: ["像 PubMed 一樣查表", "像 ClinVar 一樣保證版本", "像 HGNC 一樣維護符號"],
  }, {
    title: "比較接近這樣",
    items: ["根據 context 生成文字", "可能記得常見模式", "需要外部來源查證"],
  }, "資料庫回答要可追溯；LLM 回答要被驗證。", C.coral);
  compareSlide(p, 5, "WRONG INTUITION 2", "講得順不代表講得對", {
    title: "流暢答案",
    items: ["語氣穩", "格式漂亮", "聽起來像 paper"],
  }, {
    title: "可靠答案",
    items: ["claim 對應來源", "版本清楚", "找不到就停止"],
  }, "流暢度是語言能力，不是 evidence。", C.coral);
  sectionSlide(p, 6, "PART 1", "模型怎麼把文字變成輸出", "先理解 token、next-token prediction 與 context window。", C.indigo);
  conceptSlide(p, 7, "TOKEN", "Token 是模型處理文字的基本單位", [
    "token 不一定等於一個中文字或英文單字",
    "符號、數字、variant notation 可能被切成多段",
    "模型的輸入、輸出、成本與長度限制都跟 token 有關",
  ], "學生不用背切法，\n但要知道模型不是用人類讀法在看字。");
  tokenExampleSlide(p, 8);
  flowSlide(p, 9, "NEXT-TOKEN PREDICTION", "LLM 一步一步預測下一段最可能的文字", [
    { label: "TP53", color: C.teal, typeface: EN_FONT },
    { label: "is associated", color: C.secondary, typeface: EN_FONT },
    { label: "with", color: C.secondary, typeface: EN_FONT },
    { label: "cancer?\nmutation?\nrisk?", color: C.indigo, fill: C.indigoLight, fontSize: 16, typeface: EN_FONT },
  ], "它很會補完模式，所以也可能補出一個看起來合理但不存在的 PMID。");
  conceptSlide(p, 10, "WHY PLAUSIBLE TEXT HAPPENS", "為什麼 LLM 很容易產生「像答案」的文字", [
    "訓練目標讓它學會延續語言模式",
    "常見知識會讓答案看起來很有把握",
    "當 prompt 要求它一定回答時，它會傾向完成任務",
  ], "像答案 ≠ 是答案", C.coral);
  conceptSlide(p, 11, "CONTEXT WINDOW", "Context window 是模型當下看得到的工作桌面", [
    "包含 system prompt、user prompt、貼上的資料、tool output",
    "沒有放進 context 的內容，模型不能可靠引用",
    "長文件需要切段、選擇、摘要與來源標記",
  ], "它不是無限記憶，\n只是當下桌面。", C.teal);
  conceptSlide(p, 12, "CONTEXT LIMIT", "Biomedical context 常常比模型桌面還大", [
    "一篇 PDF 可能有補充表格、方法、cohort、版本資訊",
    "資料庫有日期、release、genome build、transcript version",
    "表格欄位若沒有定義，模型會自己猜意思",
  ], "資料放不完整，\n答案就不能當完整。", C.teal);
  compareSlide(p, 13, "CONTEXT POLLUTION", "錯資料進 context，模型會很認真地整理錯誤", {
    title: "污染來源",
    items: ["過期資料庫匯出", "錯誤中間結果", "未標註物種或 build"],
  }, {
    title: "防護方式",
    items: ["保留來源 ID", "保留版本日期", "讓模型標註不確定"],
  }, "LLM 不會自動知道你丟進去的表格是錯的。", C.coral);
  sectionSlide(p, 14, "PART 2", "Agent 裡的 LLM 不是單獨工作", "system prompt、tool use、memory 決定了它能不能被檢查。", C.teal);
  conceptSlide(p, 15, "SYSTEM PROMPT", "System prompt 是行為規則，不是任務內容", [
    "定義角色、邊界、禁止事項與輸出要求",
    "可要求模型引用來源、拒絕無證據 claim",
    "不清楚的規則會讓 agent 行為難以 debug",
  ], "規則層和任務層\n要分開想。");
  compareSlide(p, 16, "PROMPT LAYERS", "User prompt 和 system prompt 解決不同問題", {
    title: "User prompt",
    items: ["這次要做什麼", "要處理哪些檔案", "希望輸出什麼格式"],
    color: C.teal,
    fill: C.tealLight,
  }, {
    title: "System prompt",
    items: ["永遠遵守的規則", "安全邊界", "遇到缺證據要停止"],
    color: C.indigo,
    fill: C.indigoLight,
  }, "答錯時先問：任務錯、規則錯、材料錯，還是檢查流程錯？");
  flowSlide(p, 17, "PROMPT PACKET", "真正送進模型的是一包材料", [
    { label: "system\nrules", color: C.indigo, fill: C.indigoLight, fontSize: 17, typeface: EN_FONT },
    { label: "user\ntask", color: C.teal, fill: C.tealLight, fontSize: 17, typeface: EN_FONT },
    { label: "context\nfiles", color: C.secondary, fontSize: 17, typeface: EN_FONT },
    { label: "tool\nresults", color: C.amber, fill: C.amberLight, fontSize: 17, typeface: EN_FONT },
  ], "Debug agent 時，要能指出是哪一層讓答案變差。");
  flowSlide(p, 18, "TOOL USE", "Tool use 讓 LLM 請外部系統做可檢查的事", [
    { label: "LLM\nplans", color: C.indigo, fill: C.indigoLight, fontSize: 18, typeface: EN_FONT },
    { label: "function\ncall", color: C.indigo, fontSize: 17, typeface: EN_FONT },
    { label: "database /\nscript / API", color: C.teal, fill: C.tealLight, fontSize: 17, typeface: EN_FONT },
    { label: "structured\nresult", color: C.teal, fontSize: 17, typeface: EN_FONT },
  ], "LLM 負責規劃與解釋；工具負責查證與計算。", C.teal);
  tableSlide(p, 19, "BIOMEDICAL TOOL EXAMPLES", "哪些事應該交給 tool，而不是讓模型猜", ["Need", "Bad if model guesses", "Better tool/check"], [
    ["Citation", "PMID / DOI 看起來像真的", "PubMed / DOI lookup"],
    ["Gene symbol", "alias、舊名、物種混淆", "HGNC / organism check"],
    ["Variant", "HGVS、transcript、build 錯", "ClinVar / VEP / build check"],
    ["Computation", "算式或統計被口算", "script + saved output"],
    ["Table lookup", "欄位含義被猜測", "schema + row IDs"],
  ], C.teal);
  conceptSlide(p, 20, "MEMORY", "Memory 是被保存、取回、再放進 context 的資訊", [
    "memory 不是模型腦中神秘角落",
    "它通常是外部儲存或系統狀態",
    "被取回後仍然要跟這次任務一起檢查",
  ], "Memory 也可能\n過期或污染任務。", C.amber);
  conceptSlide(p, 21, "MEMORY RISK", "Biomedical memory 最怕舊版本和錯任務混在一起", [
    "上次的 ClinVar release 可能已經不是這次要用的版本",
    "舊分析假設可能不適用新的 cohort",
    "長期偏好不能取代本次 evidence trail",
  ], "記憶越方便，\n越要標版本。", C.amber);
  exerciseSlide(p, 22, "小練習 1：哪些放 context，哪些交給 tool？", "請模型判斷 EGFR exon 19 deletion 是否和某藥物治療有關。", [
    "哪些資料要放進 context？",
    "哪些事要 tool lookup？",
    "哪些 claim 要 human review？",
    "缺資料時要怎麼停止？",
  ], "5 分鐘分組 + 3 分鐘講答案");
  sectionSlide(p, 23, "PART 3", "Hallucination 不是偶發小錯，是生成式系統的自然風險", "接下來把錯誤拆成來源和檢查方式。", C.coral);
  conceptSlide(p, 24, "HALLUCINATION", "Hallucination 是沒有可靠依據卻生成合理文字", [
    "它可能是完全編造，也可能是混合幾個相似事實",
    "最危險的是語氣穩、格式好、但 evidence 不存在",
    "biomedical 錯誤常常很像真的",
  ], "語氣不是證據。", C.coral);
  conceptSlide(p, 25, "SOURCE 1", "缺少證據，但 prompt 逼它回答", [
    "「一定要給我結論」會增加編造風險",
    "模型傾向完成任務，而不是讓你失望",
    "要明確允許 not found、insufficient evidence、needs review",
  ], "好 prompt 要允許它說：\n我不知道。", C.coral);
  conceptSlide(p, 26, "SOURCE 2", "相似概念混淆會讓答案看起來專業又危險", [
    "gene alias 和正式 symbol 混用",
    "疾病 subtype 被合併成一個大類",
    "drug indication、trial evidence、guideline recommendation 混在一起",
  ], "相近不等於相同。", C.coral);
  conceptSlide(p, 27, "SOURCE 3", "Context 不完整或版本錯誤會導致錯結論", [
    "只給 abstract，模型可能補出 full text 才有的細節",
    "ClinVar、gnomAD、Ensembl release 不一致",
    "reference genome build 或 transcript version 沒寫清楚",
  ], "版本沒寫，\n就是在邀請混亂。", C.coral);
  tableSlide(p, 28, "COMMON ERROR 1", "假 citation：最像真的錯誤", ["Pattern", "What goes wrong", "How to check"], [
    ["Fabricated PMID", "號碼存在但不支持該 claim", "open PubMed record"],
    ["Wrong DOI", "DOI 指到不同 paper", "DOI resolver"],
    ["Over-cited review", "review 被當 primary evidence", "check study type"],
    ["Quote drift", "引用句子和原文意思不同", "keep evidence quote"],
  ], C.coral);
  tableSlide(p, 29, "COMMON ERROR 2", "錯 gene symbol：一個字母就能換世界線", ["Pattern", "What goes wrong", "How to check"], [
    ["Alias", "舊名和正式 symbol 混用", "HGNC approved symbol"],
    ["Species", "mouse gene 被當 human gene", "organism check"],
    ["Family", "gene family member 被混淆", "stable ID"],
    ["Formatting", "大小寫造成物種或符號誤判", "naming convention"],
  ], C.coral);
  tableSlide(p, 30, "COMMON ERROR 3", "錯資料庫版本：答案不是錯在語言，是錯在時間", ["Database", "Version risk", "Check"], [
    ["ClinVar", "interpretation 會更新", "release date"],
    ["gnomAD", "population frequency 版本差異", "dataset version"],
    ["Ensembl", "gene model / transcript 改變", "release + transcript"],
    ["Reference", "GRCh37 / GRCh38 座標不同", "genome build"],
  ], C.coral);
  tableSlide(p, 31, "COMMON ERROR 4", "過度臨床推論：從相關性跳到建議", ["Claim", "Danger", "Boundary"], [
    ["Association", "被講成 causation", "state evidence level"],
    ["Biomarker", "被講成 treatment decision", "guideline / label"],
    ["Variant", "被講成 pathogenic", "ClinVar + expert review"],
    ["Summary", "被講成 patient-specific advice", "human clinical review"],
  ], C.coral);
  conceptSlide(p, 32, "WHY VERIFY", "Biomedical 任務需要驗證，因為錯誤有實際代價", [
    "研究結論可能被錯誤 evidence 影響",
    "臨床語氣可能讓非專家誤以為是建議",
    "資料庫版本錯誤會讓結果難以重現",
  ], "可驗證不是潔癖，\n是專業安全帶。", C.teal);
  conceptSlide(p, 33, "CHECKABLE TASK SPEC", "可檢查 task spec 讓 LLM 不容易亂發揮", [
    "Goal：要產出什麼，給誰用",
    "Inputs：資料、欄位、版本、限制",
    "Sources：允許使用哪些 evidence",
    "Schema：欄位、型別、citation、not found rule",
    "Review boundary：哪些 claim 必須人工檢查",
  ], "Prompt = 任務 + 材料 + 格式 + 檢查規則", C.teal);
  exerciseSlide(p, 34, "小練習 2：把壞 prompt 改成可檢查 task spec", "幫我整理 TP53、EGFR、ALK 跟肺癌的關係，做成表格。", [
    "指定資料來源與版本",
    "指定欄位與 citation 格式",
    "每個 claim 附 evidence quote",
    "找不到證據時填 not found",
    "標出需要 human review 的欄位",
  ], "8 分鐘改寫 + 5 分鐘分享", C.coral);
  checklistSlide(p, 35);
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
