## Context

The lab currently contains a biomedical specification template, a PubMed evidence extractor example, and prompts for spec creation and implementation handoff. There is no application code. The change establishes a durable contract for a small command-line tool that converts gene-disease query rows and PubMed records into a traceable CSV evidence table.

The primary users are biomedical students and researchers. The reviewer is a human with enough domain knowledge to evaluate therapeutic or other high-risk clinical interpretations. PubMed metadata and abstracts are the only permitted evidence source. Model memory, non-PubMed web sources, PubMed Central full text, and uncited biomedical assertions are outside the evidence boundary.

## Goals / Non-Goals

**Goals:**

- Define deterministic input and output CSV schemas.
- Preserve every original query, executed search string, and retrieval date.
- Restrict claims to text supported by PubMed title, metadata, or abstract fields.
- Represent `not_found`, conflicting evidence, invalid input, and source unavailability explicitly.
- Keep source-supported claims separate from model inference.
- Require human review for clinical evidence, therapeutic implications, conflicting evidence, and any non-empty model inference.
- Make validation reproducible with offline fixtures and a single test command.

**Non-Goals:**

- Clinical decision support, treatment ranking, eligibility assessment, or patient advice.
- Full-text retrieval from PubMed Central, publisher websites, or other literature databases.
- Gene normalization against HGNC, NCBI Gene, or Ensembl.
- Automatic resolution of conflicting evidence.
- Replacement of human evidence appraisal or systematic-review methodology.
- Application code in the current proposal workflow.

## Decisions

### PubMed source boundary and adapter

The implementation will place all PubMed access behind one adapter. The adapter accepts a preserved query string and a maximum record count, then returns normalized PubMed metadata and abstract records. The extractor will never treat model memory or a non-PubMed response as evidence.

Alternative considered: allowing PubMed Central or publisher full text. Rejected because it changes licensing, retrieval, parsing, and evidence-quality boundaries beyond this lab.

### CSV input and evidence output contracts

The input CSV will contain `gene`, `disease`, optional `max_records`, and `query_date`. The output CSV will contain `input_row`, `original_gene`, `original_disease`, `search_query`, `query_date`, `pmid`, `title`, `year`, `journal`, `claim`, `evidence_type`, `evidence_status`, `model_inference`, and `review_status`.

Alternative considered: accepting free-form natural-language queries. Rejected because free-form input weakens validation and makes golden-output testing less deterministic.

### Deterministic status rows

A successful query produces one output row per retained PubMed record. A query with zero records produces exactly one row with `evidence_status=not_found`, an empty PMID and bibliographic fields, and preserved query provenance. Invalid input and source unavailability fail the batch before an evidence CSV is finalized. Conflicting records remain separate rows and are not collapsed into a single conclusion.

Alternative considered: omitting zero-result queries from output. Rejected because omission is indistinguishable from processing failure.

### Evidence and inference separation

The `claim` field will contain only a concise statement supported by PubMed source fields. The `model_inference` field is separate and empty by default. If a workflow explicitly enables inference later, non-empty inference will never alter `claim` or `evidence_status` and will force `review_status=needs_review`.

Alternative considered: combining extraction and interpretation into one summary. Rejected because reviewers could not distinguish evidence from generated reasoning.

### Human review gate

Rows with `evidence_type=clinical`, therapeutic efficacy, resistance, safety, prognosis, eligibility implications, conflicting evidence, or non-empty model inference will have `review_status=needs_review`. Other rows can be `pass` only when the claim is directly traceable to the retained PubMed fields.

Alternative considered: assigning a numeric confidence score. Rejected because an unvalidated score could imply a level of evidence quality that the extractor does not establish.

### Fixture-first validation

Tests will use offline PubMed-shaped fixtures so validation does not depend on network availability. Fixtures will cover three externally verified PMID records, an empty search result, contradictory source statements, an invalid input row, and a high-risk therapeutic claim. A golden CSV will fix expected row count, field values, status values, and review decisions.

Alternative considered: live PubMed calls in the default test suite. Rejected because network variability prevents reproducible classroom validation.

## Implementation Contract

**Behavior**

The command-line tool will read a UTF-8 CSV of gene-disease queries, validate the complete batch, retrieve or load PubMed records through one adapter, and write a UTF-8 evidence CSV. It will preserve input order; within each input row, retained PubMed records will be ordered by the adapter response order.

**Interface and data shape**

The planned command is `pubmed-evidence extract --input <queries.csv> --output <evidence.csv>`. The input fields are `gene`, `disease`, `max_records`, and `query_date`. `max_records` defaults to 20 and accepts integers from 1 through 100. `query_date` uses ISO `YYYY-MM-DD`.

The output fields are exactly `input_row`, `original_gene`, `original_disease`, `search_query`, `query_date`, `pmid`, `title`, `year`, `journal`, `claim`, `evidence_type`, `evidence_status`, `model_inference`, and `review_status`.

Allowed `evidence_type` values are `clinical`, `cohort`, `preclinical`, `review`, and `unknown`. Allowed `evidence_status` values are `supported`, `conflicting`, and `not_found`. Allowed `review_status` values are `pass` and `needs_review`.

**Failure modes**

An empty or malformed required field will produce `invalid_input`, identify the input row and field on stderr, exit non-zero, and leave no finalized evidence CSV. PubMed adapter failure will produce `source_unavailable`, include a timestamp and retry guidance on stderr, exit non-zero, and leave no finalized evidence CSV. A zero-result query will remain a successful batch outcome represented by one `not_found` row.

**Acceptance and verification**

The future implementation will pass `uv run pytest -q`. Tests will validate schemas, fail-fast behavior, the exact `not_found` row shape, PMID membership in the retained fixture records, separation of `claim` and `model_inference`, preservation of conflicting rows, the human review gate, and byte-stable golden CSV output.

**Scope boundaries**

In scope: CSV validation, PubMed query construction, normalized PubMed metadata and abstract ingestion, evidence-row extraction, explicit statuses, review gating, offline fixtures, and reproducible tests.

Out of scope: patient data, clinical recommendations, non-PubMed sources, full-text retrieval, evidence grading, meta-analysis, treatment ranking, gene normalization, and autonomous resolution of conflicts.

## Risks / Trade-offs

- [Abstract-only evidence can omit study details] -> Preserve source fields, label evidence type conservatively, and require review for clinical interpretations.
- [Automated claim extraction can overstate a source] -> Limit claims to retained title or abstract content and verify against golden fixtures.
- [PubMed availability and response formats can change] -> Isolate access behind one adapter and keep default tests offline.
- [Conservative review rules can generate many `needs_review` rows] -> Prefer review workload over silent high-risk interpretation.
- [Gene symbols and disease terms can be ambiguous] -> Preserve original values and avoid normalization outside the declared source boundary.
