import fs from "node:fs/promises";
import path from "node:path";
import { Presentation, PresentationFile } from "@oai/artifact-tool";

const SCRIPT_DIR = path.dirname(new URL(import.meta.url).pathname);
const REPO_ROOT = process.env.REPO_ROOT ? path.resolve(process.env.REPO_ROOT) : path.resolve(SCRIPT_DIR, "../..");
const OUT_DIR = path.join(REPO_ROOT, "previews", "lesson-06-agent-harness-engineering");
const FINAL_PPTX = path.join(REPO_ROOT, "slides", "lesson-06-agent-harness-engineering.pptx");

const W = 1280;
const H = 720;
const TOTAL = 40;
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
  addText(slide, dark ? "footer-dark" : "footer", `Agent harness engineering  |  ${n}/${TOTAL}`, {
    left: frame.left,
    top: 668,
    width: 430,
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

function addCode(slide, name, code, position, fontSize = 14) {
  const box = addSurface(slide, `${name}-box`, position.left, position.top, position.width, position.height, C.codeBg, "#131A21");
  addText(slide, name, code, {
    left: position.left + 18,
    top: position.top + 16,
    width: position.width - 36,
    height: position.height - 28,
  }, {
    fontSize,
    color: "#F3F7FA",
    typeface: MONO,
    lineSpacing: 1.08,
  });
  return box;
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
  slide.background.fill = color === C.coral ? C.coralLight : color === C.amber ? C.amberLight : color === C.indigo ? C.indigoLight : C.greenLight;
  addEyebrow(slide, eyebrow, color);
  addText(slide, "section-title", title, { left: 84, top: 206, width: 980, height: 108 }, {
    fontSize: 43,
    bold: true,
    color,
    lineSpacing: 1.02,
  });
  addText(slide, "section-subtitle", subtitle, { left: 88, top: 332, width: 900, height: 72 }, {
    fontSize: 24,
    color: C.ink,
    lineSpacing: 1.12,
  });
  addFooter(slide, n);
  notes(slide, subtitle);
}

function titleSlide(p, n) {
  const slide = p.slides.add();
  slide.background.fill = C.bg;
  addEyebrow(slide, "LESSON 06  |  AGENT HARNESS", C.indigo);
  addText(slide, "title", "Agent harness engineering", {
    left: 78,
    top: 112,
    width: 900,
    height: 70,
  }, { fontSize: 46, bold: true, color: C.ink, typeface: EN_FONT });
  addText(slide, "subtitle", "模型外圍的工作環境：tools、MCP、skills、memory、permissions、logs、state、verification", {
    left: 82,
    top: 204,
    width: 980,
    height: 64,
  }, { fontSize: 25, bold: true, color: C.secondary });
  const model = addNode(slide, "model", "Model\n會回答", 166, 368, 168, 88, C.indigo, C.indigoLight, 24);
  const harness = addNode(slide, "harness", "Harness\n讓它可控", 520, 344, 214, 136, C.teal, C.tealLight, 24);
  const review = addNode(slide, "review", "Human review\n決定能不能用", 900, 368, 220, 88, C.amber, C.amberLight, 21, EN_FONT);
  addLine(slide, "l1", 334, 412, 520, 412, C.teal, 2);
  addLine(slide, "l2", 734, 412, 900, 412, C.amber, 2);
  addFooter(slide, n);
  notes(slide, "開場先用一句話定義：模型負責回答，harness 負責讓回答可控、可查、可停。學生不用先懂架構圖，只要先懂為什麼同一個模型在不同工具環境下會差很多。");
}

function agendaSlide(p, n) {
  const slide = baseSlide(p, n, "90-MINUTE MAP", "這堂課要學會設計 agent 的工作環境");
  const rows = [
    ["0-10", "為什麼不是換大模型就好", "能力來自模型，也來自外圍設計。"],
    ["10-25", "Harness 的基本構造", "tools、MCP、skills、memory、state。"],
    ["25-42", "把工具變成可控能力", "schema、permission、allowlist、dry run。"],
    ["42-58", "生醫任務的安全邊界", "PHI/privacy、citation、gene、資料版本。"],
    ["58-75", "驗證與 audit trail", "logs、replay、human-in-the-loop。"],
    ["75-90", "小實作：檢查 harness config", "從危險設定改成可 demo 的設定。"],
  ];
  rows.forEach((r, i) => {
    const y = 160 + i * 72;
    addNode(slide, `time-${i}`, `${r[0]} min`, 102, y, 126, 44, i < 2 ? C.indigo : i < 4 ? C.teal : C.amber, i < 2 ? C.indigoLight : i < 4 ? C.tealLight : C.amberLight, 15, EN_FONT);
    addText(slide, `role-${i}`, r[1], { left: 272, top: y + 3, width: 326, height: 28 }, { fontSize: 21, bold: true });
    addText(slide, `copy-${i}`, r[2], { left: 640, top: y + 6, width: 500, height: 24 }, { fontSize: 18, color: C.secondary });
  });
  notes(slide, "這是一堂概念加輕量實作。不要一開始就講 MCP 細節，先讓學生知道 harness 是 agent 的工作場所、工具箱、行車紀錄器和煞車系統。");
}

function conceptSlide(p, n, eyebrow, title, bullets, rightTitle, rightBullets, color = C.indigo) {
  const slide = baseSlide(p, n, eyebrow, title, color);
  addBulletList(slide, "left-bullets", bullets, { left: 92, top: 218, width: 520, height: 340 }, { fontSize: 23, spaceAfter: 13 });
  addSurface(slide, "right-box", 690, 190, 420, 330, color === C.coral ? C.coralLight : color === C.amber ? C.amberLight : color === C.green ? C.greenLight : C.indigoLight, color);
  addText(slide, "right-title", rightTitle, { left: 728, top: 226, width: 340, height: 36 }, { fontSize: 25, bold: true, color });
  addBulletList(slide, "right-bullets", rightBullets, { left: 732, top: 292, width: 320, height: 190 }, { fontSize: 21, spaceAfter: 12 });
  notes(slide, `${title}\n\n重點：${bullets.join(" ")} ${rightTitle}：${rightBullets.join(" ")}`);
}

function threeCardsSlide(p, n, eyebrow, title, cards, color = C.teal) {
  const slide = baseSlide(p, n, eyebrow, title, color);
  cards.forEach((card, i) => {
    const x = 92 + i * 374;
    addSurface(slide, `card-${i}`, x, 216, 322, 266, card.fill ?? C.white, card.color ?? C.line);
    addText(slide, `card-title-${i}`, card.title, { left: x + 28, top: 248, width: 260, height: 56 }, { fontSize: 25, bold: true, color: card.color ?? C.ink, lineSpacing: 1.02 });
    addText(slide, `card-copy-${i}`, card.copy, { left: x + 28, top: 324, width: 258, height: 116 }, { fontSize: 20, color: C.ink, lineSpacing: 1.14 });
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

function workflowSlide(p, n) {
  const slide = baseSlide(p, n, "MENTAL MODEL", "Agent 是一個 loop，不是一句神諭");
  const nodes = [
    ["task", "Task\n任務", 112, 292, C.indigo, C.indigoLight],
    ["plan", "Plan\n計畫", 300, 292, C.teal, C.tealLight],
    ["tool", "Tool\n行動", 488, 292, C.amber, C.amberLight],
    ["observe", "Observe\n觀察", 676, 292, C.teal, C.tealLight],
    ["verify", "Verify\n驗證", 864, 292, C.coral, C.coralLight],
    ["answer", "Answer\n交付", 1052, 292, C.green, C.greenLight],
  ];
  nodes.forEach(([name, label, x, y, color, fill]) => addNode(slide, name, label, x, y, 132, 76, color, fill, 20, name === "answer" ? EN_FONT : FONT));
  for (let i = 0; i < nodes.length - 1; i += 1) addLine(slide, `arrow-${i}`, nodes[i][2] + 132, 330, nodes[i + 1][2], 330, C.secondary, 2);
  addText(slide, "caption", "Harness 決定 loop 裡有哪些工具、能碰哪些資料、怎麼記錄、什麼時候必須停下來問人。", {
    left: 148,
    top: 452,
    width: 980,
    height: 58,
  }, { fontSize: 24, bold: true, color: C.secondary, alignment: "center" });
  notes(slide, "學生常以為 agent 就是把 prompt 變長。這張要打掉直覺：agent 是反覆規劃、行動、觀察、驗證的 loop。Harness 是 loop 周圍的限制和基礎設施。");
}

function tableSlide(p, n, eyebrow, title, columns, rows, color = C.indigo) {
  const slide = baseSlide(p, n, eyebrow, title, color);
  const x0 = 94;
  const y0 = 190;
  const widths = [230, 392, 392];
  columns.forEach((col, i) => {
    const x = x0 + widths.slice(0, i).reduce((a, b) => a + b, 0);
    addSurface(slide, `head-${i}`, x, y0, widths[i], 48, color === C.coral ? C.coralLight : C.indigoLight, color);
    addText(slide, `head-text-${i}`, col, { left: x + 14, top: y0 + 12, width: widths[i] - 28, height: 24 }, { fontSize: 17, bold: true, color });
  });
  rows.forEach((row, r) => {
    const y = y0 + 54 + r * 76;
    row.forEach((cell, i) => {
      const x = x0 + widths.slice(0, i).reduce((a, b) => a + b, 0);
      addSurface(slide, `cell-${r}-${i}`, x, y, widths[i], 66, C.white, C.line);
      addText(slide, `cell-text-${r}-${i}`, cell, { left: x + 14, top: y + 12, width: widths[i] - 28, height: 42 }, { fontSize: i === 0 ? 17 : 16, bold: i === 0, color: i === 0 ? color : C.ink, lineSpacing: 1.08 });
    });
  });
  notes(slide, `${title}\n\n${rows.map((r) => r.join(" / ")).join("\n")}`);
}

function codeSlide(p, n, eyebrow, title, code, explanation, color = C.indigo, fontSize = 14) {
  const slide = baseSlide(p, n, eyebrow, title, color);
  addCode(slide, "code", code, { left: 92, top: 184, width: 620, height: 386 }, fontSize);
  addSurface(slide, "explain", 760, 204, 344, 320, color === C.coral ? C.coralLight : color === C.amber ? C.amberLight : C.tealLight, color);
  addText(slide, "explain-title", "看這幾個點", { left: 792, top: 238, width: 260, height: 34 }, { fontSize: 25, bold: true, color });
  addBulletList(slide, "explain-list", explanation, { left: 796, top: 304, width: 270, height: 170 }, { fontSize: 20, spaceAfter: 12 });
  notes(slide, `${title}\n\n示範程式碼重點：${explanation.join(" ")}`);
}

function buildSlides(p) {
  titleSlide(p, 1);
  agendaSlide(p, 2);
  conceptSlide(p, 3, "WHY THIS MATTERS", "同一顆模型，換一個 harness，行為會完全不同", [
    "模型本身只會根據上下文產生下一步",
    "Harness 決定它看得到什麼、能做什麼、做完怎麼被檢查",
    "生醫任務的核心不是讓 AI 很會講，是讓它不亂碰、不亂編、不亂下結論",
  ], "一句話記起來", [
    "Model answers",
    "Harness controls",
    "Human decides when stakes are high",
  ]);
  compareSlide(p, 4, "COMMON MISUNDERSTANDING", "不要把 agent 想成一個比較大的 chatbot", "Chatbot 直覺", [
    "問一句，回一句",
    "主要依賴 prompt",
    "錯了通常只重問",
  ], "Agent harness 直覺", [
    "有工具、有狀態、有紀錄",
    "能限制資料與動作",
    "錯了可以追查哪一步壞掉",
  ]);
  workflowSlide(p, 5);
  sectionSlide(p, 6, "PART 1", "先建立 harness 的基本構造", "學生要先看懂 agent 外面那一圈，不然後面 tools、MCP、memory 都會像咒語。", C.indigo);
  threeCardsSlide(p, 7, "HARNESS ANATOMY", "Harness 至少包含三層：環境、規則、驗證", [
    { title: "工作環境", copy: "檔案、資料庫、網路、API、terminal、瀏覽器。這些決定 agent 能碰到世界的哪一部分。", color: C.indigo, fill: C.indigoLight },
    { title: "行為規則", copy: "system prompt、tool schema、permission、allowlist、memory policy。這些是方向盤和煞車。", color: C.teal, fill: C.tealLight },
    { title: "驗證設施", copy: "logs、state、validators、citation check、human review。這些讓錯誤可以被發現。", color: C.amber, fill: C.amberLight },
  ]);
  conceptSlide(p, 8, "MODEL BOUNDARY", "模型很聰明，但它沒有天生的工作場所", [
    "它不知道你的檔案系統，除非 harness 把檔案內容交給它",
    "它不能真的查資料庫，除非 harness 提供可呼叫工具",
    "它不會自動記得任務歷史，除非 harness 管理 state 或 memory",
  ], "教學梗", [
    "模型像很會考試的人",
    "Harness 像實驗室 SOP",
    "沒有 SOP 的天才很可怕",
  ]);
  tableSlide(p, 9, "COMPONENT MAP", "把名詞翻成學生聽得懂的人話", ["元件", "白話意思", "生醫例子"], [
    ["Tools", "agent 可以呼叫的動作", "PubMed search、HGNC lookup、CSV validator"],
    ["Memory", "跨回合保留的資訊", "專案偏好、欄位格式、已檢查過的 source"],
    ["State", "目前任務進度與中間結果", "第 12 篇文獻已抽取，PMID 待確認"],
    ["Logs", "做過什麼的紀錄", "查了哪個 query、用哪個資料庫版本"],
  ]);
  conceptSlide(p, 10, "DESIGN QUESTION", "好的 harness 先問：這個 agent 不應該能做什麼？", [
    "新手會先加工具，資深一點會先加限制",
    "工具越多，錯誤路徑也越多",
    "在 biomedical 任務，不能做的事通常比能做的事更重要",
  ], "危險訊號", [
    "讀全專案",
    "任意網路",
    "自動寫檔覆蓋",
    "沒有 log",
  ], C.coral);
  sectionSlide(p, 11, "PART 2", "Tools、MCP、skills 是三種不同層次", "不要把所有外掛都叫 tool。分清楚層次，才知道問題要在哪裡修。", C.teal);
  threeCardsSlide(p, 12, "TOOLS", "Tool 是 agent 對外做事的最小單位", [
    { title: "明確輸入", copy: "例如 gene_symbol、database、max_results。不要讓工具吃一整段模糊自然語言。", color: C.teal, fill: C.tealLight },
    { title: "明確輸出", copy: "回傳結構化資料，最好包含 source、version、timestamp、warning。", color: C.indigo, fill: C.indigoLight },
    { title: "明確失敗", copy: "找不到就回 not_found，不要為了面子硬湊答案。AI 最怕太有禮貌地亂講。", color: C.coral, fill: C.coralLight },
  ], C.teal);
  codeSlide(p, 13, "TOOL SCHEMA", "Tool schema 是工具的使用說明書，也是護欄", `{
  "name": "hgnc_lookup",
  "description": "Check the current approved human gene symbol.",
  "input_schema": {
    "type": "object",
    "properties": {
      "query_symbol": { "type": "string" },
      "species": { "type": "string", "enum": ["human"] }
    },
    "required": ["query_symbol", "species"]
  }
}`, [
    "輸入要窄，不要萬用",
    "enum 可以擋掉錯誤物種",
    "description 要寫何時用、何時不用",
  ], C.teal, 14);
  conceptSlide(p, 14, "MCP", "MCP 可以想成 agent 工具與資料的標準插座", [
    "Host 是使用者面前的 AI 應用",
    "Client 負責跟某個 server 維持連線",
    "Server 提供 tools、resources、prompts 等能力",
    "重點不是潮，是把工具發現、呼叫、回傳變標準化",
  ], "不要神化 MCP", [
    "MCP 不是安全保證",
    "MCP 不是資料品質保證",
    "權限仍要自己設計",
  ], C.teal);
  tableSlide(p, 15, "MCP PRIMITIVES", "MCP 裡的三個常見 server primitives", ["Primitive", "它提供什麼", "生醫應用"], [
    ["Tools", "可執行的函式或動作", "查 PubMed、查 DOI、跑 validator"],
    ["Resources", "可讀取的資料內容", "資料庫 schema、實驗 SOP、去識別化資料字典"],
    ["Prompts", "可重用的任務模板", "evidence table extraction prompt、review prompt"],
    ["Notifications", "工具或狀態變動提醒", "資料庫更新、批次分析完成"],
  ], C.teal);
  conceptSlide(p, 16, "SKILLS", "Skill 是把工作方法包起來，不只是多一個工具", [
    "Tool 回答：我可以做哪個動作",
    "Skill 回答：這類任務應該怎麼做",
    "好的 skill 會包含步驟、限制、格式、檢查方式",
  ], "生醫例子", [
    "variant triage skill",
    "citation audit skill",
    "cohort summary skill",
  ], C.green);
  compareSlide(p, 17, "TOOL VS SKILL", "Tool 像儀器，skill 像實驗 SOP", "只有工具", [
    "會查 PubMed",
    "會寫 CSV",
    "會跑 script",
  ], "加上 skill", [
    "先定義 PICO 或問題範圍",
    "再抽 claim 與 citation",
    "最後跑檢查與人工 review",
  ], C.green);
  sectionSlide(p, 18, "PART 3", "Memory、state、logs 決定 agent 能不能被追查", "生醫任務不是只看最後答案，還要知道答案怎麼來的。", C.amber);
  conceptSlide(p, 19, "MEMORY", "Memory 不是越多越好，而是要有邊界", [
    "短期 memory：目前對話與當下任務",
    "專案 memory：欄位格式、命名慣例、使用者偏好",
    "長期 memory：跨專案保存的偏好，生醫資料要非常保守",
  ], "安全原則", [
    "不要存 PHI",
    "不要存未驗證結論",
    "重要記憶要有來源",
  ], C.amber);
  tableSlide(p, 20, "STATE", "State 是任務的進度表，不是神秘記憶", ["State 欄位", "用途", "例子"], [
    ["task_id", "知道正在做哪個任務", "EGFR-TKI-resistance-001"],
    ["step", "知道目前在哪一步", "screening / extraction / review"],
    ["artifact", "知道中間產物在哪", "outputs/evidence_table.csv"],
    ["status", "知道是否需要人介入", "blocked_by_missing_citation"],
  ], C.amber);
  conceptSlide(p, 21, "LOGS", "Logs 是 agent 的行車紀錄器", [
    "記錄 tool call、query、資料來源、版本、輸出檔",
    "錯誤發生時可以 replay 或定位",
    "沒有 log 的 agent，就像實驗記錄本空白但結果很漂亮",
  ], "最低限度", [
    "who / when",
    "tool / input",
    "source / version",
    "result / warning",
  ], C.amber);
  codeSlide(p, 22, "LOG RECORD", "一筆好的 tool log 長得像這樣", `{
  "time": "2026-07-05T20:10:31+08:00",
  "task_id": "EGFR-TKI-resistance-001",
  "tool": "pubmed_search",
  "input": {
    "query": "EGFR T790M osimertinib resistance",
    "max_results": 10
  },
  "source": "PubMed",
  "result_count": 10,
  "warning": null
}`, [
    "能重跑同一個 query",
    "能看出資料來源",
    "warning 不要藏起來",
  ], C.amber, 13);
  sectionSlide(p, 23, "PART 4", "Permissions 是 biomedical harness 的煞車系統", "不是不信任學生，也不是不信任模型，是不信任混在一起後的複雜系統。", C.coral);
  conceptSlide(p, 24, "PERMISSIONS", "Permission 要限制讀、寫、網路、工具、記憶", [
    "Read：哪些資料夾可以讀，哪些不能讀",
    "Write：只能寫 outputs 和 logs，避免覆蓋原始資料",
    "Network：只允許可信任 domains",
    "Tools：高風險工具要 require approval 或 dry run",
  ], "新手設定", [
    "read_paths: ./",
    "write_paths: ./",
    "network: true",
    "logging: false",
  ], C.coral);
  compareSlide(p, 25, "ALLOWLIST", "Allowlist 比 blacklist 更適合生醫任務", "Blacklist 思維", [
    "先全部開放",
    "想到危險才封",
    "永遠漏掉某個角落",
  ], "Allowlist 思維", [
    "預設全部不准",
    "只開任務需要的來源",
    "比較容易 audit 和教學",
  ], C.coral);
  tableSlide(p, 26, "BIOMEDICAL ALLOWLIST", "不同任務需要不同來源，不要全部塞進去", ["任務", "可以先開的來源", "要小心什麼"], [
    ["文獻 evidence table", "PubMed、DOI、journal page", "假 citation、抽錯 claim"],
    ["Gene symbol 檢查", "HGNC、NCBI Gene", "舊 symbol、同名縮寫"],
    ["Drug 資訊整理", "DrugBank 或核准藥品資料庫", "適應症與 off-label 混淆"],
    ["病人資料摘要", "本地去識別化資料", "PHI、再識別風險"],
  ], C.coral);
  conceptSlide(p, 27, "PHI / PRIVACY", "PHI 邊界要寫進 harness，不要靠學生良心瞬間升級", [
    "任何可識別病人的資訊，都不該直接丟進一般 agent 流程",
    "資料要先去識別化，或在受控環境內處理",
    "Logs 和 memory 也不能偷偷留下 PHI",
  ], "課堂規則", [
    "只用公開資料",
    "不貼病歷截圖",
    "不貼 accession + 身分線索",
  ], C.coral);
  sectionSlide(p, 28, "PART 5", "Verification 把答案變成可檢查的產物", "生醫 agent 的勝負不是文筆，而是能不能把每個 claim 接回來源。", C.green);
  conceptSlide(p, 29, "CITATION CHECK", "Citation check 不是看有沒有括號，是看來源支不支持 claim", [
    "PMID/DOI 必須真的存在",
    "引用段落要能支撐 claim",
    "Review article、preprint、case report 的證據等級不同",
    "找不到就標 not_found，不要硬補",
  ], "常見慘案", [
    "PMID 存在但文章不相關",
    "citation 支持相反結論",
    "把摘要推成臨床建議",
  ], C.green);
  tableSlide(p, 30, "GENE AND DATABASE CHECKS", "生醫資料錯誤常常不是大錯，是小地方滑倒", ["檢查點", "為什麼重要", "Harness 可怎麼做"], [
    ["Gene symbol", "舊名、別名、物種會混淆", "HGNC lookup + species lock"],
    ["Database version", "註解會隨版本改變", "log source version/date"],
    ["Clinical inference", "研究結果不等於醫囑", "clinical_action requires human review"],
    ["Unit / assay", "數值沒有單位等於沒有腿", "schema require unit and method"],
  ], C.green);
  conceptSlide(p, 31, "HUMAN-IN-THE-LOOP", "Human review 不是失敗，是高風險任務的正常結構", [
    "低信心、資料衝突、牽涉臨床行動時必須升級",
    "Reviewer 不是重做整份作業，而是檢查關鍵 claim 和來源",
    "最終交付要標出哪些地方是 AI 初稿、哪些已人工確認",
  ], "判斷句", [
    "能影響實驗決策？",
    "能影響病人？",
    "來源互相衝突？",
  ], C.green);
  sectionSlide(p, 32, "PART 6", "把安全設計套到四個生醫 agent 案例", "學生要知道這些不是抽象架構，而是每個 biomedical workflow 都會遇到的設計題。", C.indigo);
  tableSlide(p, 33, "CASE 1", "Literature evidence table agent 的 harness", ["設計項目", "推薦設定", "原因"], [
    ["Tools", "pubmed_search、doi_lookup、csv_validator", "只做找來源與整理，不自動寫結論"],
    ["Memory", "欄位格式與已檢查 PMID", "避免重複查，但不存未驗證 claim"],
    ["Verification", "PMID/DOI、quote、confidence 必填", "讓每列 evidence 可被人工追查"],
    ["Human review", "low confidence 或 clinical claim", "避免把文獻摘要變治療建議"],
  ], C.indigo);
  tableSlide(p, 34, "CASE 2", "Variant annotation assistant 的 harness", ["設計項目", "推薦設定", "原因"], [
    ["Sources", "ClinVar、gnomAD、HGVS validator", "版本和命名會影響 interpretation"],
    ["Permissions", "只讀 deidentified variant file", "避免接觸病人身分資料"],
    ["State", "variant_id、transcript、genome build", "沒有 build 的 variant 很容易講錯"],
    ["Output", "annotation summary, not diagnosis", "不能把輔助註解包裝成臨床決策"],
  ], C.indigo);
  tableSlide(p, 35, "CASE 3", "Cohort summary agent 的 harness", ["設計項目", "推薦設定", "原因"], [
    ["Input", "去識別化、最小必要欄位", "隱私風險先降到最低"],
    ["Tools", "aggregate-only statistics", "避免回傳可識別個體列"],
    ["Logs", "query、filters、row counts", "可追查分析條件"],
    ["Review", "small cell count alert", "降低再識別風險"],
  ], C.indigo);
  tableSlide(p, 36, "CASE 4", "Manuscript QA assistant 的 harness", ["設計項目", "推薦設定", "原因"], [
    ["Resources", "manuscript、supplement、reference list", "限定檢查範圍"],
    ["Tools", "citation matcher、table checker", "找 citation mismatch 和數字不一致"],
    ["Memory", "journal style only", "不保存未發表內容到長期記憶"],
    ["Output", "issues with location", "讓作者能逐項修正"],
  ], C.indigo);
  sectionSlide(p, 37, "MINI LAB", "小實作：檢查 harness config 是否安全", "這段只需要一點程式碼。目標不是寫完整 agent，而是讓學生知道設定可以被機器檢查。", C.teal);
  codeSlide(p, 38, "CONFIG", "先看一份 biomedical harness config", `agent:
  tools:
    - pubmed_search
    - hgnc_lookup
    - csv_validator
  read_paths:
    - data/deidentified/
    - sources/
  write_paths:
    - outputs/
    - logs/
  denied_paths:
    - data/phi/
    - secrets/
  network:
    allowed_domains:
      - pubmed.ncbi.nlm.nih.gov
      - genenames.org
  memory:
    enabled: true
    store_phi: false
  logging:
    enabled: true
    redact_phi: true`, [
    "read/write 分開",
    "network 用 allowlist",
    "memory 不准存 PHI",
    "logging 要開且 redact",
  ], C.teal, 11);
  codeSlide(p, 39, "VALIDATOR", "Validator 不用很聰明，但要抓住大洞", `def validate(config):
    errors = []
    if "./" in config["agent"].get("read_paths", []):
        errors.append("read_paths must not allow whole project")
    if "./" in config["agent"].get("write_paths", []):
        errors.append("write_paths must not allow whole project")
    if config["agent"].get("network") is True:
        errors.append("network must use allowed_domains")
    if not config["agent"].get("logging", {}).get("enabled"):
        errors.append("logging must be enabled")
    if config["agent"].get("memory", {}).get("store_phi"):
        errors.append("memory.store_phi must be false")
    return errors`, [
    "先檢查最危險設定",
    "錯誤訊息要可教學",
    "Validator 是 demo 穩定器",
  ], C.teal, 12);
  const slide = baseSlide(p, 40, "WRAP-UP", "帶走這三句，agent 就比較不會失控", C.indigo);
  addSurface(slide, "one", 120, 190, 1000, 84, C.indigoLight, C.indigo);
  addText(slide, "one-text", "1. 模型負責回答，harness 負責讓回答可控、可查、可停。", { left: 158, top: 218, width: 900, height: 34 }, { fontSize: 25, bold: true, color: C.indigo });
  addSurface(slide, "two", 120, 304, 1000, 84, C.tealLight, C.teal);
  addText(slide, "two-text", "2. 生醫 agent 的能力不只來自 tools，也來自 permissions、logs、verification。", { left: 158, top: 332, width: 900, height: 34 }, { fontSize: 25, bold: true, color: C.teal });
  addSurface(slide, "three", 120, 418, 1000, 84, C.amberLight, C.amber);
  addText(slide, "three-text", "3. 只要可能影響研究或臨床判斷，就要 citation check 和 human-in-the-loop。", { left: 158, top: 446, width: 900, height: 34 }, { fontSize: 25, bold: true, color: C.amber });
  notes(slide, "最後收束到三句話。這堂課的目的不是教學生追工具名詞，而是讓他們看到：agent 的安全與品質，是 harness 設計出來的。");
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
