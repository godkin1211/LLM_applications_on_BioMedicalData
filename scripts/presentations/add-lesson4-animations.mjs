import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const run = promisify(execFile);
const SCRIPT_DIR = path.dirname(new URL(import.meta.url).pathname);
const REPO_ROOT = path.resolve(SCRIPT_DIR, "../..");
const INPUT = path.join(REPO_ROOT, "slides", "lesson-04-desktop-agent-literature-evidence-workflow.pptx");
const OUTPUT = path.join(REPO_ROOT, "slides", "lesson-04-desktop-agent-literature-evidence-workflow-animated.pptx");

const ANIMATION_PLAN = {
  5: [
    ["file-0", "file-name-0", "file-desc-0"],
    ["file-1", "file-name-1", "file-desc-1"],
    ["file-2", "file-name-2", "file-desc-2"],
    ["file-3", "file-name-3", "file-desc-3"],
    ["file-4", "file-name-4", "file-desc-4"],
    ["file-5", "file-name-5", "file-desc-5"],
    ["file-6", "file-name-6", "file-desc-6"],
    ["path"],
  ],
  4: [
    ["block-0", "block-head-0", "block-copy-0"],
    ["block-1", "block-head-1", "block-copy-1"],
    ["block-2", "block-head-2", "block-copy-2"],
    ["block-3", "block-head-3", "block-copy-3"],
    ["bottom"],
  ],
  6: [
    ["step-0"],
    ["flow-line-1", "step-1"],
    ["flow-line-2", "step-2"],
    ["flow-line-3", "step-3"],
    ["flow-line-4", "step-4"],
    ["flow-line-5", "step-5"],
    ["bottom"],
  ],
  9: [
    ["table-head-PMID-0", "table-head-source-1", "table-head-type-2", "table-head-n-3", "table-head-use-4"],
    ["source-row-0", "source-0-0", "source-0-1", "source-0-2", "source-0-3", "source-0-4"],
    ["source-row-1", "source-1-0", "source-1-1", "source-1-2", "source-1-3", "source-1-4"],
    ["source-row-2", "source-2-0", "source-2-1", "source-2-2", "source-2-3", "source-2-4"],
    ["rule"],
  ],
  10: [
    ["schema-0", "schema-head-0", "schema-fields-0"],
    ["schema-1", "schema-head-1", "schema-fields-1"],
    ["schema-2", "schema-head-2", "schema-fields-2"],
    ["schema-3", "schema-head-3", "schema-fields-3"],
    ["bottom"],
  ],
  12: [
    ["table-head-gene-0", "table-head-drug-1", "table-head-PMID-2", "table-head-n-3", "table-head-evidence kind-4", "table-head-status-5"],
    ["ev-row-0", "ev-0-0", "ev-0-1", "ev-0-2", "ev-0-3", "ev-0-4", "ev-0-5"],
    ["ev-row-1", "ev-1-0", "ev-1-1", "ev-1-2", "ev-1-3", "ev-1-4", "ev-1-5"],
    ["ev-row-2", "ev-2-0", "ev-2-1", "ev-2-2", "ev-2-3", "ev-2-4", "ev-2-5"],
    ["ev-row-3", "ev-3-0", "ev-3-1", "ev-3-2", "ev-3-3", "ev-3-4", "ev-3-5"],
    ["bottom"],
  ],
  14: [
    ["col-0", "col-head-0", "col-bullets-0"],
    ["col-1", "col-head-1", "col-bullets-1"],
    ["rule"],
  ],
  17: [
    ["check-step-0"],
    ["check-line-1", "check-step-1"],
    ["check-line-2", "check-step-2"],
    ["check-line-3", "check-step-3"],
    ["check-line-4", "check-step-4"],
    ["bottom"],
  ],
  20: [
    ["demo-step-0", "demo-num-0", "demo-head-0", "demo-copy-0"],
    ["demo-step-1", "demo-num-1", "demo-head-1", "demo-copy-1"],
    ["demo-step-2", "demo-num-2", "demo-head-2", "demo-copy-2"],
    ["demo-step-3", "demo-num-3", "demo-head-3", "demo-copy-3"],
    ["rule"],
  ],
  21: [
    ["task", "task-text"],
    ["questions"],
  ],
  22: [
    ["chapter", "chapter-number"],
    ["title", "subtitle"],
    ["deep-search-0"],
    ["deep-search-1"],
    ["deep-search-2"],
  ],
  25: [
    ["ladder-head-0", "ladder-query-bg-0", "ladder-query-0", "ladder-use-0"],
    ["ladder-line-1", "ladder-head-1", "ladder-query-bg-1", "ladder-query-1", "ladder-use-1"],
    ["ladder-line-2", "ladder-head-2", "ladder-query-bg-2", "ladder-query-2", "ladder-use-2"],
    ["ladder-line-3", "ladder-head-3", "ladder-query-bg-3", "ladder-query-3", "ladder-use-3"],
    ["bottom"],
  ],
  26: [
    ["eligibility-0", "eligibility-head-0", "eligibility-items-0"],
    ["eligibility-1", "eligibility-head-1", "eligibility-items-1"],
    ["bottom"],
  ],
  29: [
    ["triage-0", "triage-head-0", "triage-action-0"],
    ["triage-1", "triage-head-1", "triage-action-1"],
    ["triage-2", "triage-head-2", "triage-action-2"],
    ["triage-3", "triage-head-3", "triage-action-3"],
    ["bottom"],
  ],
  30: [
    ["chapter", "chapter-number"],
    ["title", "subtitle"],
    ["deep-row-0"],
    ["deep-row-1"],
    ["deep-row-2"],
  ],
  31: [
    ["claim-bad", "claim-bad-text"],
    ["atomic-label-0", "atomic-scope-0", "atomic-claim-0"],
    ["atomic-label-1", "atomic-scope-1", "atomic-claim-1"],
    ["atomic-label-2", "atomic-scope-2", "atomic-claim-2"],
  ],
  32: [
    ["kind-0", "kind-name-0", "kind-meaning-0", "kind-action-0"],
    ["kind-1", "kind-name-1", "kind-meaning-1", "kind-action-1"],
    ["kind-2", "kind-name-2", "kind-meaning-2", "kind-action-2"],
    ["kind-3", "kind-name-3", "kind-meaning-3", "kind-action-3"],
    ["kind-4", "kind-name-4", "kind-meaning-4", "kind-action-4"],
  ],
  33: [
    ["sample-stage-0"],
    ["sample-line-1", "sample-stage-1"],
    ["sample-line-2", "sample-stage-2"],
    ["sample-line-3", "sample-stage-3"],
    ["sample-rule-head-0", "sample-rule-copy-0"],
    ["sample-rule-head-1", "sample-rule-copy-1"],
    ["sample-rule-head-2", "sample-rule-copy-2"],
  ],
  36: [
    ["conflict-step-0"],
    ["conflict-line-1", "conflict-step-1"],
    ["conflict-line-2", "conflict-step-2"],
    ["conflict-line-3", "conflict-step-3"],
    ["conflict-line-4", "conflict-step-4"],
    ["conflict-example", "conflict-example-text"],
  ],
  39: [
    ["bundle-num-0", "bundle-file-0", "bundle-purpose-0"],
    ["bundle-num-1", "bundle-file-1", "bundle-purpose-1"],
    ["bundle-num-2", "bundle-file-2", "bundle-purpose-2"],
    ["bundle-num-3", "bundle-file-3", "bundle-purpose-3"],
    ["bundle-num-4", "bundle-file-4", "bundle-purpose-4"],
    ["bundle-num-5", "bundle-file-5", "bundle-purpose-5"],
    ["exit-gate", "exit-title", "exit-items"],
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
  nid();
  nid();

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
  await fs.writeFile(slidePath, patchTiming(slideXml, buildTimingXml(groups)));
}

async function main() {
  const tmp = await fs.mkdtemp(path.join(os.tmpdir(), "lesson04-animations-"));
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
