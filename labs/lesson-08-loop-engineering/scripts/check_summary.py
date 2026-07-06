#!/usr/bin/env python3
import csv
import re
import sys
from pathlib import Path


def load_source_ids(csv_path):
    with Path(csv_path).open(newline="", encoding="utf-8") as handle:
        return {row["source_id"] for row in csv.DictReader(handle)}


def issue(issue_type, message, severity="high", needs_human_review=False):
    return {
        "issue_type": issue_type,
        "severity": severity,
        "message": message,
        "needs_human_review": needs_human_review,
    }


def check_summary(summary, source_ids, max_words=220):
    issues = []
    cited = set(re.findall(r"\[(S\d+)\]", summary))

    if not cited:
        issues.append(issue("missing_source_id", "No source IDs found."))

    for sid in sorted(cited):
        if sid not in source_ids:
            issues.append(issue("invalid_source_id", f"{sid} is not in evidence_table.csv."))

    banned_terms = [
        "should treat",
        "recommended treatment",
        "patients should",
        "must receive",
    ]
    lower = summary.lower()
    for term in banned_terms:
        if term in lower:
            issues.append(issue(
                "clinical_recommendation",
                f"Clinical-action-like phrase found: {term}",
                needs_human_review=True,
            ))

    if len(summary.split()) > max_words:
        issues.append(issue("too_long", f"Summary exceeds {max_words} words.", severity="medium"))

    return issues


def main():
    if len(sys.argv) != 3:
        print("Usage: check_summary.py <summary.md> <evidence_table.csv>", file=sys.stderr)
        return 2

    summary = Path(sys.argv[1]).read_text(encoding="utf-8")
    source_ids = load_source_ids(sys.argv[2])
    issues = check_summary(summary, source_ids)

    if issues:
        print("FAILED")
        for item in issues:
            print(f"- {item['issue_type']}: {item['message']}")
        return 1

    print("OK: summary passed rule checks")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

