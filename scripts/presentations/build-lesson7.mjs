import fs from "node:fs/promises";
import path from "node:path";
import { Presentation, PresentationFile } from "@oai/artifact-tool";

const SCRIPT_DIR = path.dirname(new URL(import.meta.url).pathname);
const REPO_ROOT = process.env.REPO_ROOT ? path.resolve(process.env.REPO_ROOT) : path.resolve(SCRIPT_DIR, "../..");
const OUT_DIR = path.join(REPO_ROOT, "previews", "lesson-07-coding-agents-cli-workflows");
const FINAL_PPTX = path.join(REPO_ROOT, "slides", "lesson-07-coding-agents-cli-workflows.pptx");

const W = 1280;
const H = 720;
const TOTAL = 36;
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
  violet: "#6B4AA0",
  violetLight: "#F1ECFA",
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

function addPill(slide, name, text, x, y, w, color, fill, fontSize = 17) {
  const pill = addSurface(slide, name, x, y, w, 38, fill, color, 8);
  pill.text = text;
  pill.text.style = {
    fontSize,
    bold: true,
    color,
    alignment: "center",
    verticalAlignment: "middle",
    lineSpacing: 1,
    typeface: FONT,
    insets: { top: 4, right: 8, bottom: 4, left: 8 },
  };
  return pill;
}

function addEyebrow(slide, text, color = C.indigo) {
  addText(slide, "eyebrow", text, { left: frame.left, top: frame.top, width: 860, height: 30 }, {
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
  addText(slide, dark ? "footer-dark" : "footer", `Coding agents and CLI workflows  |  ${n}/${TOTAL}`, {
    left: frame.left,
    top: 668,
    width: 500,
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

function addCode(slide, name, code, position, fontSize = 13) {
  addSurface(slide, `${name}-box`, position.left, position.top, position.width, position.height, C.codeBg, "#131A21", 8);
  addText(slide, name, code, {
    left: position.left + 18,
    top: position.top + 15,
    width: position.width - 36,
    height: position.height - 30,
  }, {
    fontSize,
    color: "#F3F7FA",
    typeface: MONO,
    lineSpacing: 1.06,
  });
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
  slide.background.fill = color === C.coral ? C.coralLight : color === C.amber ? C.amberLight : color === C.green ? C.greenLight : color === C.violet ? C.violetLight : C.indigoLight;
  addEyebrow(slide, eyebrow, color);
  addText(slide, "section-title", title, { left: 84, top: 206, width: 1000, height: 118 }, {
    fontSize: 42,
    bold: true,
    color,
    lineSpacing: 1.02,
  });
  addText(slide, "section-subtitle", subtitle, { left: 88, top: 346, width: 910, height: 78 }, {
    fontSize: 24,
    color: C.ink,
    lineSpacing: 1.12,
  });
  addFooter(slide, n);
  notes(slide, subtitle);
  return slide;
}

function sourceLine(slide, text) {
  addText(slide, "source", text, { left: 760, top: 668, width: 430, height: 22 }, {
    fontSize: 11,
    color: C.muted,
    typeface: EN_FONT,
    alignment: "right",
  });
}

function conceptSlide(p, n, eyebrow, title, bullets, rightTitle, rightBullets, color = C.indigo) {
  const slide = baseSlide(p, n, eyebrow, title, color);
  addBulletList(slide, "left-bullets", bullets, { left: 92, top: 214, width: 560, height: 328 }, { fontSize: 22, spaceAfter: 12 });
  addSurface(slide, "right-box", 706, 190, 410, 330, color === C.coral ? C.coralLight : color === C.amber ? C.amberLight : color === C.green ? C.greenLight : color === C.violet ? C.violetLight : C.indigoLight, color);
  addText(slide, "right-title", rightTitle, { left: 742, top: 226, width: 330, height: 38 }, { fontSize: 25, bold: true, color });
  addBulletList(slide, "right-bullets", rightBullets, { left: 746, top: 292, width: 316, height: 194 }, { fontSize: 20, spaceAfter: 12 });
  notes(slide, `${title}\n\n${bullets.join(" ")} ${rightTitle}: ${rightBullets.join(" ")}`);
  return slide;
}

function threeCardsSlide(p, n, eyebrow, title, cards, color = C.teal) {
  const slide = baseSlide(p, n, eyebrow, title, color);
  cards.forEach((card, i) => {
    const x = 92 + i * 374;
    addSurface(slide, `card-${i}`, x, 216, 322, 266, card.fill ?? C.white, card.color ?? C.line);
    addText(slide, `card-title-${i}`, card.title, { left: x + 28, top: 248, width: 260, height: 58 }, { fontSize: 24, bold: true, color: card.color ?? C.ink, lineSpacing: 1.02 });
    addText(slide, `card-copy-${i}`, card.copy, { left: x + 28, top: 326, width: 258, height: 124 }, { fontSize: 19, color: C.ink, lineSpacing: 1.14 });
  });
  notes(slide, `${title}\n\n${cards.map((c) => `${c.title}: ${c.copy}`).join("\n")}`);
  return slide;
}

function tableSlide(p, n, eyebrow, title, headers, rows, color = C.indigo, options = {}) {
  const slide = baseSlide(p, n, eyebrow, title, color);
  const x = options.x ?? 84;
  const y = options.y ?? 198;
  const w = options.w ?? 1090;
  const rowH = options.rowH ?? 58;
  const widths = options.widths ?? headers.map(() => w / headers.length);
  const headerH = 44;
  let cursorX = x;
  headers.forEach((header, i) => {
    addSurface(slide, `header-${i}`, cursorX, y, widths[i], headerH, color, color, 4);
    addText(slide, `header-text-${i}`, header, { left: cursorX + 12, top: y + 12, width: widths[i] - 24, height: 22 }, { fontSize: options.headerFontSize ?? 16, bold: true, color: C.white, typeface: FONT });
    cursorX += widths[i];
  });
  rows.forEach((row, r) => {
    const fill = r % 2 === 0 ? C.white : "#F1F4F5";
    cursorX = x;
    row.forEach((cell, c) => {
      addSurface(slide, `cell-${r}-${c}`, cursorX, y + headerH + r * rowH, widths[c], rowH, fill, C.line, 4);
      addText(slide, `cell-text-${r}-${c}`, cell, { left: cursorX + 12, top: y + headerH + r * rowH + 10, width: widths[c] - 24, height: rowH - 14 }, {
        fontSize: options.fontSize ?? 16,
        color: c === 0 ? C.ink : C.secondary,
        bold: c === 0,
        lineSpacing: 1.05,
        typeface: options.typeface ?? FONT,
      });
      cursorX += widths[c];
    });
  });
  notes(slide, `${title}\n\n${rows.map((r) => r.join(" | ")).join("\n")}`);
  return slide;
}

function workflowSlide(p, n, eyebrow, title, steps, color = C.teal) {
  const slide = baseSlide(p, n, eyebrow, title, color);
  steps.forEach((step, i) => {
    const x = 96 + i * 177;
    const fill = step.fill ?? (i % 2 === 0 ? C.tealLight : C.indigoLight);
    const border = step.color ?? (i % 2 === 0 ? C.teal : C.indigo);
    addSurface(slide, `step-${i}`, x, 224, 150, 210, fill, border, 8);
    addText(slide, `step-no-${i}`, String(i + 1).padStart(2, "0"), { left: x + 18, top: 246, width: 60, height: 28 }, { fontSize: 18, bold: true, color: border, typeface: EN_FONT });
    addText(slide, `step-title-${i}`, step.title, { left: x + 18, top: 286, width: 114, height: 52 }, { fontSize: 22, bold: true, color: border, lineSpacing: 1.02 });
    addText(slide, `step-copy-${i}`, step.copy, { left: x + 18, top: 358, width: 114, height: 48 }, { fontSize: 16, color: C.ink, lineSpacing: 1.12 });
    if (i < steps.length - 1) {
      addText(slide, `step-arrow-${i}`, ">", { left: x + 158, top: 310, width: 24, height: 30 }, { fontSize: 26, bold: true, color: C.muted, typeface: EN_FONT, alignment: "center" });
    }
  });
  notes(slide, `${title}\n\n${steps.map((s, i) => `${i + 1}. ${s.title}: ${s.copy}`).join("\n")}`);
  return slide;
}

function splitCodeSlide(p, n, eyebrow, title, leftTitle, leftCode, rightTitle, rightBullets, color = C.indigo, codeFont = 13) {
  const slide = baseSlide(p, n, eyebrow, title, color);
  addText(slide, "left-title", leftTitle, { left: 92, top: 190, width: 512, height: 32 }, { fontSize: 22, bold: true, color });
  addCode(slide, "left-code", leftCode, { left: 92, top: 236, width: 544, height: 302 }, codeFont);
  addSurface(slide, "right-box", 704, 222, 412, 286, color === C.green ? C.greenLight : color === C.coral ? C.coralLight : color === C.amber ? C.amberLight : C.indigoLight, color);
  addText(slide, "right-title", rightTitle, { left: 740, top: 254, width: 336, height: 34 }, { fontSize: 24, bold: true, color });
  addBulletList(slide, "right-bullets", rightBullets, { left: 744, top: 314, width: 318, height: 150 }, { fontSize: 19, spaceAfter: 11 });
  notes(slide, `${title}\n\n${leftTitle}:\n${leftCode}\n\n${rightTitle}: ${rightBullets.join(" ")}`);
  return slide;
}

function buildSlides(p) {
  {
    const slide = p.slides.add();
    slide.background.fill = C.dark;
    addText(slide, "course", "Day 2 · Lesson 07", { left: 76, top: 70, width: 420, height: 30 }, { fontSize: 16, bold: true, color: "#AFC2FF", typeface: EN_FONT });
    addText(slide, "title", "Coding Agents\nand CLI Workflows", { left: 76, top: 158, width: 760, height: 154 }, { fontSize: 48, bold: true, color: C.white, lineSpacing: 0.98, typeface: EN_FONT });
    addText(slide, "subtitle", "把 agent 放進 repo、terminal、tests 與 Nextflow pipeline 開發流程", { left: 80, top: 340, width: 840, height: 46 }, { fontSize: 24, color: "#E2E8EE", lineSpacing: 1.12 });
    addSurface(slide, "right-panel", 862, 130, 300, 350, "#24313D", "#526171", 8);
    addText(slide, "panel-title", "Today output", { left: 896, top: 172, width: 220, height: 28 }, { fontSize: 23, bold: true, color: C.white, typeface: EN_FONT });
    addBulletList(slide, "panel-list", [
      "repo-grounded CLI workflow",
      "tool choice matrix",
      "guardrails against messy edits",
      "Seqera AI for Nextflow work",
    ], { left: 900, top: 230, width: 220, height: 190 }, { fontSize: 18, color: "#E2E8EE", spaceAfter: 12 });
    addFooter(slide, 1, true);
    notes(slide, "Lesson 07 connects general coding agents with bioinformatics workflow development, especially where Seqera AI can help with Nextflow and Seqera Platform tasks.");
  }

  conceptSlide(p, 2, "LEARNING TARGET", "今天不是教大家相信 agent，而是教大家要求它留下證據", [
    "讓 agent 先讀 repo，再提出小範圍修改計畫",
    "讓 agent 改程式、跑測試、解釋錯誤與回報 diff",
    "知道何時用桌面工具、IDE assistant、CLI coding agent 或 Seqera AI",
    "把 biomedical pipeline 開發變成可追溯的 commit 與驗證紀錄",
  ], "90 分鐘後", [
    "能下達 repo-grounded task",
    "能限制改檔範圍",
    "能檢查測試輸出",
    "能寫 Seqera AI prompt",
  ], C.indigo);

  workflowSlide(p, 3, "MENTAL MODEL", "Coding agent 的價值在這條閉環，不在單次回答", [
    { title: "Inspect", copy: "讀檔、看測試、理解資料格式", color: C.indigo, fill: C.indigoLight },
    { title: "Plan", copy: "限制 scope，先講要改哪裡", color: C.teal, fill: C.tealLight },
    { title: "Patch", copy: "用小 diff 修改程式或文件", color: C.green, fill: C.greenLight },
    { title: "Validate", copy: "跑測試、lint、sample command", color: C.amber, fill: C.amberLight },
    { title: "Report", copy: "列出改動、風險、未完成項", color: C.coral, fill: C.coralLight },
    { title: "Commit", copy: "留下可追溯版本紀錄", color: C.violet, fill: C.violetLight },
  ], C.indigo);

  tableSlide(p, 4, "TOOL CHOICE", "桌面工具、IDE assistant、CLI coding agent 的邊界要分清楚", ["工具型態", "適合", "不適合"], [
    ["桌面 agent", "讀 PDF、整理文獻、瀏覽網頁、做研究筆記", "大量改 repo、跑測試、處理多檔 diff"],
    ["IDE assistant", "局部補完、函式重構、API 用法提示", "跨 repo 規劃、批次驗證、完整報告"],
    ["CLI coding agent", "讀檔、改程式、跑測試、整理 diff 與風險", "無規格大型重寫、未授權外部操作"],
    ["Seqera AI", "Nextflow / nf-core / Seqera Platform 工作流輔助", "一般非生物資訊程式碼或不需 workflow context 的任務"],
  ], C.indigo, { widths: [190, 455, 445], rowH: 70, fontSize: 16 });

  threeCardsSlide(p, 5, "BASIC OPERATIONS", "CLI agent 不是聊天視窗，而是有工具的 repo worker", [
    { title: "讀", copy: "列檔案、搜尋關鍵字、讀 README、看 config、檢查 sample data。", color: C.indigo, fill: C.indigoLight },
    { title: "改", copy: "只改指定檔案，保留既有風格，避免順手重構和無關格式化。", color: C.teal, fill: C.tealLight },
    { title: "驗", copy: "跑測試、重現錯誤、比較輸出，最後用 diff 說明改了什麼。", color: C.green, fill: C.greenLight },
  ], C.teal);

  splitCodeSlide(p, 6, "PROMPT PACKET", "給 coding agent 的任務要像 issue，不要像願望", "Bad prompt", `幫我修一下這個 pipeline，順便整理一下程式。`, "問題", [
    "沒有 repo context",
    "沒有輸入輸出規格",
    "沒有改檔邊界",
    "沒有驗證命令",
  ], C.coral, 22);

  splitCodeSlide(p, 7, "PROMPT PACKET", "好的 task packet 會把自由度放在該放的地方", "Better prompt", `目標：修正 scripts/validate_manifest.py

請先讀：
- README.md
- sample_manifest.csv
- scripts/validate_manifest.py

只允許修改：
- scripts/validate_manifest.py
- tests/test_validate_manifest.py

驗證：
- python3 scripts/validate_manifest.py sample_manifest.csv
- pytest -q

回報：
- 修改摘要
- 測試結果
- 仍需人工確認的風險`, "為什麼有效", [
    "明確告訴 agent 先讀什麼",
    "限制 write surface",
    "測試命令可重跑",
    "要求風險回報",
  ], C.green, 12);

  conceptSlide(p, 8, "READ BEFORE WRITE", "要求 agent 先建立 repo map，再開始改檔", [
    "請 agent 先列出它讀過的檔案與理解到的資料流",
    "要求它標出 entry point、主要輸入、輸出與測試位置",
    "它若沒有讀檔就開始建議，先停下來補 context",
    "對 biomedical pipeline，要額外標出資料版本與 sample manifest 欄位",
  ], "檢查句", [
    "你讀了哪些檔案？",
    "哪個 command 可重現？",
    "你會改哪幾個檔？",
    "不會碰哪些檔？",
  ], C.indigo);

  splitCodeSlide(p, 9, "CLI COMMANDS", "最常用的 repo inspection 命令要讓學生看得懂", "Inspection checklist", `pwd
git status --short
rg --files
rg -n "TODO|FIXME|manifest|sample_id"
sed -n '1,220p' README.md
sed -n '1,220p' scripts/validate_manifest.py`, "教學重點", [
    "不用神秘化 terminal",
    "每個命令都有目的",
    "輸出要回到任務規格",
    "先看 status 避免覆蓋別人",
  ], C.indigo, 15);

  tableSlide(p, 10, "EDIT SCOPE", "讓 agent 改程式時，要明確定義可碰與不可碰", ["設定", "好寫法", "理由"], [
    ["Allowed files", "只允許改 scripts/validate_manifest.py 與 tests/", "縮小 blast radius"],
    ["Out of scope", "不要改資料檔、不要重命名欄位、不要大重構", "避免破壞既有流程"],
    ["Style", "沿用現有 argparse、logging、pytest 風格", "維持 repo 一致性"],
    ["Exit rule", "不確定時先回報，不要猜測臨床或資料語意", "降低 biomedical 風險"],
  ], C.teal, { widths: [190, 500, 400], rowH: 66, fontSize: 16 });

  splitCodeSlide(p, 11, "VALIDATION", "測試命令不是儀式，是 agent 完成任務的證據", "Validation commands", `# unit tests
pytest -q

# sample data smoke test
python3 scripts/validate_manifest.py sample_manifest.csv

# formatting or lint, if project uses them
ruff check scripts tests

# pipeline dry run, if applicable
nextflow run nextflow/main.nf -profile test`, "回報格式", [
    "命令原文",
    "通過或失敗",
    "關鍵錯誤訊息",
    "改完後是否重跑",
  ], C.green, 14);

  conceptSlide(p, 12, "ERROR EXPLANATION", "叫 agent 解釋錯誤時，要要求它把推論拆開", [
    "先貼出最小錯誤訊息與重現 command",
    "要求它指出錯在哪個檔案、哪個函式、哪個資料欄位",
    "要求列出假設，並用讀檔或測試結果支持",
    "修正後必須重跑同一個 command",
  ], "錯誤報告", [
    "Symptom",
    "Root cause",
    "Patch",
    "Verification",
  ], C.coral);

  tableSlide(p, 13, "TOOL COMPARISON", "Codex / Claude Code / Gemini CLI / Copilot CLI：先看工作情境", ["工具", "強項", "適合教學任務"], [
    ["Codex", "repo-grounded CLI workflow、diff、測試、commit 導向", "小型資料處理、bugfix、課堂 lab"],
    ["Claude Code", "長 context 程式理解、多檔重構討論、plan-first workflow", "讀大型 repo、設計改動策略"],
    ["Gemini CLI", "Google 生態、長 context、多模態或雲端整合場景", "讀大量文件、搭配 Google Cloud workflow"],
    ["Copilot CLI", "terminal 內命令輔助、GitHub/IDE 生態銜接", "解釋 shell/git 命令、日常 developer help"],
  ], C.indigo, { widths: [150, 485, 455], rowH: 70, fontSize: 15 });

  tableSlide(p, 14, "SEQERA POSITIONING", "Seqera AI 不只是另一個 coding agent，而是 bioinformatics workflow agent", ["面向", "一般 CLI coding agent", "Seqera AI / Co-Scientist"], [
    ["主要 context", "repo、測試、程式碼、shell 輸出", "Nextflow、nf-core、Seqera Platform、runs、datasets"],
    ["最常見任務", "修 bug、寫 script、跑 tests、整理 diff", "建立/除錯 pipeline、找 module、轉換 WDL/R、管理 runs"],
    ["驗證方式", "unit test、smoke test、lint、git diff", "Nextflow dry run、nf-test、run logs、MultiQC、Platform metrics"],
    ["人類 gate", "合併前 code review", "啟動雲端 run、改 workspace、動用資料前 approval"],
  ], C.violet, { widths: [170, 450, 470], rowH: 69, fontSize: 15 });

  sourceLine(p.slides.items[p.slides.items.length - 1], "Sources: docs.seqera.io, seqera.io/platform/seqera-ai");

  sectionSlide(p, 15, "PART 2", "如何避免 agent 亂改檔", "真正的問題通常不是 agent 不能改，而是它改太多、改太快、又沒有留下可檢查證據。", C.coral);

  conceptSlide(p, 16, "GUARDRAILS", "限制 agent 的 write surface，比事後整理爛 diff 更有效", [
    "每次任務只允許少數檔案或一個資料夾",
    "要求修改前先回報 plan，修改後先 show diff",
    "禁止無關格式化、重命名、搬檔與大規模重構",
    "資料檔、credential、環境設定與雲端資源要需要人工確認",
  ], "Prompt guard", [
    "Do not edit files outside...",
    "Do not run destructive commands",
    "Ask before external actions",
    "Preserve user changes",
  ], C.coral);

  splitCodeSlide(p, 17, "GIT HYGIENE", "每次讓 agent 動手前，先保護工作樹", "Minimum git ritual", `git status --short
git diff --stat

# after patch
git diff
pytest -q
git add <touched files>
git commit -m "Add manifest validation checks"`, "學生要會看", [
    "有哪些檔案被改",
    "有沒有無關檔案",
    "測試是否真的跑過",
    "commit 訊息是否可追溯",
  ], C.indigo, 15);

  tableSlide(p, 18, "BIOMEDICAL TASKS", "這堂課的 biomedical examples 都要落在可驗證 artifact", ["任務", "Agent 可以做", "人工要檢查"], [
    ["文獻表格轉 CSV", "解析欄位、清理空值、輸出 schema", "PMID/DOI 是否真實、欄位語意"],
    ["Gene symbol check", "格式檢查、大小寫、空值、重複", "是否為 approved symbol、物種與舊名"],
    ["JSON/HTML report extraction", "抽 table、產生 summary、寫 parser", "來源欄位是否被誤解"],
    ["Pipeline validation report", "統計樣本數、錯誤列、exit code", "分析結論與臨床語意"],
  ], C.green, { widths: [230, 445, 415], rowH: 70, fontSize: 15 });

  sectionSlide(p, 19, "LAB DEMO", "從 sample manifest 到 validation patch", "示範重點不是寫很難的程式，而是讓 agent 讀檔、改小範圍、跑測試、留下 report。", C.green);

  splitCodeSlide(p, 20, "LAB FILE TREE", "Lab 材料讓學生可以練習 repo-grounded prompt", "lesson-07 lab", `lesson-07-coding-agents-cli-workflows/
├── README.md
├── sample_manifest.csv
├── scripts/
│   └── validate_manifest.py
├── prompts/
│   ├── coding_agent_task.md
│   └── seqera_ai_task.md
└── nextflow/
    ├── main.nf
    └── nextflow.config`, "Demo 目標", [
    "先理解資料欄位",
    "補 manifest validation",
    "產生 summary report",
    "把 Nextflow 問題交給 Seqera AI",
  ], C.green, 14);

  splitCodeSlide(p, 21, "LAB PROMPT", "Coding agent demo prompt：小範圍、可驗證、可回報", "Prompt skeleton", `請在這個 lab repo 中完成：

1. 先讀 README、sample_manifest.csv、
   scripts/validate_manifest.py
2. 只修改 scripts/validate_manifest.py
3. 加入欄位檢查：
   sample_id, fastq_1, fastq_2, condition
4. 輸出 summary：
   total_rows, invalid_rows, error_messages
5. 跑：
   python3 scripts/validate_manifest.py sample_manifest.csv
6. 回報 diff 摘要與剩餘風險`, "教師強調", [
    "指定 read set",
    "指定 allowed write",
    "指定 acceptance criteria",
    "要求 command output",
  ], C.green, 11);

  workflowSlide(p, 22, "DEMO LOOP", "課堂示範可以照這個節奏跑", [
    { title: "Ask", copy: "貼 task packet，不直接叫它自由修", color: C.indigo, fill: C.indigoLight },
    { title: "Inspect", copy: "看 agent 讀了哪些檔案", color: C.teal, fill: C.tealLight },
    { title: "Patch", copy: "確認只改指定檔案", color: C.green, fill: C.greenLight },
    { title: "Run", copy: "重跑 sample command", color: C.amber, fill: C.amberLight },
    { title: "Review", copy: "檢查 diff 與錯誤列", color: C.coral, fill: C.coralLight },
    { title: "Record", copy: "保存 prompt、command、commit", color: C.violet, fill: C.violetLight },
  ], C.green);

  sectionSlide(p, 23, "PART 3", "Seqera AI：把 workflow domain knowledge 帶進 CLI", "一般 coding agent 可以改 repo；Seqera AI 的價值是理解 Nextflow、nf-core、Seqera Platform 與 pipeline execution context。", C.violet);

  threeCardsSlide(p, 24, "WHAT SEQERA AI ADDS", "Seqera AI 適合放在 bioinformatics pipeline 開發的 domain loop", [
    { title: "Nextflow fluency", copy: "協助撰寫 DSL2、config、schema、module glue 與 pipeline 結構。", color: C.violet, fill: C.violetLight },
    { title: "Run context", copy: "結合 Seqera Platform 的 run、logs、metrics、datasets 與 compute environment。", color: C.indigo, fill: C.indigoLight },
    { title: "Domain tasks", copy: "找 nf-core modules、轉換 WDL/R、產生 containers、協助 debug workflow。", color: C.teal, fill: C.tealLight },
  ], C.violet);
  sourceLine(p.slides.items[p.slides.items.length - 1], "Sources: docs.seqera.io/platform-cloud/co-scientist");

  splitCodeSlide(p, 25, "SEQERA CLI", "課堂中可以先展示 CLI 入口，不一定要當場登入學生帳號", "Useful commands", `npm install -g seqera
seqera login
seqera ai

# headless mode for reproducible prompt
seqera ai --headless "Review this Nextflow pipeline"

# resume previous session
seqera ai -c

# install/check coding-agent skill
seqera skill install
seqera skill check`, "注意", [
    "需要 Seqera login 或 token",
    "外部 action 先確認 approval",
    "prompt 與 run record 要保存",
    "教學可先用 headless prompt 範例",
  ], C.violet, 13);
  sourceLine(p.slides.items[p.slides.items.length - 1], "Sources: local seqera CLI help, docs.seqera.io");

  tableSlide(p, 26, "SEQERA AI USE CASES", "把 Seqera AI 補進課程時，重點放在 pipeline lifecycle", ["階段", "可以問 Seqera AI", "驗證 artifact"], [
    ["設計", "根據 FASTQ manifest 草擬 DSL2 pipeline 與 params schema", "pipeline sketch、schema、assumptions"],
    ["實作", "建議 nf-core modules、container、process I/O", "main.nf、modules、containers"],
    ["除錯", "解讀 failed task log、resource metrics、Nextflow error", "log excerpt、root cause、patch"],
    ["執行", "協助 launch/monitor Seqera Platform runs", "run ID、labels、MultiQC/report"],
  ], C.violet, { widths: [150, 560, 380], rowH: 70, fontSize: 15 });

  workflowSlide(p, 27, "HANDOFF DESIGN", "一般 coding agent 和 Seqera AI 可以分工，不需要互相取代", [
    { title: "Spec", copy: "教師或學生定義資料、目標、限制", color: C.indigo, fill: C.indigoLight },
    { title: "Codex", copy: "整理 repo、寫小 patch、跑本地測試", color: C.teal, fill: C.tealLight },
    { title: "Seqera AI", copy: "檢查 Nextflow/nf-core/Platform 問題", color: C.violet, fill: C.violetLight },
    { title: "Codex", copy: "把建議落成可 review 的 diff", color: C.green, fill: C.greenLight },
    { title: "Human", copy: "批准雲端 run、資料存取與 merge", color: C.coral, fill: C.coralLight },
    { title: "Record", copy: "保存 prompt、run ID、commit", color: C.amber, fill: C.amberLight },
  ], C.violet);

  splitCodeSlide(p, 28, "SEQERA PROMPT", "給 Seqera AI 的 prompt 要包含 workflow context，而不是只貼錯誤", "Headless prompt example", `seqera ai --headless "
I am teaching a small RNA-seq style Nextflow lab.
Please review nextflow/main.nf and nextflow.config.

Goals:
- read sample_manifest.csv
- validate paired FASTQ columns
- keep a test profile for local demo
- avoid cloud execution unless I approve

Please return:
1. likely DSL2 issues
2. missing params/schema checks
3. a minimal patch plan
4. commands to validate locally
"`, "設計重點", [
    "說明教學情境",
    "限制不要啟動雲端 run",
    "要求 patch plan 而非直接亂改",
    "要求 local validation commands",
  ], C.violet, 10);

  conceptSlide(p, 29, "NEXTFLOW LOOP", "Nextflow pipeline 開發可用更嚴格的 validation loop", [
    "先用 test profile 和小樣本做 dry run，不直接上 production data",
    "把 process input/output、channel shape、params schema 寫清楚",
    "用 failed work dir、command.log、exit code 追 root cause",
    "MultiQC/report 是 evidence，不是修飾品",
  ], "常用檢查", [
    "nextflow run ... -profile test",
    "nf-test test",
    "schema validation",
    "run logs / metrics",
  ], C.green);
  sourceLine(p.slides.items[p.slides.items.length - 1], "Sources: docs.seqera.io/nextflow, training.nextflow.io");

  tableSlide(p, 30, "SEQERA SAFETY", "Seqera AI 連到平台時，安全邊界要比本地 coding 更清楚", ["風險", "教學規則", "原因"], [
    ["Authentication", "不在投影片或 repo 放 token；使用 seqera login 或環境變數", "避免 credential leak"],
    ["Cloud cost", "任何 launch 或 compute environment 修改都要人工批准", "避免意外開資源"],
    ["Data governance", "不使用真實病人識別資料；demo data 要匿名或合成", "符合 biomedical safety"],
    ["Workspace actions", "改 dataset、labels、runs 前先要求確認", "外部狀態不可隨意變更"],
  ], C.coral, { widths: [190, 585, 315], rowH: 70, fontSize: 15 });

  splitCodeSlide(p, 31, "DEMO SCENARIO", "完整 demo：manifest validation + Nextflow review", "Scenario", `Input:
- sample_manifest.csv
- scripts/validate_manifest.py
- nextflow/main.nf

Task A with coding agent:
- improve manifest validator
- run sample smoke test
- report invalid rows

Task B with Seqera AI:
- review Nextflow test profile
- identify DSL2 / params issues
- suggest local validation commands`, "Expected outputs", [
    "validator patch",
    "command output",
    "Seqera AI review notes",
    "human-approved next actions",
  ], C.green, 13);

  conceptSlide(p, 32, "DO NOT DELEGATE", "有些事情可以讓 agent 幫忙準備，但不能讓它自行決定", [
    "不能讓 agent 自行判定臨床建議、治療策略或病患處置",
    "不能讓 agent 自行上傳、下載或移動敏感資料",
    "不能讓 agent 未經同意啟動昂貴雲端工作流",
    "不能讓 agent 在未 review 的情況下 merge 或覆蓋他人工作",
  ], "人要負責", [
    "clinical claims",
    "data access",
    "cloud execution",
    "merge decision",
  ], C.coral);

  tableSlide(p, 33, "STUDENT EXERCISE", "學生練習分成 coding agent 與 Seqera AI 兩個 prompt", ["階段", "交付物", "評分檢查"], [
    ["Coding agent prompt", "read set、allowed write、validation command", "是否限制 scope"],
    ["Patch review", "diff 摘要、測試結果、風險清單", "是否可重跑"],
    ["Seqera AI prompt", "Nextflow context、禁止外部 action、期望輸出", "是否適合 domain agent"],
    ["Final note", "commit hash 或 pseudo-patch plan", "是否可追溯"],
  ], C.indigo, { widths: [210, 490, 390], rowH: 70, fontSize: 15 });

  splitCodeSlide(p, 34, "CHEAT SHEET", "今天可直接帶走的 prompt checklist", "Checklist", `Before patch:
[ ] What files should the agent read?
[ ] What files may it edit?
[ ] What commands prove success?
[ ] What should it not do?

After patch:
[ ] Did it report touched files?
[ ] Did it run validation?
[ ] Did it preserve user changes?
[ ] Did it separate evidence from guess?

Seqera AI:
[ ] Did prompt include Nextflow context?
[ ] Did prompt require approval before Platform actions?`, "一句話", [
    "好 prompt 是小型工程規格",
    "好 agent workflow 會留下 diff",
    "好 biomedical workflow 會留下 evidence",
  ], C.indigo, 11);

  {
    const slide = baseSlide(p, 35, "SOURCES AND PRACTICE", "補充材料放在 repo，官方文件放在 speaker notes", C.violet);
    addSurface(slide, "lab-box", 92, 204, 500, 278, C.violetLight, C.violet);
    addText(slide, "lab-title", "Repo materials", { left: 126, top: 240, width: 430, height: 34 }, { fontSize: 24, bold: true, color: C.violet, typeface: EN_FONT });
    addBulletList(slide, "lab-list", [
      "labs/lesson-07-coding-agents-cli-workflows/",
      "sample_manifest.csv",
      "coding_agent_task.md",
      "seqera_ai_task.md",
    ], { left: 130, top: 304, width: 398, height: 120 }, { fontSize: 19, spaceAfter: 12, typeface: MONO });
    addSurface(slide, "src-box", 650, 204, 470, 278, C.white, C.line);
    addText(slide, "src-title", "Official sources", { left: 686, top: 240, width: 390, height: 34 }, { fontSize: 24, bold: true, color: C.indigo, typeface: EN_FONT });
    addBulletList(slide, "src-list", [
      "docs.seqera.io/platform-cloud/co-scientist",
      "seqera.io/platform/seqera-ai",
      "docs.seqera.io/nextflow",
      "training.nextflow.io/latest",
    ], { left: 690, top: 304, width: 382, height: 120 }, { fontSize: 17, spaceAfter: 11, typeface: EN_FONT });
    notes(slide, "Sources used: https://docs.seqera.io/platform-cloud/co-scientist/ ; https://seqera.io/platform/seqera-ai/ ; https://docs.seqera.io/nextflow/ ; https://training.nextflow.io/latest/ .");
  }

  {
    const slide = baseSlide(p, 36, "WRAP-UP", "最後帶走五句話", C.indigo);
    const lines = [
      ["1. Coding agent 要先讀 repo，不能直接憑空建議。", C.indigo, C.indigoLight],
      ["2. 小 scope、明確 command、清楚 diff，比長篇 prompt 更重要。", C.teal, C.tealLight],
      ["3. 測試輸出是完成任務的證據，不是附錄。", C.green, C.greenLight],
      ["4. Seqera AI 適合處理 Nextflow / nf-core / Platform domain context。", C.violet, C.violetLight],
      ["5. Biomedical workflow 的外部 action 和高風險 claim 必須有人 gate。", C.coral, C.coralLight],
    ];
    lines.forEach((line, i) => {
      const y = 166 + i * 82;
      addSurface(slide, `wrap-${i}`, 118, y, 1010, 58, line[2], line[1]);
      addText(slide, `wrap-text-${i}`, line[0], { left: 148, top: y + 16, width: 930, height: 26 }, { fontSize: 22, bold: true, color: line[1] });
    });
    notes(slide, "Wrap-up: connect CLI agent basics, guardrails, validation, and Seqera AI domain workflow support.");
  }
}

async function main() {
  await fs.mkdir(OUT_DIR, { recursive: true });
  await fs.mkdir(path.dirname(FINAL_PPTX), { recursive: true });
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
