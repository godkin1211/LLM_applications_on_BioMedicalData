import fs from "node:fs/promises";
import path from "node:path";
import { Presentation, PresentationFile } from "@oai/artifact-tool";

const SCRIPT_DIR = path.dirname(new URL(import.meta.url).pathname);
const REPO_ROOT = path.resolve(SCRIPT_DIR, "../..");
const OUT_DIR = path.join(REPO_ROOT, "previews", "lesson-02-ai-agents-vibe-coding-desktop-utilities");
const FINAL_PPTX = path.join(REPO_ROOT, "slides", "lesson-02-ai-agents-vibe-coding-desktop-utilities.pptx");

const W = 1280;
const H = 720;
const frame = { left: 76, top: 58, width: 1128, height: 594 };
const TOTAL = 11;

const C = {
  bg: "#F7F8F6",
  grayBg: "#EEF1F2",
  ink: "#17202A",
  secondary: "#5C6670",
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

function addTitle(slide, text, y = 96, size = 36, width = 1020) {
  return addText(slide, "title", text, { left: frame.left, top: y, width, height: 96 }, {
    fontSize: size,
    bold: true,
    color: C.ink,
    lineSpacing: 0.96,
  });
}

function addFooter(slide, n) {
  addText(slide, "footer", `AI agents, vibe coding, desktop utilities  |  ${n}/${TOTAL}`, {
    left: frame.left,
    top: 668,
    width: 520,
    height: 22,
  }, { fontSize: 12, color: C.secondary, typeface: EN_FONT });
}

function addDarkFooter(slide, n) {
  addText(slide, "footer-dark", `AI agents, vibe coding, desktop utilities  |  ${n}/${TOTAL}`, {
    left: frame.left,
    top: 668,
    width: 520,
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

function addPill(slide, name, text, x, y, w, color, fill = C.white, fontSize = 16) {
  return addNode(slide, name, text, x, y, w, 38, color, fill, fontSize, EN_FONT);
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

function addLine(slide, name, x1, y1, x2, y2, color, width = 1.5, dashed = false) {
  return slide.shapes.add({
    geometry: "line",
    name,
    position: { left: x1, top: y1, width: x2 - x1, height: y2 - y1 },
    fill: "none",
    line: { style: dashed ? "dashed" : "solid", fill: color, width },
  });
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

function addSpeakerNotes(slide, notes) {
  slide.speakerNotes.textFrame.setText(notes);
  slide.speakerNotes.setVisible(true);
}

function slide1(p) {
  const slide = p.slides.add();
  slide.background.fill = C.bg;
  addEyebrow(slide, "LESSON 02", C.indigo);
  addText(slide, "lesson-title", "Introduction to AI agents,\nvibe coding, and desktop utilities", {
    left: frame.left,
    top: 116,
    width: 620,
    height: 150,
  }, { fontSize: 36, bold: true, color: C.ink, lineSpacing: 0.94, typeface: EN_FONT });
  addText(slide, "subtitle", "從聊天，進到可執行、可檢查的研究流程", {
    left: frame.left,
    top: 296,
    width: 610,
    height: 46,
  }, { fontSize: 27, color: C.indigo, bold: true });
  addBulletList(slide, "questions", [
    "AI agent 比 chatbot 多了什麼？",
    "vibe coding 適合解決什麼問題？",
    "desktop utilities 如何接進研究流程？",
  ], { left: frame.left, top: 390, width: 580, height: 150 }, { fontSize: 24, spaceAfter: 14 });

  const labels = [
    ["Ask", C.secondary],
    ["Plan", C.indigo],
    ["Use tools", C.teal],
    ["Verify", C.amber],
    ["Deliver", C.teal],
  ];
  let prev = null;
  labels.forEach((item, i) => {
    const node = addNode(slide, `flow-${i}`, item[0], 700 + i * 96, 250 + (i % 2) * 70, 82, 50, item[1], item[1] === C.amber ? C.amberLight : C.white, 16, EN_FONT);
    if (prev) connect(slide, prev, node, i === 3 ? C.amber : C.indigo, false);
    prev = node;
  });
  addText(slide, "right-note", "agent workflow = goal + tools + checks", {
    left: 736,
    top: 456,
    width: 390,
    height: 36,
  }, { fontSize: 22, bold: true, color: C.secondary, alignment: "center", typeface: EN_FONT });
  addFooter(slide, 1);
  addSpeakerNotes(slide, "開場先定位第二堂課：不是介紹工具，也不是 prompt 技巧，而是建立 agent workflow 的操作框架。學生要開始學會判斷哪些研究任務能被拆成可檢查、可重現的流程。");
}

function slide2(p) {
  const slide = p.slides.add();
  slide.background.fill = C.bg;
  addEyebrow(slide, "LESSON MAP", C.teal);
  addTitle(slide, "本堂課把 agent 放進研究者每天會遇到的工作流");
  const modules = [
    ["Agent", "從回答問題到執行任務", C.indigo],
    ["Vibe coding", "快速做出可測試原型", C.indigo],
    ["Desktop utilities", "連接檔案、瀏覽器與腳本", C.teal],
    ["Biomedical workflow", "讓 evidence 可以被追溯", C.teal],
  ];
  modules.forEach((m, i) => {
    const x = 94 + i * 288;
    addNode(slide, `module-${i}`, m[0], x, 250, 220, 62, m[2], C.white, 24, EN_FONT);
    addText(slide, `module-copy-${i}`, m[1], { left: x + 4, top: 334, width: 212, height: 56 }, {
      fontSize: 20,
      color: C.secondary,
      alignment: "center",
    });
    if (i < modules.length - 1) addLine(slide, `module-line-${i}`, x + 220, 281, x + 288, 281, C.line, 1.4);
  });
  addText(slide, "bottom-note", "這一堂的目標：學會判斷 agent 能做什麼、如何做、怎麼檢查。", {
    left: 172,
    top: 534,
    width: 880,
    height: 42,
  }, { fontSize: 25, bold: true, color: C.ink, alignment: "center" });
  addFooter(slide, 2);
  addSpeakerNotes(slide, "用四段 roadmap 建立本堂課結構。這堂從 agent 概念進到 vibe coding，再到 desktop utilities，最後回到 biomedical workflow。");
}

function slide3(p) {
  const slide = p.slides.add();
  slide.background.fill = C.bg;
  addEyebrow(slide, "CHATBOT VS AGENT", C.indigo);
  addTitle(slide, "Chatbot 回答問題；agent 在目標下執行並檢查");

  addSurface(slide, "chatbot-surface", 86, 202, 500, 314, C.white, C.line);
  addText(slide, "chatbot-head", "Chatbot", { left: 116, top: 226, width: 210, height: 42 }, {
    fontSize: 28,
    bold: true,
    color: C.secondary,
    typeface: EN_FONT,
  });
  const prompt = addNode(slide, "prompt", "Prompt", 144, 330, 132, 54, C.secondary, C.white, 18, EN_FONT);
  const response = addNode(slide, "response", "Response", 384, 330, 142, 54, C.secondary, C.white, 18, EN_FONT);
  connect(slide, prompt, response, C.secondary);
  addText(slide, "chatbot-copy", "單步互動，主要產出文字。", { left: 140, top: 432, width: 350, height: 34 }, {
    fontSize: 22,
    color: C.secondary,
  });

  addSurface(slide, "agent-surface", 690, 202, 500, 314, C.white, C.line);
  addText(slide, "agent-head", "AI Agent", { left: 720, top: 226, width: 220, height: 42 }, {
    fontSize: 28,
    bold: true,
    color: C.indigo,
    typeface: EN_FONT,
  });
  const goal = addNode(slide, "goal", "Goal", 720, 318, 94, 48, C.indigo, C.indigoLight, 16, EN_FONT);
  const plan = addNode(slide, "plan", "Plan", 850, 318, 94, 48, C.indigo, C.white, 16, EN_FONT);
  const tools = addNode(slide, "tools", "Tools", 980, 318, 94, 48, C.teal, C.white, 16, EN_FONT);
  const verify = addNode(slide, "verify", "Verify", 980, 414, 94, 48, C.amber, C.amberLight, 16, EN_FONT);
  const output = addNode(slide, "output", "Output", 850, 414, 94, 48, C.teal, C.white, 16, EN_FONT);
  connect(slide, goal, plan, C.indigo);
  connect(slide, plan, tools, C.indigo);
  vConnect(slide, tools, verify, C.amber);
  connect(slide, output, verify, C.amber);
  addLine(slide, "agent-return-line", 850, 438, 768, 438, C.amber, 1.4, true);
  addLine(slide, "agent-return-up", 768, 438, 768, 366, C.amber, 1.4, true);
  addText(slide, "agent-copy", "多步流程，包含工具、狀態與檢查。", { left: 720, top: 532, width: 420, height: 34 }, {
    fontSize: 22,
    color: C.secondary,
  });
  addFooter(slide, 3);
  addSpeakerNotes(slide, "用簡單對比建立核心概念。Chatbot 像互動式文字介面；agent 則像可以拿資料、查資料庫、寫程式、跑檢查、修正輸出的流程執行者。");
}

function slide4(p) {
  const slide = p.slides.add();
  slide.background.fill = C.bg;
  addEyebrow(slide, "AGENT COMPONENTS", C.teal);
  addTitle(slide, "Agent 是一組可組合元件，不只是模型");
  const center = addNode(slide, "model", "Model\n推理與生成", 548, 328, 184, 82, C.indigo, C.indigoLight, 22);
  const items = [
    ["Context", "任務、資料、限制", 246, 230, C.secondary, C.white],
    ["Tools", "搜尋、讀檔、查 DB", 820, 230, C.teal, C.tealLight],
    ["Memory / state", "進度與中間結果", 238, 446, C.secondary, C.white],
    ["Plan", "拆解任務", 840, 446, C.indigo, C.white],
    ["Action loop", "執行與觀察", 448, 188, C.indigo, C.white],
    ["Verification", "檢查與停止條件", 468, 542, C.amber, C.amberLight],
  ];
  for (const [head, sub, x, y, color, fill] of items) {
    const node = addNode(slide, `component-${head}`, `${head}\n${sub}`, x, y, 190, 62, color, fill, 16, head.includes("/") || head === "Context" || head === "Tools" ? EN_FONT : FONT);
    slide.shapes.connect(center, node, { kind: "straight", line: { style: "solid", fill: C.line, width: 1.2 } });
  }
  center.bringToFront();
  addFooter(slide, 4);
  addSpeakerNotes(slide, "介紹 agent 不是單一模型，而是系統組合。Model 只是其中一部分；真正影響品質的是 context 是否完整、tools 是否可靠、state 是否能追蹤、輸出是否能被驗證。");
}

function slide5(p) {
  const slide = p.slides.add();
  slide.background.fill = C.bg;
  addEyebrow(slide, "AGENT LOOP", C.indigo);
  addTitle(slide, "Agent 的核心是一個可檢查的工作循環");
  const goal = addNode(slide, "goal", "Goal", 162, 302, 116, 56, C.teal, C.tealLight, 19, EN_FONT);
  const plan = addNode(slide, "plan", "Plan", 342, 202, 116, 56, C.indigo, C.white, 19, EN_FONT);
  const act = addNode(slide, "act", "Act\nwith tools", 582, 202, 138, 64, C.teal, C.white, 18, EN_FONT);
  const observe = addNode(slide, "observe", "Observe", 822, 302, 128, 56, C.secondary, C.white, 18, EN_FONT);
  const verify = addNode(slide, "verify", "Verify", 582, 466, 138, 64, C.amber, C.amberLight, 20, EN_FONT);
  const state = addNode(slide, "state", "Update\nstate", 342, 466, 116, 64, C.secondary, C.white, 18, EN_FONT);
  connect(slide, goal, plan, C.indigo, false, "elbow");
  connect(slide, plan, act, C.indigo);
  connect(slide, act, observe, C.teal, false, "elbow");
  connect(slide, observe, verify, C.amber, false, "elbow");
  addLine(slide, "verify-state-clean", 458, 498, 582, 498, C.amber, 1.5);
  connect(slide, state, goal, C.secondary, true, "elbow");
  const human = addNode(slide, "human-gate", "Human review\ngate", 910, 466, 168, 64, C.amber, C.amberLight, 17, EN_FONT);
  addLine(slide, "human-review-link", 720, 498, 910, 498, C.amber, 1.5, true);
  for (const node of [goal, plan, act, observe, verify, state, human]) node.bringToFront();
  addText(slide, "loop-note", "不是一次輸入、一次輸出，而是在約束內反覆觀察、修正、停止。", {
    left: 160,
    top: 594,
    width: 820,
    height: 34,
  }, { fontSize: 23, bold: true, color: C.secondary, alignment: "center" });
  addFooter(slide, 5);
  addSpeakerNotes(slide, "這張是本堂課的核心圖。Agent workflow 不是一次輸入、一次輸出，而是 plan-action-observe-verify loop。生醫任務尤其需要 verification，因為錯 citation、錯 database ID、錯分析假設都可能造成嚴重後果。");
}

function slide6(p) {
  const slide = p.slides.add();
  slide.background.fill = C.bg;
  addEyebrow(slide, "VERIFICATION BY DESIGN", C.amber);
  addTitle(slide, "Verification 不是最後一步，而是 workflow 設計的一部分");
  const artifacts = [
    ["Evidence table", "PMID / DOI", C.teal],
    ["Analysis script", "input / output / log", C.indigo],
    ["Citation", "回到原文段落", C.amber],
  ];
  artifacts.forEach((a, i) => {
    const x = 120 + i * 360;
    const top = addNode(slide, `artifact-${i}`, a[0], x, 238, 230, 62, a[2], C.white, 20, EN_FONT);
    const bottom = addNode(slide, `check-${i}`, a[1], x + 16, 368, 198, 56, a[2], i === 2 ? C.amberLight : C.white, 17);
    vConnect(slide, top, bottom, a[2], true);
  });
  addText(slide, "stop", "Stop condition：什麼情況可以交付？什麼情況必須回到人工檢查？", {
    left: 180,
    top: 528,
    width: 880,
    height: 42,
  }, { fontSize: 24, bold: true, color: C.coral, alignment: "center" });
  addFooter(slide, 6);
  addSpeakerNotes(slide, "強調可檢查是 agent workflow 的核心，不是附加功能。Evidence table 要能追到 PMID/DOI；分析腳本要能重跑；資料庫查詢要記錄 query 與版本；citation 要檢查是否真的支持該句。");
}

function slide7(p) {
  const slide = p.slides.add();
  slide.background.fill = C.bg;
  addEyebrow(slide, "VIBE CODING", C.indigo);
  addTitle(slide, "Vibe coding 是快速探索，不是把責任交給模型");
  const stages = [
    ["Precise\nimplementation", "人主導細節", C.secondary],
    ["Assisted\niteration", "agent 協助修改", C.indigo],
    ["Natural-language\nbuild", "用語言快速原型", C.teal],
  ];
  let prev = null;
  stages.forEach((s, i) => {
    const node = addNode(slide, `stage-${i}`, s[0], 150 + i * 330, 270, 240, 72, s[2], C.white, 20, EN_FONT);
    addText(slide, `stage-sub-${i}`, s[1], { left: 160 + i * 330, top: 370, width: 220, height: 32 }, {
      fontSize: 20,
      color: C.secondary,
      alignment: "center",
    });
    if (prev) connect(slide, prev, node, C.indigo);
    prev = node;
  });
  addText(slide, "fast-checks", "Fast iteration requires explicit checks.", {
    left: 334,
    top: 504,
    width: 610,
    height: 42,
  }, { fontSize: 30, bold: true, color: C.amber, alignment: "center", typeface: EN_FONT });
  addFooter(slide, 7);
  addSpeakerNotes(slide, "Vibe coding 不是不用寫程式，而是用 agent 加速從想法到可跑原型。它適合低風險、可驗證、範圍清楚的任務，例如轉檔、整理表格、畫初步圖、產生分析腳本草稿。");
}

function slide8(p) {
  const slide = p.slides.add();
  slide.background.fill = C.bg;
  addEyebrow(slide, "RISK MATRIX", C.coral);
  addTitle(slide, "Vibe coding 適合低模糊、低風險且可驗證的任務");
  const x = 228;
  const y = 208;
  const w = 780;
  const h = 360;
  addSurface(slide, "matrix", x, y, w, h, C.white, C.line);
  addLine(slide, "vline", x + w / 2, y, x + w / 2, y + h, C.line, 1);
  addLine(slide, "hline", x, y + h / 2, x + w, y + h / 2, C.line, 1);
  addText(slide, "axis-x", "Task ambiguity", { left: x + 260, top: y + h + 12, width: 260, height: 28 }, {
    fontSize: 18,
    color: C.secondary,
    alignment: "center",
    typeface: EN_FONT,
  });
  addText(slide, "axis-y", "Impact / risk", { left: x - 104, top: y + 148, width: 92, height: 34 }, {
    fontSize: 18,
    color: C.secondary,
    alignment: "center",
    typeface: EN_FONT,
  });
  addText(slide, "q1", "Parsing script\nReport draft", { left: x + 42, top: y + 230, width: 270, height: 62 }, { fontSize: 22, color: C.teal, bold: true, alignment: "center" });
  addText(slide, "q2", "Exploratory\nprototype", { left: x + 470, top: y + 230, width: 230, height: 62 }, { fontSize: 22, color: C.indigo, bold: true, alignment: "center" });
  addText(slide, "q3", "Validated\nanalysis tool", { left: x + 42, top: y + 54, width: 270, height: 62 }, { fontSize: 22, color: C.amber, bold: true, alignment: "center" });
  addText(slide, "q4", "Clinical claim\nUnverified statistic\nCitation-sensitive summary", { left: x + 440, top: y + 38, width: 300, height: 104 }, { fontSize: 20, color: C.coral, bold: true, alignment: "center" });
  addText(slide, "matrix-note", "能跑不是標準；可追溯、可測試、可解釋才是標準。", {
    left: 234,
    top: 620,
    width: 782,
    height: 34,
  }, { fontSize: 24, bold: true, color: C.ink, alignment: "center" });
  addFooter(slide, 8);
  addSpeakerNotes(slide, "Vibe coding 最大問題不是 syntax error，而是 silent wrongness。程式可能能跑，但欄位對錯、樣本過濾、normalization、統計檢定、citation 對應都可能有問題。");
}

function slide9(p) {
  const slide = p.slides.add();
  slide.background.fill = C.bg;
  addEyebrow(slide, "DESKTOP UTILITIES", C.teal);
  addTitle(slide, "Desktop utilities 把日常研究任務接進 agent workflow");
  const lanes = [
    ["Researcher", "define goal\nreview output", C.amber],
    ["Desktop agent", "plan actions\ncoordinate tools", C.indigo],
    ["Local files / tools", "PDF, CSV\nterminal, scripts", C.secondary],
    ["External sources", "browser\nbiomedical DB", C.teal],
  ];
  lanes.forEach((l, i) => {
    const y = 196 + i * 88;
    addText(slide, `lane-label-${i}`, l[0], { left: 104, top: y + 18, width: 190, height: 28 }, {
      fontSize: 20,
      bold: true,
      color: l[2],
      typeface: EN_FONT,
    });
    addLine(slide, `lane-line-${i}`, 298, y + 44, 1114, y + 44, C.line, 1);
    if (i < 2) addNode(slide, `lane-a-${i}`, l[1], 438 + i * 150, y + 12, 160, 64, l[2], i === 0 ? C.amberLight : C.white, 16, EN_FONT);
  });
  const d1 = addNode(slide, "pdf", "Read PDF", 388, 374, 126, 48, C.secondary, C.white, 16, EN_FONT);
  const d2 = addNode(slide, "csv", "Clean CSV", 566, 374, 126, 48, C.secondary, C.white, 16, EN_FONT);
  const d3 = addNode(slide, "script", "Run script", 744, 374, 126, 48, C.secondary, C.white, 16, EN_FONT);
  const db = addNode(slide, "browser-db", "Browser\nbiomedical DB", 738, 462, 156, 58, C.teal, C.tealLight, 16, EN_FONT);
  const d4 = addNode(slide, "browser", "Check source", 946, 462, 140, 48, C.teal, C.tealLight, 16, EN_FONT);
  connect(slide, d1, d2, C.secondary);
  connect(slide, d2, d3, C.secondary);
  connect(slide, d3, db, C.teal, true, "elbow");
  connect(slide, db, d4, C.teal);
  addText(slide, "utility-note", "不是神奇工具；它的價值是減少手動搬運與遺漏。", {
    left: 246,
    top: 596,
    width: 780,
    height: 34,
  }, { fontSize: 24, bold: true, color: C.secondary, alignment: "center" });
  addFooter(slide, 9);
  addSpeakerNotes(slide, "Desktop utilities 不是產品展示。重點是它們讓 agent 能接觸研究者每天真的在做的事情：PDF、Excel/CSV、資料夾、圖表、script、reference manager。");
}

function slide10(p) {
  const slide = p.slides.add();
  slide.background.fill = C.bg;
  addEyebrow(slide, "MINI EXERCISE", C.amber);
  addTitle(slide, "把一個研究任務改寫成 agent-ready workflow");
  addText(slide, "exercise-task", "任務：整理某主題的 biomarker evidence", {
    left: 138,
    top: 184,
    width: 780,
    height: 44,
  }, { fontSize: 29, bold: true, color: C.ink });
  const fields = [
    ["Goal", "要回答什麼？"],
    ["Inputs", "文獻、資料庫、檔案"],
    ["Tools", "搜尋、讀檔、查詢、腳本"],
    ["Failure modes", "可能錯在哪裡？"],
    ["Verification", "怎麼檢查？"],
  ];
  fields.forEach((f, i) => {
    const x = 104 + i * 218;
    addSurface(slide, `worksheet-${i}`, x, 292, 184, 172, C.white, i === 4 ? C.amber : C.line);
    addText(slide, `worksheet-head-${i}`, f[0], { left: x + 16, top: 314, width: 152, height: 26 }, {
      fontSize: 19,
      bold: true,
      color: i === 4 ? C.amber : C.indigo,
      alignment: "center",
      typeface: EN_FONT,
    });
    addText(slide, `worksheet-sub-${i}`, f[1], { left: x + 14, top: 362, width: 156, height: 62 }, {
      fontSize: 18,
      color: C.secondary,
      alignment: "center",
    });
  });
  addText(slide, "timebox", "5-8 分鐘，小組討論；標出哪些地方必須 human-in-the-loop。", {
    left: 194,
    top: 548,
    width: 850,
    height: 36,
  }, { fontSize: 24, bold: true, color: C.coral, alignment: "center" });
  addFooter(slide, 10);
  addSpeakerNotes(slide, "互動活動。可給學生範例：整理 EGFR mutation 與肺癌標靶治療反應的 evidence table。請他們拆成目標、輸入資料、工具、每步輸出、檢查方式、哪些地方不能完全交給 agent。");
}

function slide11(p) {
  const slide = p.slides.add();
  slide.background.fill = C.ink;
  addText(slide, "transition-title", "Next: LLM basics", {
    left: 126,
    top: 122,
    width: 560,
    height: 66,
  }, { fontSize: 48, bold: true, color: C.white, typeface: EN_FONT });
  addText(slide, "transition-subtitle", "了解 model，才能設計好的 agent workflow", {
    left: 130,
    top: 210,
    width: 720,
    height: 40,
  }, { fontSize: 26, color: "#DDE4E8" });
  const model = addNode(slide, "model-highlight", "Model", 744, 262, 170, 70, C.indigo, C.indigoLight, 26, EN_FONT);
  const context = addNode(slide, "context-dim", "Context", 574, 384, 130, 48, "#8C98A1", "#26313A", 16, EN_FONT);
  const tools = addNode(slide, "tools-dim", "Tools", 950, 384, 120, 48, "#8C98A1", "#26313A", 16, EN_FONT);
  const verify = addNode(slide, "verify-dim", "Verify", 760, 500, 132, 48, "#8C98A1", "#26313A", 16, EN_FONT);
  slide.shapes.connect(model, context, { kind: "straight", line: { style: "solid", fill: "#52616D", width: 1.2 } });
  slide.shapes.connect(model, tools, { kind: "straight", line: { style: "solid", fill: "#52616D", width: 1.2 } });
  slide.shapes.connect(model, verify, { kind: "straight", line: { style: "solid", fill: "#52616D", width: 1.2 } });
  addBulletList(slide, "next-bullets", [
    "tokens 與 context window",
    "reasoning 與 hallucination",
    "為什麼 agent 會有效，也會錯",
  ], { left: 132, top: 346, width: 460, height: 142 }, { fontSize: 24, color: "#DDE4E8", spaceAfter: 12 });
  addDarkFooter(slide, 11);
  addSpeakerNotes(slide, "自然收束到下一堂課。這堂建立 agent 的外層系統觀；下一堂打開 model 本身，理解 LLM 為什麼有效、為什麼會錯、context 如何影響輸出、hallucination 為何發生。");
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
