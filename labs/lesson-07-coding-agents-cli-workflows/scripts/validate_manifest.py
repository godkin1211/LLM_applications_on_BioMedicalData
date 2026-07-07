#!/usr/bin/env python3
"""Minimal manifest validator for the Lesson 07 coding-agent lab."""

from __future__ import annotations

import csv
import sys
from pathlib import Path


REQUIRED_COLUMNS = ["sample_id", "fastq_1", "fastq_2", "condition"]


def validate_manifest(path: Path) -> tuple[int, list[str]]:
    errors: list[str] = []
    with path.open(newline="") as handle:
        reader = csv.DictReader(handle)
        missing = [column for column in REQUIRED_COLUMNS if column not in (reader.fieldnames or [])]
        if missing:
            errors.append(f"missing columns: {', '.join(missing)}")
            return 0, errors

        total = 0
        for row in reader:
            total += 1
            if not row.get("sample_id"):
                errors.append(f"row {total}: sample_id is empty")
            if not row.get("fastq_1"):
                errors.append(f"row {total}: fastq_1 is empty")
            if not row.get("fastq_2"):
                errors.append(f"row {total}: fastq_2 is empty")

    return total, errors


def main(argv: list[str]) -> int:
    if len(argv) != 2:
        print("usage: validate_manifest.py <sample_manifest.csv>", file=sys.stderr)
        return 2

    total, errors = validate_manifest(Path(argv[1]))
    print(f"total_rows={total}")
    print(f"invalid_rows={len(errors)}")
    for error in errors:
        print(f"ERROR: {error}")

    return 1 if errors else 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
