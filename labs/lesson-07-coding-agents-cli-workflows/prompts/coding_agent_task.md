# Coding Agent Task Packet

You are working in the Lesson 07 lab repo.

## Goal

Improve `scripts/validate_manifest.py` so it validates a small paired-end FASTQ manifest and prints a useful summary.

## Read first

- `README.md`
- `sample_manifest.csv`
- `scripts/validate_manifest.py`

## Allowed edits

- `scripts/validate_manifest.py`

Do not edit `sample_manifest.csv` on the first pass. Do not rename files. Do not add large dependencies.

## Required checks

Add validation for:

- required columns: `sample_id`, `fastq_1`, `fastq_2`, `condition`
- `sample_id` must be non-empty and contain only letters, numbers, `_`, `.`, or `-`
- `fastq_1` and `fastq_2` must be non-empty
- FASTQ paths should end in `.fastq.gz` or `.fq.gz`
- `condition` must be one of `tumor`, `normal`, or `control`

## Validation command

```bash
python3 scripts/validate_manifest.py sample_manifest.csv
```

## Report back

Return:

- files changed
- validation command and exit status
- summary of detected invalid rows
- remaining risks or assumptions
