import fs from "node:fs/promises";
import path from "node:path";
import { Presentation, PresentationFile } from "@oai/artifact-tool";

const SCRIPT_DIR = path.dirname(new URL(import.meta.url).pathname);
const REPO_ROOT = path.resolve(SCRIPT_DIR, "../..");
const OUT_DIR = path.join(REPO_ROOT, "previews", "course-introduction-ai-agent-biomedical-workflow");
const FINAL_PPTX = path.join(REPO_ROOT, "slides", "course-introduction-ai-agent-biomedical-workflow.pptx");

const W = 1280;
const H = 720;
const frame = { left: 76, top: 58, width: 1128, height: 594 };

const C = {
  bg: "#F7F8F6",
  grayBg: "#EEF1F2",
  ink: "#17202A",
  secondary: "#5C6670",
  teal: "#0E8F88",
  indigo: "#3446A8",
  amber: "#D89A16",
  coral: "#C85A4A",
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

function addEyebrow(slide, text, color = C.teal) {
  return addText(slide, "eyebrow", text, { left: frame.left, top: frame.top, width: 520, height: 30 }, {
    fontSize: 15,
    bold: true,
    color,
    typeface: EN_FONT,
  });
}

function addTitle(slide, text, y = 94, size = 36, width = 980) {
  return addText(slide, "title", text, { left: frame.left, top: y, width, height: 88 }, {
    fontSize: size,
    bold: true,
    color: C.ink,
    lineSpacing: 0.96,
  });
}

function addFooter(slide, n) {
  addText(slide, "footer", `Course introduction  |  ${n}/7`, {
    left: frame.left,
    top: 668,
    width: 360,
    height: 22,
  }, { fontSize: 12, color: C.secondary, typeface: EN_FONT });
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
    typeface: FONT,
    insets: { top: 0, right: 0, bottom: 0, left: 0 },
  };
  return shape;
}

function addPill(slide, name, text, x, y, w, color, fill = C.white) {
  const pill = slide.shapes.add({
    geometry: "roundRect",
    name,
    position: { left: x, top: y, width: w, height: 38 },
    fill,
    line: { style: "solid", fill: color, width: 1.3 },
    borderRadius: 10,
  });
  pill.text = text;
  pill.text.style = {
    fontSize: 17,
    bold: true,
    color,
    alignment: "center",
    verticalAlignment: "middle",
    typeface: EN_FONT,
    insets: { top: 4, right: 10, bottom: 4, left: 10 },
  };
  return pill;
}

function addNode(slide, name, label, x, y, w, h, color, fill = C.white, fontSize = 18) {
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
    typeface: FONT,
    insets: { top: 6, right: 8, bottom: 6, left: 8 },
  };
  return node;
}

function connect(slide, from, to, color = C.secondary, dashed = false) {
  return slide.shapes.connect(from, to, {
    kind: "straight",
    fromSide: "right",
    toSide: "left",
    line: { style: dashed ? "dashed" : "solid", fill: color, width: 1.7 },
    tail: { type: "arrow", width: "sm", length: "sm" },
  });
}

function addDivider(slide, x, y, w, color = C.line) {
  slide.shapes.add({
    geometry: "line",
    name: "divider",
    position: { left: x, top: y, width: w, height: 0 },
    fill: "none",
    line: { style: "solid", fill: color, width: 1 },
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

function addSpeakerNotes(slide, notes) {
  slide.speakerNotes.textFrame.setText(notes);
  slide.speakerNotes.setVisible(true);
}

function slide1(p) {
  const slide = p.slides.add();
  slide.background.fill = C.bg;
  addEyebrow(slide, "COURSE INTRODUCTION", C.indigo);
  addText(slide, "course-name", "醫療大數據：生醫資料庫與人工智慧應用", {
    left: frame.left,
    top: 114,
    width: 610,
    height: 74,
  }, { fontSize: 32, bold: true, lineSpacing: 1.02 });
  addText(slide, "subtitle", "AI agents for biomedical research workflows", {
    left: frame.left,
    top: 204,
    width: 570,
    height: 48,
  }, { fontSize: 24, color: C.indigo, bold: true, typeface: EN_FONT });
  addBulletList(slide, "opening-bullets", [
    "我們關心的不只是得到答案",
    "而是答案如何被產生、檢查、重跑",
    "三天後，你要能設計一個可信的 biomedical AI agent workflow",
  ], { left: frame.left, top: 304, width: 570, height: 170 }, { fontSize: 24, spaceAfter: 14 });

  const q = addNode(slide, "node-question", "Research\nquestion", 736, 154, 150, 68, C.teal, C.white, 17);
  const a = addNode(slide, "node-agent", "AI agent\nworkflow", 984, 154, 170, 68, C.indigo, C.white, 17);
  const paper = addNode(slide, "node-paper", "Paper", 738, 336, 116, 50, C.secondary, C.white, 16);
  const data = addNode(slide, "node-data", "Dataset", 900, 336, 132, 50, C.secondary, C.white, 16);
  const code = addNode(slide, "node-code", "Code", 1078, 336, 112, 50, C.secondary, C.white, 16);
  const out = addNode(slide, "node-output", "Evidence-backed\noutput", 875, 488, 210, 68, C.teal, C.white, 16);

  addLine(slide, "line-question-agent", 886, 188, 984, 188, C.indigo, 1.8);
  addLine(slide, "line-agent-down", 1069, 222, 1069, 300, C.indigo, 1.5);
  addLine(slide, "line-agent-bus", 796, 300, 1134, 300, C.indigo, 1.5);
  addLine(slide, "line-paper-in", 796, 300, 796, 336, C.indigo, 1.5);
  addLine(slide, "line-data-in", 966, 300, 966, 336, C.indigo, 1.5);
  addLine(slide, "line-code-in", 1134, 300, 1134, 336, C.indigo, 1.5);
  addLine(slide, "line-paper-out", 796, 386, 796, 438, C.teal, 1.5);
  addLine(slide, "line-data-out", 966, 386, 966, 438, C.teal, 1.5);
  addLine(slide, "line-code-out", 1134, 386, 1134, 438, C.teal, 1.5);
  addLine(slide, "line-output-bus", 796, 438, 1134, 438, C.teal, 1.5);
  addLine(slide, "line-output-down", 980, 438, 980, 488, C.teal, 1.8);
  for (const node of [q, a, paper, data, code, out]) node.bringToFront();
  addFooter(slide, 1);
  addSpeakerNotes(slide, "開場先定調：本課不是 prompt 技巧課，而是 workflow engineering 課。AI agent 在 biomedical 場景中有價值，但也有風險；課程目標是讓學生學會把 AI 放進一個可以被驗證的研究流程裡。");
}

function slide2(p) {
  const slide = p.slides.add();
  slide.background.fill = C.bg;
  addEyebrow(slide, "WHY WORKFLOWS MATTER", C.teal);
  addTitle(slide, "Biomedical research 的難點在流程銜接與檢查");
  addBulletList(slide, "bullets", [
    "常見任務：讀文獻、查資料庫、寫程式、產出報告",
    "真正困難不是單一步驟，而是前後步驟是否接得起來",
    "價值：把推理、工具、紀錄、修正串成可控流程",
    "最大風險：來源不明、步驟不可追、結果不可重現",
  ], { left: frame.left, top: 208, width: 570, height: 300 }, { fontSize: 23, spaceAfter: 12 });

  const x0 = 704;
  const nodeY = 206;
  const nodeW = 112;
  const nodeH = 56;
  const gap = 138;
  const nodes = [
    addNode(slide, "lit", "Literature", x0, nodeY, nodeW, nodeH, C.teal),
    addNode(slide, "db", "Database", x0 + gap, nodeY, nodeW, nodeH, C.teal),
    addNode(slide, "analysis", "Analysis", x0 + gap * 2, nodeY, nodeW, nodeH, C.indigo),
    addNode(slide, "report", "Report", x0 + gap * 3, nodeY, nodeW, nodeH, C.teal),
  ];
  for (let i = 0; i < nodes.length - 1; i++) connect(slide, nodes[i], nodes[i + 1], C.secondary);

  const centers = nodes.map((node) => node.position.left + node.position.width / 2);
  const busY = 322;
  for (const cx of centers) addLine(slide, "verification-branch", cx, nodeY + nodeH, cx, busY, C.amber, 1.5, true);
  addLine(slide, "verification-bus", centers[0], busY, centers[3], busY, C.amber, 1.5, true);
  addLine(slide, "verification-down", 967, busY, 967, 370, C.amber, 1.5, true);
  const check = addNode(slide, "verification", "Verification checkpoints", 752, 370, 430, 58, C.amber, "#FFF8E8", 20);
  for (const n of nodes) n.bringToFront();
  check.bringToFront();
  addText(slide, "risk-note", "看起來流暢 ≠ 可以信任", {
    left: 800,
    top: 490,
    width: 390,
    height: 42,
  }, { fontSize: 26, bold: true, color: C.coral, alignment: "center" });
  addFooter(slide, 2);
  addSpeakerNotes(slide, "把學生帶到實際研究工作流，而不是抽象談 AI。強調 biomedical 場景中錯誤成本高，所以 agent workflow 必須有 evidence、logs、tests、review points。");
}

function slide3(p) {
  const slide = p.slides.add();
  slide.background.fill = C.bg;
  addEyebrow(slide, "AGENT VIEW", C.indigo);
  addTitle(slide, "本課的 agent 觀點：不是 prompt，而是系統");
  addText(slide, "lead", "Prompt 是入口，不是完整解法。好的 workflow 要能回答三個問題。", {
    left: frame.left,
    top: 182,
    width: 760,
    height: 40,
  }, { fontSize: 24, color: C.secondary });

  const q1 = addNode(slide, "what", "它做了什麼？", 92, 278, 250, 64, C.teal, C.white, 22);
  const q2 = addNode(slide, "basis", "根據什麼做？", 92, 368, 250, 64, C.indigo, C.white, 22);
  const q3 = addNode(slide, "rerun", "如何檢查或重跑？", 92, 458, 250, 64, C.amber, C.white, 22);

  const center = addNode(slide, "workflow", "Agent workflow", 515, 354, 190, 84, C.indigo, "#F1F3FF", 22);
  const items = [
    addNode(slide, "spec", "Task spec", 452, 234, 136, 50, C.teal, C.white, 16),
    addNode(slide, "context", "Context", 644, 234, 126, 50, C.secondary, C.white, 16),
    addNode(slide, "tools", "Tools", 834, 316, 110, 50, C.indigo, C.white, 16),
    addNode(slide, "sources", "Sources", 834, 444, 122, 50, C.teal, C.white, 16),
    addNode(slide, "loop", "Loop", 644, 546, 118, 50, C.amber, C.white, 16),
    addNode(slide, "output", "Output", 452, 546, 124, 50, C.secondary, C.white, 16),
  ];
  for (const item of items) {
    slide.shapes.connect(center, item, {
      kind: "straight",
      line: { style: "solid", fill: C.line, width: 1.2 },
    });
  }
  slide.shapes.connect(q1, center, { kind: "elbow", fromSide: "right", toSide: "left", line: { style: "solid", fill: C.teal, width: 1.4 }, tail: { type: "arrow", width: "sm", length: "sm" } });
  slide.shapes.connect(q2, center, { kind: "elbow", fromSide: "right", toSide: "left", line: { style: "solid", fill: C.indigo, width: 1.4 }, tail: { type: "arrow", width: "sm", length: "sm" } });
  slide.shapes.connect(q3, center, { kind: "elbow", fromSide: "right", toSide: "left", line: { style: "solid", fill: C.amber, width: 1.4 }, tail: { type: "arrow", width: "sm", length: "sm" } });

  addPill(slide, "goal1", "checkable", 982, 272, 132, C.teal, "#EAF8F6");
  addPill(slide, "goal2", "reproducible", 982, 330, 154, C.indigo, "#EEF1FF");
  addPill(slide, "goal3", "maintainable", 982, 388, 154, C.secondary, C.white);
  addFooter(slide, 3);
  addSpeakerNotes(slide, "明確區分會問 AI 和會設計 agent workflow。這張投影片建立全課的工程標準：每個 agent 行為都要能被追蹤、限制、驗證。");
}

function slide4(p) {
  const slide = p.slides.add();
  slide.background.fill = C.bg;
  addEyebrow(slide, "THREE-DAY ROADMAP", C.teal);
  addTitle(slide, "三天課程會從操作走到可交付 workflow");
  const y = 238;
  const cols = [
    { x: 90, color: C.teal, day: "Day 1", title: "Foundations", items: ["LLM basics", "Desktop agent", "Evidence table", "Source checking"] },
    { x: 470, color: C.indigo, day: "Day 2", title: "Engineering", items: ["Harness", "Coding agent / CLI", "Spec-driven dev", "Loop lab"] },
    { x: 850, color: C.amber, day: "Day 3", title: "Integration", items: ["Hackathon", "Validation", "Reproducibility", "Demo"] },
  ];
  for (const col of cols) {
    const head = addNode(slide, `${col.day}-head`, `${col.day}\n${col.title}`, col.x, y, 250, 82, col.color, C.white, 22);
    addBulletList(slide, `${col.day}-list`, col.items, {
      left: col.x + 10,
      top: y + 126,
      width: 232,
      height: 170,
    }, { fontSize: 22, spaceAfter: 10, marginLeft: 20, indent: -10 });
    const marker = slide.shapes.add({
      geometry: "rect",
      name: `${col.day}-bar`,
      position: { left: col.x, top: y + 100, width: 250, height: 8 },
      fill: col.color,
      line: { style: "solid", fill: col.color, width: 0 },
    });
    marker.sendToBack();
    head.bringToFront();
  }
  addDivider(slide, 154, 205, 932, C.line);
  addText(slide, "roadmap-note", "每一天都從概念進到可執行流程，最後整合成 biomedical agent workflow。", {
    left: 158,
    top: 578,
    width: 900,
    height: 42,
  }, { fontSize: 24, bold: true, color: C.secondary, alignment: "center" });
  addFooter(slide, 4);
  addSpeakerNotes(slide, "用學習路線圖建立期待，但避免行政式課綱朗讀。三天是連續堆疊：先理解模型，再控制工具，再設計規格與迴圈，最後整合成專題。");
}

function slide5(p) {
  const slide = p.slides.add();
  slide.background.fill = C.bg;
  addEyebrow(slide, "HANDS-ON WORK", C.indigo);
  addTitle(slide, "你會把 biomedical task 拆成 agent 可以執行的流程");
  const steps = [
    ["Frame", "輸入、限制、成功條件", C.teal],
    ["Retrieve", "文獻與資料來源", C.teal],
    ["Analyze", "摘要、比較、整理", C.indigo],
    ["Build", "script 或小工具", C.indigo],
    ["Verify", "來源、測試、人工檢查", C.amber],
    ["Report", "輸出與 demo", C.secondary],
  ];
  let prev = null;
  steps.forEach((s, i) => {
    const x = 92 + i * 184;
    const node = addNode(slide, `step-${i}`, `${s[0]}\n${s[1]}`, x, 244, 142, 86, s[2], C.white, i === 5 ? 15 : 16);
    if (prev) connect(slide, prev, node, C.secondary);
    prev = node;
  });
  addBulletList(slide, "practice-bullets", [
    "使用 desktop agent 與 coding agent 完成部分自動化",
    "為 workflow 加上 source trace、test case、run log、review point",
    "練習讓 agent 失敗後修正，而不是只重問一次 prompt",
  ], { left: 164, top: 430, width: 880, height: 145 }, { fontSize: 25, spaceAfter: 12 });
  addFooter(slide, 5);
  addSpeakerNotes(slide, "讓學生理解課程會動手做，而且做的是工程化 workflow。也要預告後面的 loop engineering：agent 的核心能力不是一次成功，而是能在約束內反覆檢查與改進。");
}

function slide6(p) {
  const slide = p.slides.add();
  slide.background.fill = C.bg;
  addEyebrow(slide, "FINAL DELIVERABLE", C.teal);
  addTitle(slide, "最後交付的是可信 workflow，不是漂亮答案");
  addText(slide, "lead", "一個 biomedical AI agent workflow demo，至少包含：", {
    left: frame.left,
    top: 178,
    width: 540,
    height: 38,
  }, { fontSize: 24, color: C.secondary });
  addBulletList(slide, "deliverable-list", [
    "Biomedical task specification",
    "Agent workflow 與工具使用說明",
    "可追蹤的資料來源與執行紀錄",
    "Evaluation criteria 或檢查方法",
    "最終輸出：表格、分析、程式、報告或 demo",
  ], { left: frame.left, top: 244, width: 540, height: 250 }, { fontSize: 23, spaceAfter: 10 });

  const stackX = 772;
  const stackW = 330;
  const stack = [
    ["Research artifact", C.teal, "#EAF8F6"],
    ["Evaluation loop", C.amber, "#FFF8E8"],
    ["Agent harness", C.indigo, "#EEF1FF"],
    ["Data / literature / code tools", C.secondary, C.white],
    ["Biomedical question", C.teal, C.white],
  ];
  stack.forEach((s, i) => {
    const y = 176 + i * 72;
    addNode(slide, `stack-${i}`, s[0], stackX + i * 10, y, stackW - i * 20, 50, s[1], s[2], 18);
  });
  addText(slide, "score-note", "評估重點：workflow 是否可信、可檢查、可重跑", {
    left: 688,
    top: 568,
    width: 500,
    height: 44,
  }, { fontSize: 24, bold: true, color: C.coral, alignment: "center" });
  addFooter(slide, 6);
  addSpeakerNotes(slide, "把終點講清楚。學生要知道 hackathon 不是做一個炫技 demo，而是交付一個有工程品質的研究流程。這也替後續 spec-driven development 和 harness engineering 鋪路。");
}

function slide7(p) {
  const slide = p.slides.add();
  slide.background.fill = C.ink;
  addText(slide, "transition-title", "From language models\nto research agents", {
    left: 154,
    top: 186,
    width: 740,
    height: 136,
  }, { fontSize: 48, bold: true, color: C.white, lineSpacing: 0.95, typeface: EN_FONT });
  addText(slide, "transition-subtitle", "Next: LLM basics for biomedical workflows", {
    left: 158,
    top: 356,
    width: 640,
    height: 40,
  }, { fontSize: 24, color: "#DDE4E8", typeface: EN_FONT });
  const mini = [
    ["Intro", C.teal],
    ["LLM basics", C.indigo],
    ["Desktop workflow", C.secondary],
    ["Lab 1", C.amber],
  ];
  mini.forEach((m, i) => {
    addPill(slide, `mini-${i}`, m[0], 158 + i * 180, 530, 142, m[1], i === 1 ? "#EEF1FF" : "#26313A");
  });
  addText(slide, "footer-dark", "Course introduction  |  7/7", {
    left: frame.left,
    top: 668,
    width: 360,
    height: 22,
  }, { fontSize: 12, color: "#B7C0C7", typeface: EN_FONT });
  addSpeakerNotes(slide, "這張是轉場頁。第一堂課完成後，學生應該已經理解本課主軸：AI agent 的價值不在單次回答，而在能被設計、檢查與重跑的 biomedical research workflow。");
}

async function main() {
  await fs.mkdir(OUT_DIR, { recursive: true });
  await fs.mkdir(path.dirname(FINAL_PPTX), { recursive: true });

  const presentation = Presentation.create({
    slideSize: { width: W, height: H },
  });

  slide1(presentation);
  slide2(presentation);
  slide3(presentation);
  slide4(presentation);
  slide5(presentation);
  slide6(presentation);
  slide7(presentation);

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
