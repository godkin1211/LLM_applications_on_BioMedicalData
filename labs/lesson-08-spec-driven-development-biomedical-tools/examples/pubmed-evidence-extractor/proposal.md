## Why

Biomedical researchers need a reproducible way to turn gene-disease queries into an evidence table without invented PMIDs, unsupported claims, or hidden model inference. A PubMed-only contract is needed before implementation so provenance, safe failure states, and human review requirements are testable.

## What Changes

- Define a PubMed evidence extraction capability for gene-disease query rows.
- Restrict evidence to PubMed metadata and abstracts supplied by, or retrieved for, the workflow.
- Define explicit input and output schemas, including preserved query provenance.
- Treat `not_found`, conflicting evidence, and source unavailability as explicit outcomes.
- Separate source-supported claims from model inference.
- Require human review for therapeutic or other high-risk clinical interpretations.
- Define deterministic fixtures, schema checks, PMID traceability checks, and golden-output validation.
- Produce specification and implementation-planning artifacts only; no application code is included in this change.

## Capabilities

### New Capabilities

- `pubmed-evidence-extraction`: Convert validated gene-disease queries and PubMed records into a traceable evidence table with safe failure states and a human review gate.

### Modified Capabilities

None.

## Impact

- Affected specs: `pubmed-evidence-extraction`
- Affected code:
  - New: `pyproject.toml`
  - New: `src/pubmed_evidence_extractor/__init__.py`
  - New: `src/pubmed_evidence_extractor/cli.py`
  - New: `src/pubmed_evidence_extractor/models.py`
  - New: `src/pubmed_evidence_extractor/pubmed.py`
  - New: `src/pubmed_evidence_extractor/extract.py`
  - New: `tests/test_pubmed_evidence_extractor.py`
  - New: `tests/fixtures/pubmed_records.json`
  - New: `tests/fixtures/queries.csv`
  - New: `tests/fixtures/golden_evidence.csv`
- External systems: PubMed is the only permitted biomedical evidence source.
