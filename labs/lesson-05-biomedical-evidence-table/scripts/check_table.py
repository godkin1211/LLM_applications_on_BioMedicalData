#!/usr/bin/env python3
import argparse
import csv
import sys
from pathlib import Path

REQUIRED_COLUMNS = [
    "question",
    "entity_type",
    "entity",
    "claim",
    "evidence_type",
    "source_title",
    "source_id",
    "PMID_or_DOI",
    "year",
    "quoted_evidence",
    "agent_summary",
    "confidence",
    "limitation",
    "needs_human_review",
    "reviewer_correction",
]

ALLOWED_CONFIDENCE = {"high", "medium", "low", "not_found"}
ALLOWED_REVIEW = {"TRUE", "FALSE"}
MISSING_SOURCE_VALUES = {"", "TBD", "unknown", "none", "NA", "N/A"}


def clean(value):
    return (value or "").strip()


def validate(path):
    if not path.exists():
        return [f"Missing file: {path}"]

    with path.open(newline="", encoding="utf-8-sig") as handle:
        reader = csv.DictReader(handle)
        rows = list(reader)
        fieldnames = reader.fieldnames or []

    errors = []
    missing_columns = [column for column in REQUIRED_COLUMNS if column not in fieldnames]
    if missing_columns:
        errors.append("Missing columns: " + ", ".join(missing_columns))
        return errors

    extra_columns = [column for column in fieldnames if column not in REQUIRED_COLUMNS]
    if extra_columns:
        errors.append("Unexpected columns: " + ", ".join(extra_columns))

    if not rows:
        errors.append("No evidence rows found")
        return errors

    for row_number, row in enumerate(rows, start=2):
        claim = clean(row["claim"])
        source_id = clean(row["source_id"])
        pmid_or_doi = clean(row["PMID_or_DOI"])
        quote = clean(row["quoted_evidence"])
        confidence = clean(row["confidence"]).lower()
        needs_review = clean(row["needs_human_review"]).upper()

        if not claim:
            errors.append(f"Line {row_number}: missing claim")
        if source_id in MISSING_SOURCE_VALUES:
            errors.append(f"Line {row_number}: missing source_id")
        if pmid_or_doi in MISSING_SOURCE_VALUES:
            errors.append(f"Line {row_number}: missing PMID_or_DOI")
        if not quote:
            errors.append(f"Line {row_number}: missing quoted_evidence")
        if confidence not in ALLOWED_CONFIDENCE:
            errors.append(
                f"Line {row_number}: invalid confidence '{row['confidence']}' "
                f"(use high, medium, low, or not_found)"
            )
        if needs_review not in ALLOWED_REVIEW:
            errors.append(
                f"Line {row_number}: invalid needs_human_review '{row['needs_human_review']}' "
                f"(use TRUE or FALSE)"
            )

    return errors


def main():
    parser = argparse.ArgumentParser(description="Validate a biomedical evidence table CSV.")
    parser.add_argument(
        "csv_path",
        nargs="?",
        default="evidence_table.csv",
        help="Path to evidence_table.csv. Defaults to ./evidence_table.csv.",
    )
    args = parser.parse_args()

    path = Path(args.csv_path)
    errors = validate(path)
    if errors:
        for error in errors:
            print(error)
        sys.exit(1)

    with path.open(newline="", encoding="utf-8-sig") as handle:
        rows = list(csv.DictReader(handle))
    print(f"OK: {len(rows)} evidence rows")


if __name__ == "__main__":
    main()
