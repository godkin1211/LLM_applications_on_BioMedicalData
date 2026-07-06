#!/usr/bin/env python3
import csv
import json
import re
from pathlib import Path

from check_summary import check_summary, load_source_ids


ROOT = Path(__file__).resolve().parents[1]
OUTPUTS = ROOT / "outputs"


def load_evidence():
    path = ROOT / "evidence_table.csv"
    with path.open(newline="", encoding="utf-8") as handle:
        return list(csv.DictReader(handle))


def make_plan(question, evidence):
    return {
        "question": question.strip(),
        "source_ids": [row["source_id"] for row in evidence],
        "must_not": ["patient-level treatment recommendation", "claims outside evidence table"],
        "output": "biomedical summary <= 220 words with source IDs",
    }


def generate_summary():
    return (
        "EGFR T790M is associated with resistance to first-generation EGFR TKIs in NSCLC [S1]. "
        "Osimertinib is effective in all EGFR-mutant lung cancers and patients should receive it. "
        "Bypass pathway activation may also contribute to resistance."
    )


def mock_evaluator(summary):
    issues = []
    if "all EGFR-mutant lung cancers" in summary:
        issues.append({
            "issue_type": "overstatement",
            "severity": "high",
            "sentence": "Osimertinib is effective in all EGFR-mutant lung cancers and patients should receive it.",
            "explanation": "Evidence only supports activity in T790M-positive NSCLC.",
            "suggested_fix": "Limit the claim to T790M-positive NSCLC and cite [S2].",
            "needs_human_review": False,
        })
    if "patients should receive" in summary:
        issues.append({
            "issue_type": "clinical_recommendation",
            "severity": "high",
            "sentence": "patients should receive it",
            "explanation": "The summary makes a patient-level treatment recommendation.",
            "suggested_fix": "Remove the recommendation and describe evidence only.",
            "needs_human_review": True,
        })
    if "Bypass pathway activation may also contribute to resistance." in summary:
        issues.append({
            "issue_type": "missing_source_id",
            "severity": "medium",
            "sentence": "Bypass pathway activation may also contribute to resistance.",
            "explanation": "The claim has no source ID.",
            "suggested_fix": "Add [S3] and mention that the evidence is preclinical.",
            "needs_human_review": False,
        })
    return issues


def revise_summary(summary, issues):
    revised = summary
    for item in issues:
        if item["issue_type"] in {"overstatement", "clinical_recommendation"}:
            revised = re.sub(
                r"Osimertinib is effective.*?receive it\. ",
                "Osimertinib has reported activity in T790M-positive NSCLC [S2]. ",
                revised,
            )
        if item["issue_type"] == "missing_source_id":
            revised = revised.replace(
                "Bypass pathway activation may also contribute to resistance.",
                "Preclinical evidence suggests bypass pathway activation may contribute to resistance, but this remains indirect evidence [S3].",
            )
    return revised


def blocking_issues(issues):
    return [item for item in issues if item["severity"] in {"high", "medium"}]


def run_loop(max_iterations=3):
    OUTPUTS.mkdir(exist_ok=True)
    question = (ROOT / "question.md").read_text(encoding="utf-8")
    evidence = load_evidence()
    source_ids = load_source_ids(ROOT / "evidence_table.csv")
    plan = make_plan(question, evidence)
    draft = generate_summary()
    (OUTPUTS / "draft_summary.md").write_text(draft + "\n", encoding="utf-8")

    issue_log = []
    status = "max_iterations_reached"

    for iteration in range(1, max_iterations + 1):
        llm_issues = mock_evaluator(draft)
        rule_issues = check_summary(draft, source_ids)
        issues = llm_issues + rule_issues
        issue_log.append({"iteration": iteration, "issues": issues})

        if not blocking_issues(issues):
            status = "passed"
            break

        human_review_only = all(item.get("needs_human_review") for item in blocking_issues(issues))
        if human_review_only:
            status = "needs_human_review"
            break

        draft = revise_summary(draft, issues)

    final_summary = draft
    final_issues = check_summary(final_summary, source_ids) + mock_evaluator(final_summary)
    if not blocking_issues(final_issues):
        status = "passed"

    (OUTPUTS / "final_summary.md").write_text(final_summary + "\n", encoding="utf-8")
    (OUTPUTS / "issue_log.json").write_text(json.dumps(issue_log, indent=2), encoding="utf-8")

    report = {
        "status": status,
        "iterations": len(issue_log),
        "blocking_issues_remaining": len(blocking_issues(final_issues)),
        "human_review_required": any(item.get("needs_human_review") for item in final_issues),
        "sources_used": sorted(set(re.findall(r"\[(S\d+)\]", final_summary))),
        "plan": plan,
        "outputs": {
            "draft_summary": "outputs/draft_summary.md",
            "final_summary": "outputs/final_summary.md",
            "issue_log": "outputs/issue_log.json",
        },
    }
    (OUTPUTS / "loop_report.json").write_text(json.dumps(report, indent=2), encoding="utf-8")
    return report


def main():
    report = run_loop()
    print(json.dumps(report, indent=2))


if __name__ == "__main__":
    main()

