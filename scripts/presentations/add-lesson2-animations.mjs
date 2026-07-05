import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const run = promisify(execFile);
const SCRIPT_DIR = path.dirname(new URL(import.meta.url).pathname);
const REPO_ROOT = path.resolve(SCRIPT_DIR, "../..");
const INPUT = path.join(REPO_ROOT, "slides", "lesson-02-ai-agents-vibe-coding-desktop-utilities.pptx");
const OUTPUT = path.join(REPO_ROOT, "slides", "lesson-02-ai-agents-vibe-coding-desktop-utilities-animated.pptx");

const NS_P = "http://schemas.openxmlformats.org/presentationml/2006/main";

const ANIMATION_PLAN = {
  4: [
    ["tool-card-0", "tool-name-0", "tool-role-0", "tool-uses-0", "tool-caution-0"],
    ["tool-card-1", "tool-name-1", "tool-role-1", "tool-uses-1", "tool-caution-1"],
    ["tool-card-2", "tool-name-2", "tool-role-2", "tool-uses-2", "tool-caution-2"],
    ["tool-card-3", "tool-name-3", "tool-role-3", "tool-uses-3", "tool-caution-3"],
    ["tool-card-4", "tool-name-4", "tool-role-4", "tool-uses-4", "tool-caution-4"],
    ["tool-card-5", "tool-name-5", "tool-role-5", "tool-uses-5", "tool-caution-5"],
    ["bottom"],
  ],
  10: [
    ["goal"],
    ["goal-plan-a", "goal-plan-b", "goal-plan-c", "plan"],
    ["plan-act", "act"],
    ["act-observe-a", "act-observe-b", "act-observe-c", "observe"],
    ["observe-verify-a", "observe-verify-b", "observe-verify-c", "verify"],
    ["verify-state", "state"],
    ["human-link", "human", "state-goal-a", "state-goal-b", "state-goal-c"],
    ["loop-note"],
  ],
  12: [
    ["artifact-step-0", "artifact-num-0", "artifact-title-0", "artifact-copy-0"],
    ["artifact-arrow-0", "artifact-step-1", "artifact-num-1", "artifact-title-1", "artifact-copy-1"],
    ["artifact-arrow-1", "artifact-step-2", "artifact-num-2", "artifact-title-2", "artifact-copy-2"],
    ["artifact-arrow-2", "artifact-step-3", "artifact-num-3", "artifact-title-3", "artifact-copy-3"],
    ["pattern-box", "pattern-title", "pattern-list"],
    ["guardrail-box", "guardrail-title", "guardrail-list"],
    ["bottom"],
  ],
  16: [
    ["num-0", "step-0"],
    ["line-0", "num-1", "step-1"],
    ["line-1", "num-2", "step-2"],
    ["line-2", "num-3", "step-3"],
    ["line-3", "num-4", "step-4"],
    ["line-4", "num-5", "step-5"],
    ["rule", "rule-text"],
  ],
};

function parseShapeIds(slideXml) {
  const ids = new Map();
  const pattern = /<p:cNvPr\b[^>]*\bid="(\d+)"[^>]*\bname="([^"]*)"/g;
  for (const match of slideXml.matchAll(pattern)) {
    ids.set(match[2], Number(match[1]));
  }
  return ids;
}

function cTn(id, attrs = "", children = "") {
  return `<p:cTn id="${id}"${attrs}>${children}</p:cTn>`;
}

function buildTimingXml(groups) {
  let idCounter = 0;
  const nid = () => ++idCounter;
  nid(); // tmRoot
  nid(); // mainSeq

  const setVis = (spid, value, delay) =>
    `<p:set><p:cBhvr>${cTn(nid(), ' dur="1" fill="hold"', `<p:stCondLst><p:cond delay="${delay}"/></p:stCondLst>`)}` +
    `<p:tgtEl><p:spTgt spid="${spid}"/></p:tgtEl>` +
    `<p:attrNameLst><p:attrName>style.visibility</p:attrName></p:attrNameLst></p:cBhvr>` +
    `<p:to><p:strVal val="${value}"/></p:to></p:set>`;

  const fadeIn = (spid, durationMs) =>
    `<p:animEffect transition="in" filter="fade"><p:cBhvr>` +
    `${cTn(nid(), ` dur="${durationMs}"`)}` +
    `<p:tgtEl><p:spTgt spid="${spid}"/></p:tgtEl>` +
    `</p:cBhvr></p:animEffect>`;

  const effectPar = (spid, nodeType, secondary = false) =>
    `<p:par>${cTn(
      nid(),
      ` presetID="10" presetClass="entr" presetSubtype="0" fill="hold" grpId="0" nodeType="${nodeType}"`,
      `<p:stCondLst><p:cond delay="0"/></p:stCondLst>` +
        `<p:childTnLst>${setVis(spid, "visible", 0)}${fadeIn(spid, secondary ? 320 : 420)}</p:childTnLst>`,
    )}</p:par>`;

  let groupsXml = "";
  for (const spids of groups) {
    const groupId = nid();
    const itemId = nid();
    const effectXml = spids.map((spid, i) => effectPar(spid, i === 0 ? "clickEffect" : "withEffect", i > 0)).join("");
    groupsXml +=
      `<p:par>${cTn(
        groupId,
        ' fill="hold"',
        `<p:stCondLst><p:cond delay="indefinite"/></p:stCondLst>` +
          `<p:childTnLst><p:par>${cTn(
            itemId,
            ' fill="hold"',
            `<p:stCondLst><p:cond delay="0"/></p:stCondLst><p:childTnLst>${effectXml}</p:childTnLst>`,
          )}</p:par></p:childTnLst>`,
      )}</p:par>`;
  }

  const bldSpids = [...new Set(groups.flat())];
  const bldLst = `<p:bldLst>${bldSpids.map((spid) => `<p:bldP spid="${spid}" grpId="0" animBg="1"/>`).join("")}</p:bldLst>`;

  return (
    `<p:timing><p:tnLst><p:par>` +
    `${cTn(
      1,
      ' dur="indefinite" restart="never" nodeType="tmRoot"',
      `<p:childTnLst><p:seq concurrent="1" nextAc="seek">` +
        `${cTn(2, ' dur="indefinite" nodeType="mainSeq"', `<p:childTnLst>${groupsXml}</p:childTnLst>`)}` +
        `<p:prevCondLst><p:cond evt="onPrev" delay="0"><p:tgtEl><p:sldTgt/></p:tgtEl></p:cond></p:prevCondLst>` +
        `<p:nextCondLst><p:cond evt="onNext" delay="0"><p:tgtEl><p:sldTgt/></p:tgtEl></p:cond></p:nextCondLst>` +
        `</p:seq></p:childTnLst>`,
    )}` +
    `</p:par></p:tnLst>${bldLst}</p:timing>`
  );
}

function patchTiming(slideXml, timingXml) {
  const stripped = slideXml.replace(/<p:timing>[\s\S]*?<\/p:timing>/, "");
  const insertAfter = /(<\/p:cSld>(?:<p:clrMapOvr\b[\s\S]*?<\/p:clrMapOvr>)?(?:<p:transition\b(?:[^/>]*\/>|[\s\S]*?<\/p:transition>))?)/;
  if (!insertAfter.test(stripped)) {
    throw new Error("could not find a valid slide-level insertion point for p:timing");
  }
  return stripped.replace(insertAfter, `$1${timingXml}`);
}

async function patchSlide(workDir, slideNumber, shapeGroups) {
  const slidePath = path.join(workDir, "ppt", "slides", `slide${slideNumber}.xml`);
  const slideXml = await fs.readFile(slidePath, "utf8");
  const shapeIds = parseShapeIds(slideXml);
  const groups = shapeGroups.map((names) => {
    const missing = names.filter((name) => !shapeIds.has(name));
    if (missing.length > 0) {
      throw new Error(`slide ${slideNumber}: missing shape(s): ${missing.join(", ")}`);
    }
    return names.map((name) => shapeIds.get(name));
  });
  const patched = patchTiming(slideXml, buildTimingXml(groups));
  await fs.writeFile(slidePath, patched);
}

async function main() {
  const tmp = await fs.mkdtemp(path.join(os.tmpdir(), "lesson02-animations-"));
  await run("unzip", ["-q", INPUT, "-d", tmp]);
  for (const [slideNumber, shapeGroups] of Object.entries(ANIMATION_PLAN)) {
    await patchSlide(tmp, Number(slideNumber), shapeGroups);
  }
  await fs.mkdir(path.dirname(OUTPUT), { recursive: true });
  try {
    await fs.unlink(OUTPUT);
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
  await run("zip", ["-qr", OUTPUT, "."], { cwd: tmp });
  console.log(OUTPUT);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
