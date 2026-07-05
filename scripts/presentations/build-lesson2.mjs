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
const TOTAL = 23;

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
  return addText(slide, "eyebrow", text, { left: frame.left, top: frame.top, width: 700, height: 30 }, {
    fontSize: 15,
    bold: true,
    color,
    typeface: EN_FONT,
  });
}

function addTitle(slide, text, y = 96, size = 36, width = 1050) {
  return addText(slide, "title", text, { left: frame.left, top: y, width, height: 92 }, {
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
    width: 560,
    height: 22,
  }, { fontSize: 12, color: C.secondary, typeface: EN_FONT });
}

function addDarkFooter(slide, n) {
  addText(slide, "footer-dark", `AI agents, vibe coding, desktop utilities  |  ${n}/${TOTAL}`, {
    left: frame.left,
    top: 668,
    width: 560,
    height: 22,
  }, { fontSize: 12, color: "#B7C0C7", typeface: EN_FONT });
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
  const node = slide.shapes.add({
    geometry: "roundRect",
    name,
    position: { left: x, top: y, width: w, height: h },
    fill,
    line: { style: "solid", fill: color, width: 1.35 },
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

function addLine(slide, name, x1, y1, x2, y2, color, width = 1.4, dashed = false) {
  const left = Math.min(x1, x2);
  const top = Math.min(y1, y2);
  return slide.shapes.add({
    geometry: "line",
    name,
    position: { left, top, width: Math.abs(x2 - x1), height: Math.abs(y2 - y1) },
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
    bulletCharacter: "•",
    marginLeft: options.marginLeft ?? 22,
    indent: options.indent ?? -10,
    spaceAfter: options.spaceAfter ?? 7,
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

function addSpeakerNotes(slide, notes) {
  slide.speakerNotes.textFrame.setText(notes);
  slide.speakerNotes.setVisible(true);
}

function addHeader(slide, eyebrow, title, n, color = C.indigo) {
  addEyebrow(slide, eyebrow, color);
  addTitle(slide, title);
  addFooter(slide, n);
}

function slide1(p) {
  const slide = p.slides.add();
  slide.background.fill = C.bg;
  addEyebrow(slide, "LESSON 02", C.indigo);
  addText(slide, "lesson-title", "AI agent 是可檢查的研究工作流", {
    left: frame.left,
    top: 120,
    width: 680,
    height: 116,
  }, { fontSize: 42, bold: true, color: C.ink, lineSpacing: 0.95 });
  addText(slide, "subtitle", "從聊天，進到能讀檔、查資料、跑工具、留下證據的流程", {
    left: frame.left,
    top: 264,
    width: 680,
    height: 68,
  }, { fontSize: 25, color: C.indigo, bold: true });
  addBulletList(slide, "questions", [
    "什麼任務適合交給 agent？",
    "vibe coding 要怎麼用才不失控？",
    "desktop utilities 如何接進 biomedical workflow？",
  ], { left: frame.left, top: 392, width: 650, height: 150 }, { fontSize: 23, spaceAfter: 12 });

  addLine(slide, "flow-line-1", 740, 250, 1055, 250, C.line, 1.4);
  addLine(slide, "flow-line-2", 1055, 250, 1055, 436, C.line, 1.4);
  addLine(slide, "flow-line-3", 740, 436, 1055, 436, C.line, 1.4);
  addNode(slide, "ask", "Ask", 700, 222, 94, 56, C.secondary, C.white, 18, EN_FONT);
  addNode(slide, "plan", "Plan", 856, 222, 94, 56, C.indigo, C.indigoLight, 18, EN_FONT);
  addNode(slide, "tools", "Tools", 1012, 222, 104, 56, C.teal, C.tealLight, 18, EN_FONT);
  addNode(slide, "verify", "Verify", 980, 408, 136, 56, C.amber, C.amberLight, 18, EN_FONT);
  addNode(slide, "deliver", "Deliver", 700, 408, 136, 56, C.teal, C.white, 18, EN_FONT);
  addText(slide, "right-note", "goal + tools + state + checks", {
    left: 718,
    top: 534,
    width: 380,
    height: 36,
  }, { fontSize: 23, bold: true, color: C.secondary, alignment: "center", typeface: EN_FONT });
  addFooter(slide, 1);
  addSpeakerNotes(slide, "新版 Lesson 02 的重心是判斷與拆解。學生要知道 agent 不是比較會聊天的模型，而是能和工具、檔案、資料來源、驗證規則一起工作的研究流程。");
}

function slide2CourseFrame(p) {
  const slide = p.slides.add();
  slide.background.fill = C.bg;
  addHeader(slide, "WHY THIS LESSON", "這門課要訓練的是 workflow 判斷，不是工具背誦", 2, C.teal);
  addText(slide, "lead", "AI 工具真正有用的地方，是把研究任務拆成可執行、可檢查、可交接的步驟。", {
    left: 108,
    top: 184,
    width: 940,
    height: 42,
  }, { fontSize: 26, bold: true, color: C.ink });
  const columns = [
    ["不是", ["工具清單", "prompt 技巧", "看起來完整的答案"], C.coral, C.coralLight],
    ["而是", ["任務規格", "證據與檢查", "能重跑的流程"], C.teal, C.tealLight],
  ];
  columns.forEach((col, i) => {
    const x = 150 + i * 560;
    addSurface(slide, `surface-${i}`, x, 282, 420, 250, col[3], col[2]);
    addText(slide, `head-${i}`, col[0], { left: x + 34, top: 318, width: 160, height: 34 }, {
      fontSize: 30,
      bold: true,
      color: col[2],
    });
    addBulletList(slide, `list-${i}`, col[1], { left: x + 82, top: 386, width: 270, height: 100 }, {
      fontSize: 23,
      color: C.ink,
      spaceAfter: 10,
    });
  });
  addText(slide, "bottom", "今天會把 agent 放回 biomedical research 的資料、工具、證據與風險裡。", {
    left: 190,
    top: 586,
    width: 900,
    height: 34,
  }, { fontSize: 23, bold: true, color: C.secondary, alignment: "center" });
  addSpeakerNotes(slide, "這張吸收原 Lesson 01 的技術定位，但避開行政課程介紹。負責老師開場後，這張把學生拉到本課的核心：工具只是入口，workflow 才是學習目標。");
}

function slide3Deliverables(p) {
  const slide = p.slides.add();
  slide.background.fill = C.bg;
  addHeader(slide, "COURSE OUTCOME", "最後要留下的是可審核的 biomedical agent workflow", 3, C.amber);
  const stack = [
    ["task_spec.md", "任務、輸入、輸出、限制", C.indigo, C.indigoLight],
    ["evidence_table", "claim、source、status", C.teal, C.tealLight],
    ["tool_log", "工具輸入、輸出、錯誤", C.secondary, C.white],
    ["check_report", "通過、失敗、needs review", C.amber, C.amberLight],
    ["demo_notes", "限制、風險、下一步", C.coral, C.coralLight],
  ];
  stack.forEach((s, i) => {
    const y = 180 + i * 74;
    addSurface(slide, `stack-${i}`, 168, y, 380, 54, s[3], s[2]);
    addText(slide, `stack-name-${i}`, s[0], { left: 194, top: y + 14, width: 180, height: 24 }, {
      fontSize: 20,
      bold: true,
      color: s[2],
      typeface: EN_FONT,
    });
    addText(slide, `stack-copy-${i}`, s[1], { left: 620, top: y + 13, width: 420, height: 28 }, {
      fontSize: 21,
      color: C.secondary,
    });
    addLine(slide, `stack-line-${i}`, 558, y + 27, 602, y + 27, C.line, 1.2);
  });
  addSurface(slide, "goal-box", 238, 580, 804, 54, C.white, C.line);
  addText(slide, "goal-text", "Lesson 02 先建立外框；後面課程會逐步補上 model、tools、spec、harness 與 loop。", {
    left: 276,
    top: 598,
    width: 730,
    height: 28,
  }, { fontSize: 20, bold: true, color: C.ink, alignment: "center" });
  addSpeakerNotes(slide, "這張承接原 Lesson 01 的最終產出。讓學生一開始知道，這堂課不是孤立概念，而是在建立後續 spec、harness、loop、hackathon 的共同語言。");
}

function slideToolComparison(p) {
  const slide = p.slides.add();
  slide.background.fill = C.bg;
  addHeader(slide, "TOOL LANDSCAPE", "先用任務型態選工具，不要只記工具名稱", 4, C.indigo);
  addText(slide, "lead", "Claude、Gemini、Perplexity 偏研究整理入口；Codex、Copilot、Antigravity 偏開發與 agentic workflow 入口。", {
    left: 96,
    top: 176,
    width: 1040,
    height: 36,
  }, { fontSize: 21, bold: true, color: C.secondary });

  const cards = [
    ["Claude", "長文推理與文件整理", ["讀長篇背景", "整理研究筆記"], "仍要回查來源", C.indigo, C.indigoLight],
    ["Gemini", "長 context 與 multimodal", ["跨 PDF / 圖表 / 表格", "Google 生態整合"], "抽樣核對脈絡", C.teal, C.tealLight],
    ["Perplexity", "web-grounded 搜尋追蹤", ["找文獻線索", "追 citation / source"], "摘要不是證據", C.coral, C.coralLight],
    ["Codex", "repo-grounded 修改測試", ["讀實際程式碼", "跑測試與看 diff"], "不能跳過 review", C.teal, C.white],
    ["Copilot", "IDE 內即時輔助", ["補完程式片段", "局部重構 / API"], "容易局部正確", C.amber, C.amberLight],
    ["Antigravity", "agentic IDE 與 artifacts", ["平行 agent 工作", "browser / terminal"], "高權限要設 gate", C.indigo, C.white],
  ];
  cards.forEach(([name, role, uses, caution, color, fill], i) => {
    const x = 86 + (i % 3) * 380;
    const y = 244 + Math.floor(i / 3) * 158;
    addSurface(slide, `tool-card-${i}`, x, y, 328, 126, fill, color);
    addText(slide, `tool-name-${i}`, name, { left: x + 20, top: y + 18, width: 144, height: 28 }, {
      fontSize: 21,
      bold: true,
      color,
      typeface: EN_FONT,
    });
    addText(slide, `tool-role-${i}`, role, { left: x + 168, top: y + 19, width: 136, height: 34 }, {
      fontSize: 16,
      bold: true,
      color: C.ink,
      lineSpacing: 1.02,
    });
    addBulletList(slide, `tool-uses-${i}`, uses, { left: x + 26, top: y + 62, width: 182, height: 48 }, {
      fontSize: 16,
      color: C.secondary,
      marginLeft: 18,
      indent: -8,
      spaceAfter: 2,
      lineSpacing: 1.02,
    });
    addText(slide, `tool-caution-${i}`, caution, { left: x + 212, top: y + 82, width: 94, height: 22 }, {
      fontSize: 15,
      bold: true,
      color,
      alignment: "center",
    });
  });
  addText(slide, "bottom", "同一個 biomedical task 常需要串兩種以上工具；比較的重點是輸入、輸出、證據和風險。", {
    left: 150,
    top: 592,
    width: 980,
    height: 34,
  }, { fontSize: 22, bold: true, color: C.ink, alignment: "center" });
  addSpeakerNotes(slide, "補回課綱原本要談的工具使用場景比較，並加入 Gemini 與 Antigravity。不要把工具講成排名，而是讓學生能依任務選入口：搜尋、長文整理、長 context multimodal、repo 修改、IDE 即時輔助或 agentic IDE。");
}

function slideToolToWorkflow(p) {
  const slide = p.slides.add();
  slide.background.fill = C.bg;
  addHeader(slide, "SCENARIO FIT", "不同工具要接到不同的 workflow 檢查點", 5, C.teal);
  addText(slide, "lead", "選工具時先問：它會產生什麼 artifact？那個 artifact 要怎麼被檢查？", {
    left: 110,
    top: 176,
    width: 980,
    height: 36,
  }, { fontSize: 24, bold: true, color: C.ink, alignment: "center" });

  const rows = [
    ["Perplexity 類", "搜尋策略、候選文獻、來源連結", "查 PMID / DOI / database record"],
    ["Gemini 類", "多模態整理、文件對照、Workspace 草稿", "抽樣核對來源、版本與上下文"],
    ["Claude 類", "摘要、比較表、研究筆記初稿", "逐段對來源與欄位定義"],
    ["Codex 類", "腳本修改、資料處理程式、測試結果", "看 diff、跑 test、檢查輸出檔"],
    ["Copilot 類", "局部程式碼片段、函式補完", "用 lint、unit test、review 限縮風險"],
    ["Antigravity 類", "plan、code change、browser / terminal artifact", "權限 gate、sandbox、test log"],
  ];
  const colX = [110, 330, 650];
  const colW = [180, 270, 480];
  ["工具入口", "適合交付", "必要檢查"].forEach((label, i) => {
    addText(slide, `head-${i}`, label, { left: colX[i], top: 254, width: colW[i], height: 28 }, {
      fontSize: 18,
      bold: true,
      color: [C.indigo, C.teal, C.amber][i],
      alignment: i === 0 ? "center" : "left",
    });
  });
  rows.forEach(([tool, artifact, check], i) => {
    const y = 294 + i * 52;
    addSurface(slide, `row-bg-${i}`, 92, y - 8, 1096, 44, i % 2 === 0 ? C.white : C.grayBg, C.line);
    addText(slide, `tool-${i}`, tool, { left: colX[0], top: y + 2, width: colW[0], height: 22 }, {
      fontSize: 16,
      bold: true,
      color: [C.coral, C.teal, C.indigo, C.teal, C.amber, C.indigo][i],
      alignment: "center",
      typeface: EN_FONT,
    });
    addText(slide, `artifact-${i}`, artifact, { left: colX[1], top: y, width: colW[1], height: 24 }, {
      fontSize: 16,
      color: C.ink,
    });
    addText(slide, `check-${i}`, check, { left: colX[2], top: y, width: colW[2], height: 24 }, {
      fontSize: 16,
      color: C.secondary,
    });
  });
  addText(slide, "bottom", "工具選擇不是品牌偏好，而是 workflow 設計的一部分。", {
    left: 230,
    top: 612,
    width: 820,
    height: 32,
  }, { fontSize: 23, bold: true, color: C.teal, alignment: "center" });
  addSpeakerNotes(slide, "把工具比較接回 agent workflow。每種工具都要對應到 artifact 與檢查點，否則學生只會知道工具名稱，不會知道如何安全使用。");
}

function slide2(p) {
  const slide = p.slides.add();
  slide.background.fill = C.bg;
  addHeader(slide, "RUNNING EXAMPLE", "用同一個 biomedical 任務貫穿整堂課", 6, C.teal);
  addText(slide, "scenario", "任務：整理 EGFR、ALK、TP53 與肺癌治療或研究關聯的 evidence table", {
    left: 104,
    top: 190,
    width: 980,
    height: 46,
  }, { fontSize: 28, bold: true, color: C.ink });
  const rows = [
    ["Entities", "gene / disease / drug / variant"],
    ["Evidence", "claim / PMID / DOI / source span"],
    ["Checks", "gene symbol / citation / guideline / review"],
    ["Output", "table + research note + limitations"],
  ];
  rows.forEach((row, i) => {
    const y = 282 + i * 72;
    addNode(slide, `row-head-${i}`, row[0], 150, y, 170, 48, i < 2 ? C.indigo : C.teal, C.white, 18, EN_FONT);
    addText(slide, `row-copy-${i}`, row[1], { left: 370, top: y + 11, width: 620, height: 28 }, {
      fontSize: 22,
      color: C.secondary,
      typeface: EN_FONT,
    });
    addLine(slide, `row-line-${i}`, 330, y + 24, 350, y + 24, C.line, 1.2);
  });
  addText(slide, "note", "這堂課不追求一次產出完整答案，而是學會把任務拆成可檢查步驟。", {
    left: 190,
    top: 602,
    width: 900,
    height: 34,
  }, { fontSize: 23, bold: true, color: C.coral, alignment: "center" });
  addSpeakerNotes(slide, "用 EGFR、ALK、TP53 的 evidence table 做貫穿案例。這個任務有文獻、資料庫、表格、citation 和 review，足以展示 agent workflow，但範圍仍可控制。");
}

function slide3(p) {
  const slide = p.slides.add();
  slide.background.fill = C.bg;
  addHeader(slide, "AGENT MATURITY", "Agent 不是單一型態，而是自動化程度的光譜", 7, C.indigo);
  const levels = [
    ["Chatbot", "回答問題", C.secondary],
    ["Assistant", "摘要與整理", C.teal],
    ["Tool user", "查資料、讀檔、跑工具", C.indigo],
    ["Workflow agent", "多步驟執行與檢查", C.amber],
    ["Autonomous", "長時間自行操作", C.coral],
  ];
  addLine(slide, "ladder-line", 138, 348, 1130, 348, C.line, 2);
  levels.forEach((level, i) => {
    const x = 92 + i * 228;
    addNode(slide, `level-${i}`, level[0], x, 268, 176, 58, level[2], i === 4 ? C.coralLight : C.white, 18, EN_FONT);
    addText(slide, `level-copy-${i}`, level[1], { left: x + 2, top: 386, width: 172, height: 60 }, {
      fontSize: 19,
      color: C.secondary,
      alignment: "center",
    });
  });
  addText(slide, "takeaway", "本課程的重點在 tool-using 與 workflow agent，不鼓勵無監督 autonomous use。", {
    left: 154,
    top: 552,
    width: 920,
    height: 42,
  }, { fontSize: 24, bold: true, color: C.ink, alignment: "center" });
  addSpeakerNotes(slide, "學生常把 agent 想成一個產品名稱。這張把它拆成成熟度光譜，讓學生知道我們要學的是可檢查的 tool-using 與 workflow agent。");
}

function slide4(p) {
  const slide = p.slides.add();
  slide.background.fill = C.bg;
  addHeader(slide, "CHATBOT VS AGENT", "Chatbot 產生回答；agent 交付可檢查 artifact", 8, C.indigo);
  addSurface(slide, "left", 92, 204, 480, 312, C.white, C.line);
  addSurface(slide, "right", 708, 204, 480, 312, C.white, C.line);
  addText(slide, "left-title", "Chatbot answer", { left: 128, top: 232, width: 260, height: 36 }, {
    fontSize: 25,
    bold: true,
    color: C.secondary,
    typeface: EN_FONT,
  });
  addText(slide, "right-title", "Agent workflow", { left: 744, top: 232, width: 280, height: 36 }, {
    fontSize: 25,
    bold: true,
    color: C.indigo,
    typeface: EN_FONT,
  });
  addNode(slide, "prompt", "Prompt", 144, 334, 132, 54, C.secondary, C.white, 18, EN_FONT);
  addNode(slide, "response", "Response", 384, 334, 142, 54, C.secondary, C.white, 18, EN_FONT);
  addLine(slide, "chat-line", 276, 361, 384, 361, C.secondary, 1.6);
  addText(slide, "left-copy", "看起來完整，但來源、欄位與限制常不清楚。", { left: 140, top: 442, width: 350, height: 34 }, {
    fontSize: 21,
    color: C.secondary,
  });
  const nodes = [
    ["Goal", 746, 318, C.indigo],
    ["Tools", 884, 318, C.teal],
    ["Evidence", 1022, 318, C.teal],
    ["Verify", 1022, 420, C.amber],
    ["Artifact", 884, 420, C.indigo],
  ];
  addLine(slide, "a1", 830, 342, 884, 342, C.indigo, 1.5);
  addLine(slide, "a2", 968, 342, 1022, 342, C.teal, 1.5);
  addLine(slide, "a3", 1070, 372, 1070, 420, C.amber, 1.5);
  addLine(slide, "a4", 970, 444, 1022, 444, C.amber, 1.5);
  nodes.forEach(([label, x, y, color]) => addNode(slide, `agent-${label}`, label, x, y, 108, 54, color, color === C.amber ? C.amberLight : C.white, 16, EN_FONT));
  addText(slide, "right-copy", "重點不是更像人，而是能留下可審核輸出。", { left: 744, top: 532, width: 400, height: 34 }, {
    fontSize: 21,
    color: C.secondary,
  });
  addSpeakerNotes(slide, "把原本 chatbot vs agent 的概念再拉到 artifact。研究工作不是要得到一段話，而是要得到可檢查、可重跑、可交接的產物。");
}

function slide5(p) {
  const slide = p.slides.add();
  slide.background.fill = C.bg;
  addHeader(slide, "AGENT COMPONENTS", "可靠 agent 由元件與邊界組成，不只是一個模型", 9, C.teal);
  slide.shapes.add({
    geometry: "roundRect",
    name: "workflow-boundary",
    position: { left: 124, top: 202, width: 1032, height: 426 },
    fill: "none",
    line: { style: "dashed", fill: C.line, width: 1.2 },
    borderRadius: 8,
  });
  addText(slide, "boundary-label", "workflow boundary", {
    left: 154,
    top: 212,
    width: 180,
    height: 24,
  }, { fontSize: 15, bold: true, color: C.muted, typeface: EN_FONT });

  addLine(slide, "goal-to-model", 640, 280, 640, 318, C.line, 1.5);
  addLine(slide, "context-to-model", 420, 356, 536, 356, C.line, 1.5);
  addLine(slide, "model-to-tools", 744, 356, 860, 356, C.line, 1.5);
  addLine(slide, "model-to-state", 640, 394, 640, 442, C.line, 1.5);
  addLine(slide, "state-to-verify", 640, 504, 640, 542, C.line, 1.5);

  addNode(slide, "node-Goal", "Goal\n成功條件", 536, 218, 208, 62, C.teal, C.tealLight, 16, EN_FONT);
  addNode(slide, "node-Context", "Context\n任務、資料、限制", 188, 324, 232, 64, C.secondary, C.white, 16, EN_FONT);
  addNode(slide, "model", "Model\n推理與生成", 536, 318, 208, 76, C.indigo, C.indigoLight, 22);
  addNode(slide, "node-Tools", "Tools\n搜尋、讀檔、查 DB", 860, 324, 232, 64, C.teal, C.white, 16, EN_FONT);
  addNode(slide, "node-State", "State\n進度與中間結果", 536, 442, 208, 62, C.secondary, C.white, 16, EN_FONT);
  addNode(slide, "node-Verification", "Verification\n檢查與停止條件", 536, 542, 208, 62, C.amber, C.amberLight, 16, EN_FONT);
  addSpeakerNotes(slide, "這張保留原本元件圖，但更強調元件與邊界。模型只是其中一個節點，workflow 品質還取決於 context、tools、state 與 verification。");
}

function slide6(p) {
  const slide = p.slides.add();
  slide.background.fill = C.bg;
  addHeader(slide, "AGENT LOOP", "Agent 的核心是一個會觀察、修正與停止的循環", 10, C.indigo);
  addLine(slide, "goal-plan-a", 276, 322, 320, 322, C.indigo, 1.5);
  addLine(slide, "goal-plan-b", 320, 230, 320, 322, C.indigo, 1.5);
  addLine(slide, "goal-plan-c", 320, 230, 344, 230, C.indigo, 1.5);
  addLine(slide, "plan-act", 460, 230, 586, 230, C.indigo, 1.5);
  addLine(slide, "act-observe-a", 724, 230, 780, 230, C.teal, 1.5);
  addLine(slide, "act-observe-b", 780, 230, 780, 322, C.teal, 1.5);
  addLine(slide, "act-observe-c", 780, 322, 824, 322, C.teal, 1.5);
  addLine(slide, "observe-verify-a", 888, 350, 888, 420, C.amber, 1.5);
  addLine(slide, "observe-verify-b", 653, 420, 888, 420, C.amber, 1.5);
  addLine(slide, "observe-verify-c", 653, 420, 653, 466, C.amber, 1.5);
  addLine(slide, "verify-state", 464, 498, 584, 498, C.amber, 1.5);
  addLine(slide, "state-goal-a", 120, 498, 340, 498, C.secondary, 1.5, true);
  addLine(slide, "state-goal-b", 120, 322, 120, 498, C.secondary, 1.5, true);
  addLine(slide, "state-goal-c", 120, 322, 160, 322, C.secondary, 1.5, true);
  const goal = addNode(slide, "goal", "Goal", 160, 294, 116, 56, C.teal, C.tealLight, 19, EN_FONT);
  const plan = addNode(slide, "plan", "Plan", 344, 202, 116, 56, C.indigo, C.white, 19, EN_FONT);
  const act = addNode(slide, "act", "Act\nwith tools", 586, 198, 138, 64, C.teal, C.white, 18, EN_FONT);
  const observe = addNode(slide, "observe", "Observe", 824, 294, 128, 56, C.secondary, C.white, 18, EN_FONT);
  const verify = addNode(slide, "verify", "Verify", 584, 466, 138, 64, C.amber, C.amberLight, 20, EN_FONT);
  const state = addNode(slide, "state", "Update\nstate", 340, 466, 124, 64, C.secondary, C.white, 18, EN_FONT);
  const human = addNode(slide, "human", "Human review\ngate", 912, 466, 168, 64, C.amber, C.amberLight, 17, EN_FONT);
  addLine(slide, "human-link", 722, 498, 912, 498, C.amber, 1.5, true);
  for (const node of [goal, plan, act, observe, verify, state, human]) node.bringToFront();
  addText(slide, "loop-note", "不是一次輸入、一次輸出；可靠性來自檢查點與停止條件。", {
    left: 160,
    top: 594,
    width: 820,
    height: 34,
  }, { fontSize: 23, bold: true, color: C.secondary, alignment: "center" });
  addSpeakerNotes(slide, "這張是本堂課的核心。Agent workflow 要能在工具輸出後觀察與驗證，必要時更新 state 或停止，而不是一直生成。");
}

function slide7(p) {
  const slide = p.slides.add();
  slide.background.fill = C.bg;
  addHeader(slide, "WORKFLOW ARTIFACTS", "每一步都應留下之後能檢查的東西", 11, C.amber);
  const rows = [
    ["Goal", "task_spec.md", "任務、輸入、輸出與限制"],
    ["Search", "query log", "關鍵字、日期、來源清單"],
    ["Extract", "evidence table", "claim、source、status"],
    ["Tool use", "tool log", "input、output、error"],
    ["Verify", "check report", "通過、失敗、needs review"],
  ];
  addSurface(slide, "table-bg", 96, 184, 1088, 386, C.white, C.line);
  ["Step", "Artifact", "Why it matters"].forEach((h, i) => {
    addText(slide, `h-${i}`, h, { left: [130, 380, 672][i], top: 216, width: [180, 220, 360][i], height: 28 }, {
      fontSize: 18,
      bold: true,
      color: i === 2 ? C.teal : C.indigo,
      typeface: EN_FONT,
    });
  });
  rows.forEach((r, i) => {
    const y = 262 + i * 58;
    addText(slide, `step-${i}`, r[0], { left: 130, top: y, width: 170, height: 26 }, { fontSize: 19, bold: true, color: C.indigo, typeface: EN_FONT });
    addText(slide, `artifact-${i}`, r[1], { left: 380, top: y, width: 220, height: 26 }, { fontSize: 19, color: C.amber, typeface: EN_FONT });
    addText(slide, `why-${i}`, r[2], { left: 672, top: y, width: 400, height: 26 }, { fontSize: 19, color: C.secondary });
    addLine(slide, `row-${i}`, 118, y + 38, 1146, y + 38, C.line, 1);
  });
  addText(slide, "bottom", "沒有 artifact，就很難 debug、重跑或交接。", {
    left: 250,
    top: 602,
    width: 780,
    height: 34,
  }, { fontSize: 24, bold: true, color: C.coral, alignment: "center" });
  addSpeakerNotes(slide, "這張是新版的重要補強。學生要理解 agent workflow 的可追溯性來自 artifact，而不是來自模型宣稱自己做了什麼。");
}

function slideBaoyuDesignTechnique(p) {
  const slide = p.slides.add();
  slide.background.fill = C.bg;
  addHeader(slide, "SUPPLEMENT: BAOYU PRACTICE", "把投影片當成可預覽、可修補、可驗證的 artifact", 12, C.indigo);
  addText(slide, "source", "Source case: X @dotey / baoyu-design skill，示範以 agent 補足 PPTX 動畫輸出的格式限制。", {
    left: 94,
    top: 164,
    width: 1040,
    height: 30,
  }, { fontSize: 18, color: C.secondary });

  const steps = [
    ["1", "HTML prototype", "先用瀏覽器確認\n版面、動畫節奏與互動"],
    ["2", "Export PPTX", "轉成 PowerPoint\n保留可編輯交付格式"],
    ["3", "Patch Open XML", "當函式庫不支援動畫\n讓 coding agent 修補 XML"],
    ["4", "Playback QA", "在 Keynote / PowerPoint\n逐頁播放、截圖、比對"],
  ];
  steps.forEach((step, i) => {
    const x = 94 + i * 280;
    const lineColor = i === 2 ? C.amber : i === 3 ? C.teal : C.indigo;
    addSurface(slide, `artifact-step-${i}`, x, 220, 234, 164, C.white, lineColor);
    addNode(slide, `artifact-num-${i}`, step[0], x + 18, 240, 44, 44, lineColor, i === 2 ? C.amberLight : C.indigoLight, 18, EN_FONT);
    addText(slide, `artifact-title-${i}`, step[1], { left: x + 76, top: 246, width: 134, height: 26 }, {
      fontSize: 18,
      bold: true,
      color: lineColor,
      typeface: EN_FONT,
    });
    addText(slide, `artifact-copy-${i}`, step[2], { left: x + 24, top: 306, width: 186, height: 58 }, {
      fontSize: 18,
      color: C.ink,
      alignment: "center",
      lineSpacing: 1.08,
    });
    if (i < steps.length - 1) {
      addText(slide, `artifact-arrow-${i}`, ">", { left: x + 248, top: 286, width: 26, height: 34 }, {
        fontSize: 30,
        bold: true,
        color: C.muted,
        alignment: "center",
        typeface: EN_FONT,
      });
    }
  });

  addSurface(slide, "pattern-box", 112, 466, 498, 106, C.indigoLight, C.indigo);
  addText(slide, "pattern-title", "課堂要帶走的技巧", { left: 144, top: 490, width: 220, height: 26 }, {
    fontSize: 20,
    bold: true,
    color: C.indigo,
  });
  addBulletList(slide, "pattern-list", [
    "先產生可視化 artifact，再做格式輸出",
    "把工具限制轉成 agent 可檢查的修補任務",
  ], { left: 146, top: 526, width: 410, height: 42 }, { fontSize: 17, spaceAfter: 3 });

  addSurface(slide, "guardrail-box", 670, 466, 498, 106, C.amberLight, C.amber);
  addText(slide, "guardrail-title", "生醫教材中的邊界", { left: 702, top: 490, width: 220, height: 26 }, {
    fontSize: 20,
    bold: true,
    color: C.amber,
  });
  addBulletList(slide, "guardrail-list", [
    "動畫與排版是 presentation artifact，不是證據",
    "交付前必須人工播放檢查與保留來源紀錄",
  ], { left: 704, top: 526, width: 410, height: 42 }, { fontSize: 17, spaceAfter: 3 });

  addText(slide, "bottom", "重點不是炫技，而是讓 agent 產出的檔案能被人打開、修改、播放與追蹤。", {
    left: 178,
    top: 608,
    width: 924,
    height: 32,
  }, { fontSize: 22, bold: true, color: C.coral, alignment: "center" });
  addSpeakerNotes(slide, "補充宝玉分享的 baoyu-design 技巧：先用 HTML 方式建立可預覽的投影片與動畫，再匯出 PPTX。若匯出工具例如 PptxGenJS 缺少動畫支援，可讓熟悉 PPTX Open XML 的 coding agent 修改 XML，最後在 Keynote 或 PowerPoint 逐頁播放驗證。這堂課要把它講成 artifact-first workflow，而不是要求學生都做動畫。Source: https://x.com/dotey/status/2073286406558949828?s=20 ; baoyu-design: https://github.com/jimliu/baoyu-design");
}

function slide8(p) {
  const slide = p.slides.add();
  slide.background.fill = C.bg;
  addHeader(slide, "TASK SUITABILITY", "適合 agent 的任務通常能被清楚驗證", 13, C.teal);
  const good = ["輸入資料明確", "輸出格式固定", "可用外部來源檢查", "錯誤能早期發現", "不直接造成臨床行動"];
  const bad = ["目標模糊", "只有主觀判斷", "缺少可查來源", "錯了不容易發現", "涉及治療或診斷決策"];
  addSurface(slide, "good", 116, 216, 454, 322, C.tealLight, C.teal);
  addSurface(slide, "bad", 710, 216, 454, 322, C.coralLight, C.coral);
  addText(slide, "good-title", "Good fit", { left: 160, top: 252, width: 220, height: 34 }, { fontSize: 28, bold: true, color: C.teal, typeface: EN_FONT });
  addText(slide, "bad-title", "Bad fit", { left: 754, top: 252, width: 220, height: 34 }, { fontSize: 28, bold: true, color: C.coral, typeface: EN_FONT });
  addBulletList(slide, "good-list", good, { left: 166, top: 324, width: 330, height: 152 }, { fontSize: 21, spaceAfter: 7 });
  addBulletList(slide, "bad-list", bad, { left: 760, top: 324, width: 330, height: 152 }, { fontSize: 21, spaceAfter: 7 });
  addText(slide, "bottom", "先判斷任務能否驗證，再決定要不要讓 agent 參與。", {
    left: 226,
    top: 590,
    width: 830,
    height: 34,
  }, { fontSize: 24, bold: true, color: C.ink, alignment: "center" });
  addSpeakerNotes(slide, "這是學生最需要的判斷框架。不要從工具出發，而是先看任務是否有清楚輸入、固定輸出、外部來源與可發現的錯誤。");
}

function slide9(p) {
  const slide = p.slides.add();
  slide.background.fill = C.bg;
  addHeader(slide, "BIOMEDICAL RED LINES", "有些 biomedical 輸出只能協助整理，不能直接定案", 14, C.coral);
  const items = [
    ["Diagnosis", "診斷或治療建議"],
    ["Dosage", "藥物劑量"],
    ["Variant", "pathogenicity final call"],
    ["Clinical action", "臨床處置建議"],
  ];
  items.forEach((item, i) => {
    const x = 126 + (i % 2) * 520;
    const y = 220 + Math.floor(i / 2) * 142;
    addSurface(slide, `risk-${i}`, x, y, 408, 96, C.coralLight, C.coral);
    addText(slide, `risk-title-${i}`, item[0], { left: x + 28, top: y + 22, width: 180, height: 28 }, {
      fontSize: 23,
      bold: true,
      color: C.coral,
      typeface: EN_FONT,
    });
    addText(slide, `risk-copy-${i}`, item[1], { left: x + 220, top: y + 24, width: 150, height: 44 }, {
      fontSize: 20,
      color: C.ink,
      alignment: "center",
    });
  });
  addNode(slide, "gate", "Human review required", 448, 540, 384, 58, C.amber, C.amberLight, 24, EN_FONT);
  addSpeakerNotes(slide, "生醫安全要變成規則。這些輸出可以由 agent 協助整理背景資料，但不能讓 agent 做 final call。");
}

function slide10(p) {
  const slide = p.slides.add();
  slide.background.fill = C.bg;
  addHeader(slide, "VIBE CODING", "Vibe coding 是快速探索，不是把責任交給模型", 15, C.indigo);
  const stages = [
    ["Idea", "想法與資料"],
    ["Prototype", "快速草擬"],
    ["Run", "真的執行"],
    ["Inspect", "看 diff 與輸出"],
    ["Decide", "保留或重做"],
  ];
  addLine(slide, "stage-line", 184, 328, 1078, 328, C.line, 1.6);
  stages.forEach((s, i) => {
    const x = 112 + i * 228;
    addNode(slide, `stage-${i}`, s[0], x, 276, 154, 58, i < 2 ? C.indigo : i === 3 ? C.amber : C.teal, C.white, 20, EN_FONT);
    addText(slide, `stage-copy-${i}`, s[1], { left: x, top: 370, width: 154, height: 34 }, {
      fontSize: 19,
      color: C.secondary,
      alignment: "center",
    });
  });
  addText(slide, "bottom", "速度來自短迭代；安全來自明確檢查。", {
    left: 320,
    top: 548,
    width: 640,
    height: 40,
  }, { fontSize: 29, bold: true, color: C.amber, alignment: "center" });
  addSpeakerNotes(slide, "保留 vibe coding，但補上責任邊界。快速不是讓模型負責，而是讓人更快得到可檢查原型。");
}

function slide11(p) {
  const slide = p.slides.add();
  slide.background.fill = C.bg;
  addHeader(slide, "SAFE VIBE LOOP", "安全的 vibe coding 一次只推進一個小步驟", 16, C.amber);
  const steps = [
    ["1", "Specify\nsmall task"],
    ["2", "Read\nreal files"],
    ["3", "Plan\nbefore edit"],
    ["4", "Change\nsmall scope"],
    ["5", "Run\nchecks"],
    ["6", "Inspect\ndiff"],
  ];
  for (let i = 0; i < steps.length - 1; i++) {
    addLine(slide, `line-${i}`, 182 + i * 184, 332, 240 + i * 184, 332, C.line, 1.4);
  }
  steps.forEach((s, i) => {
    const x = 90 + i * 184;
    addNode(slide, `num-${i}`, s[0], x, 292, 42, 42, C.amber, C.amberLight, 18, EN_FONT);
    addNode(slide, `step-${i}`, s[1], x + 54, 272, 118, 82, i < 3 ? C.indigo : C.teal, C.white, 16, EN_FONT);
  });
  addSurface(slide, "rule", 228, 492, 824, 76, C.white, C.line);
  addText(slide, "rule-text", "Rule: no broad rewrite, no hidden file changes, no unverified final claim.", {
    left: 260,
    top: 518,
    width: 760,
    height: 28,
  }, { fontSize: 22, bold: true, color: C.coral, alignment: "center", typeface: EN_FONT });
  addSpeakerNotes(slide, "這張是操作型 slide。學生可以照這個 loop 使用 coding agent 或 desktop agent：先讀真實檔案、先規劃、小範圍改、跑檢查、看 diff。");
}

function slide12(p) {
  const slide = p.slides.add();
  slide.background.fill = C.bg;
  addHeader(slide, "RISK MATRIX", "Vibe coding 適合低模糊、低風險且可驗證的任務", 17, C.coral);
  const x = 228;
  const y = 208;
  const w = 780;
  const h = 360;
  addSurface(slide, "matrix", x, y, w, h, C.white, C.line);
  addLine(slide, "vline", x + w / 2, y, x + w / 2, y + h, C.line, 1);
  addLine(slide, "hline", x, y + h / 2, x + w, y + h / 2, C.line, 1);
  addText(slide, "axis-x", "Task ambiguity", { left: x + 260, top: y + h + 12, width: 260, height: 28 }, { fontSize: 18, color: C.secondary, alignment: "center", typeface: EN_FONT });
  addText(slide, "axis-y", "Impact / risk", { left: x - 104, top: y + 148, width: 92, height: 34 }, { fontSize: 18, color: C.secondary, alignment: "center", typeface: EN_FONT });
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
  addSpeakerNotes(slide, "保留原本風險矩陣。這張讓學生把 vibe coding 放在任務風險和模糊度之中，而不是把它當成萬用工作法。");
}

function slide13(p) {
  const slide = p.slides.add();
  slide.background.fill = C.bg;
  addHeader(slide, "DESKTOP UTILITIES", "Desktop utilities 把研究者的日常材料接進 workflow", 18, C.teal);
  const rows = [
    ["Browser", "PubMed / guideline / database"],
    ["Files", "PDF / CSV / Excel / notes"],
    ["Terminal", "轉檔、檢查欄位、跑 script"],
    ["Spreadsheet", "evidence table 與人工 review"],
    ["Notes", "research log 與 limitations"],
  ];
  rows.forEach((r, i) => {
    const y = 206 + i * 68;
    addNode(slide, `tool-${i}`, r[0], 150, y, 178, 48, i < 2 ? C.teal : C.indigo, i === 3 ? C.amberLight : C.white, 18, EN_FONT);
    addText(slide, `use-${i}`, r[1], { left: 396, top: y + 10, width: 580, height: 28 }, {
      fontSize: 21,
      color: C.secondary,
    });
    addLine(slide, `link-${i}`, 338, y + 24, 376, y + 24, C.line, 1.2);
  });
  addText(slide, "bottom", "價值不是神奇自動化，而是減少手動搬運、遺漏與不可追溯。", {
    left: 180,
    top: 586,
    width: 900,
    height: 34,
  }, { fontSize: 23, bold: true, color: C.secondary, alignment: "center" });
  addSpeakerNotes(slide, "這張把 desktop utilities 的抽象能力映射到 biomedical 工作內容。重點是工具鏈，而不是產品清單。");
}

function slide14(p) {
  const slide = p.slides.add();
  slide.background.fill = C.bg;
  addHeader(slide, "TOOL-USE LIFECYCLE", "每次工具呼叫都要能被觀察與記錄", 19, C.teal);
  const steps = [
    ["Call", "structured input"],
    ["Observe", "tool output"],
    ["Validate", "schema + source"],
    ["Record", "log + artifact"],
  ];
  addLine(slide, "flow", 220, 338, 1060, 338, C.line, 1.6);
  steps.forEach((s, i) => {
    const x = 130 + i * 280;
    addNode(slide, `step-${i}`, s[0], x, 286, 170, 60, i === 2 ? C.amber : C.teal, i === 2 ? C.amberLight : C.white, 22, EN_FONT);
    addText(slide, `copy-${i}`, s[1], { left: x, top: 380, width: 170, height: 30 }, {
      fontSize: 19,
      color: C.secondary,
      alignment: "center",
      typeface: EN_FONT,
    });
  });
  addSurface(slide, "example", 210, 500, 860, 72, C.white, C.line);
  addText(slide, "example-text", "Example: PubMed query -> PMID list -> DOI check -> evidence_table row", {
    left: 252,
    top: 524,
    width: 780,
    height: 28,
  }, { fontSize: 22, bold: true, color: C.indigo, alignment: "center", typeface: EN_FONT });
  addSpeakerNotes(slide, "把 tool use 講成 lifecycle。重要的是每次工具呼叫都要有 input、output、validation 與 log，否則 agent 做過什麼很難被審查。");
}

function slide15(p) {
  const slide = p.slides.add();
  slide.background.fill = C.bg;
  addHeader(slide, "FAILURE MODES", "Agent workflow 常見錯誤多半不是語法錯，而是流程錯", 20, C.coral);
  const failures = [
    ["Wrong tool", "查錯資料庫或讀錯檔"],
    ["Context drift", "任務做一做偏掉"],
    ["Citation laundering", "citation 支撐錯 claim"],
    ["Silent data mutation", "欄位或樣本被改壞"],
    ["No stop condition", "一直重試或太早交付"],
    ["Prompt injection", "來源文字誘導 agent"],
  ];
  failures.forEach((f, i) => {
    const x = 104 + (i % 3) * 370;
    const y = 212 + Math.floor(i / 3) * 148;
    addSurface(slide, `f-${i}`, x, y, 308, 104, i === 5 ? C.coralLight : C.white, i === 5 ? C.coral : C.line);
    addText(slide, `f-title-${i}`, f[0], { left: x + 20, top: y + 22, width: 260, height: 28 }, {
      fontSize: 20,
      bold: true,
      color: i === 5 ? C.coral : C.indigo,
      typeface: EN_FONT,
    });
    addText(slide, `f-copy-${i}`, f[1], { left: x + 20, top: y + 62, width: 260, height: 28 }, {
      fontSize: 18,
      color: C.secondary,
    });
  });
  addText(slide, "bottom", "失敗模式要寫進 task spec、checks 與 human review rule。", {
    left: 220,
    top: 584,
    width: 840,
    height: 34,
  }, { fontSize: 24, bold: true, color: C.coral, alignment: "center" });
  addSpeakerNotes(slide, "這張是新版重點之一。Lesson 03 會談 hallucination，這裡先談 workflow-level failure。學生要學會預先把失敗模式寫進規格和檢查。");
}

function slide16(p) {
  const slide = p.slides.add();
  slide.background.fill = C.bg;
  addHeader(slide, "CLASS EXERCISE", "三個任務先判斷，再決定 agent 能做多少", 21, C.amber);
  const cases = [
    ["A", "PubMed 搜尋結果\n整理成 evidence table", C.teal],
    ["B", "判斷某 variant\n是否 pathogenic", C.coral],
    ["C", "幫一份 CSV 產生\nQC summary 與圖表", C.indigo],
  ];
  cases.forEach((c, i) => {
    const x = 104 + i * 378;
    addSurface(slide, `case-${i}`, x, 220, 314, 230, i === 1 ? C.coralLight : C.white, c[2]);
    addNode(slide, `case-label-${i}`, c[0], x + 28, 252, 54, 54, c[2], C.white, 24, EN_FONT);
    addText(slide, `case-copy-${i}`, c[1], { left: x + 56, top: 326, width: 210, height: 72 }, {
      fontSize: 24,
      bold: true,
      color: C.ink,
      alignment: "center",
    });
  });
  addText(slide, "prompt", "每組標出：agent 可以做什麼、需要哪些工具、怎麼驗證、何時 human review。", {
    left: 146,
    top: 536,
    width: 988,
    height: 34,
  }, { fontSize: 24, bold: true, color: C.secondary, alignment: "center" });
  addSpeakerNotes(slide, "把 mini exercise 改成三案例判斷。這會讓學生主動使用 suitability、red lines、verification 和 artifacts 的框架。");
}

function slide17(p) {
  const slide = p.slides.add();
  slide.background.fill = C.bg;
  addHeader(slide, "WORKSHEET", "把研究任務改寫成 agent-ready workflow", 22, C.amber);
  const fields = [
    ["Goal", "要回答什麼"],
    ["Inputs", "資料與版本"],
    ["Tools", "搜尋、讀檔、腳本"],
    ["Artifacts", "表格、log、note"],
    ["Checks", "來源與停止條件"],
  ];
  fields.forEach((f, i) => {
    const x = 104 + i * 218;
    addSurface(slide, `worksheet-${i}`, x, 242, 184, 198, C.white, i === 4 ? C.amber : C.line);
    addText(slide, `worksheet-head-${i}`, f[0], { left: x + 16, top: 268, width: 152, height: 28 }, {
      fontSize: 19,
      bold: true,
      color: i === 4 ? C.amber : C.indigo,
      alignment: "center",
      typeface: EN_FONT,
    });
    addText(slide, `worksheet-sub-${i}`, f[1], { left: x + 14, top: 330, width: 156, height: 54 }, {
      fontSize: 18,
      color: C.secondary,
      alignment: "center",
    });
  });
  addSurface(slide, "deliverable", 206, 514, 868, 58, C.amberLight, C.amber);
  addText(slide, "deliverable-text", "Deliverable: 一張 workflow 草圖 + 3 個 failure modes + 2 個 human review gates", {
    left: 240,
    top: 532,
    width: 800,
    height: 28,
  }, { fontSize: 21, bold: true, color: C.amber, alignment: "center", typeface: EN_FONT });
  addSpeakerNotes(slide, "這是課堂輸出。學生不是只回答問題，而是交出一張 agent-ready workflow worksheet，讓下一堂 LLM basics 和後面的 hands-on lab 可以接上。");
}

function slide18(p) {
  const slide = p.slides.add();
  slide.background.fill = C.ink;
  addText(slide, "transition-title", "Next: LLM basics", {
    left: 126,
    top: 120,
    width: 560,
    height: 66,
  }, { fontSize: 48, bold: true, color: C.white, typeface: EN_FONT });
  addText(slide, "transition-subtitle", "了解 model，才能設計好的 agent workflow", {
    left: 130,
    top: 210,
    width: 720,
    height: 40,
  }, { fontSize: 26, color: "#DDE4E8" });
  addLine(slide, "model-to-bus", 832, 310, 832, 502, "#52616D", 1.2);
  addLine(slide, "context-to-bus", 706, 407, 832, 407, "#52616D", 1.2);
  addLine(slide, "bus-to-tools", 832, 407, 950, 407, "#52616D", 1.2);
  addNode(slide, "model", "Model", 748, 240, 168, 70, C.indigo, C.indigoLight, 26, EN_FONT);
  addNode(slide, "context", "Context", 560, 382, 146, 50, "#8C98A1", "#26313A", 16, EN_FONT);
  addNode(slide, "tools", "Tools", 950, 382, 124, 50, "#8C98A1", "#26313A", 16, EN_FONT);
  addNode(slide, "verify", "Verify", 766, 502, 132, 50, "#8C98A1", "#26313A", 16, EN_FONT);
  addText(slide, "wrap", "這堂建立 workflow 外框；下一堂打開 model 層，理解 token、context、hallucination 與 tool use。", {
    left: 130,
    top: 514,
    width: 520,
    height: 80,
  }, { fontSize: 22, color: "#DDE4E8", lineSpacing: 1.1 });
  addDarkFooter(slide, 23);
  addSpeakerNotes(slide, "自然收束到 Lesson 03。這堂已經建立 agent workflow 判斷框架，下一堂再看 model 層為什麼有效、為什麼會錯。");
}

async function main() {
  await fs.mkdir(OUT_DIR, { recursive: true });
  await fs.mkdir(path.dirname(FINAL_PPTX), { recursive: true });

  const presentation = Presentation.create({ slideSize: { width: W, height: H } });
  [
    slide1,
    slide2CourseFrame,
    slide3Deliverables,
    slideToolComparison,
    slideToolToWorkflow,
    slide2,
    slide3,
    slide4,
    slide5,
    slide6,
    slide7,
    slideBaoyuDesignTechnique,
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
  ].forEach((builder) => builder(presentation));

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
