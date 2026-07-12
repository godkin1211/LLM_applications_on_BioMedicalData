## ADDED Requirements

### Requirement: Closed and validated input schema

The extractor SHALL accept a UTF-8 CSV with required columns `gene`, `disease`, and `query_date`, plus optional column `max_records`. The extractor SHALL reject undeclared columns so patient identifiers and unrelated data are not processed. `gene` and `disease` SHALL be non-empty after trimming, `query_date` SHALL use ISO `YYYY-MM-DD`, and `max_records` SHALL be an integer from 1 through 100 with a default of 20.

#### Scenario: Valid input row

- **WHEN** input row 1 contains `gene=EGFR`, `disease=non-small cell lung cancer`, `query_date=2026-07-12`, and no `max_records`
- **THEN** the extractor SHALL accept the row and use `max_records=20`

##### Example: Input validation boundaries

| Input condition | Expected result |
| --- | --- |
| Empty `gene` | `invalid_input` identifying row and field |
| Empty `disease` | `invalid_input` identifying row and field |
| `max_records=0` | `invalid_input` |
| `max_records=101` | `invalid_input` |
| `query_date=07/12/2026` | `invalid_input` |
| Additional `patient_id` column | `invalid_input` identifying the undeclared column |

### Requirement: Fail-fast batch validation

The extractor SHALL validate the complete input batch before retrieving PubMed records. If any row is invalid, the extractor SHALL write an `invalid_input` message to stderr, identify the row and field, exit non-zero, and SHALL NOT finalize an evidence CSV.

#### Scenario: One invalid row in a multi-row batch

- **WHEN** row 1 is valid and row 2 has an empty `disease`
- **THEN** the extractor SHALL report row 2 and `disease`, SHALL NOT retrieve PubMed records for either row, and SHALL NOT leave a finalized output file

### Requirement: PubMed-only evidence boundary

The extractor SHALL use only PubMed metadata and abstract fields returned by the configured PubMed adapter or supplied in a PubMed-shaped offline fixture. The extractor MUST NOT use model memory, PubMed Central full text, publisher pages, other literature databases, or uncited web content as evidence.

#### Scenario: Non-PubMed content is available

- **WHEN** the runtime environment contains a related publisher article or non-PubMed summary
- **THEN** the extractor SHALL ignore that content and SHALL build evidence rows only from retained PubMed records

### Requirement: Deterministic PubMed query provenance

For each accepted input row, the extractor SHALL construct and preserve the executed query as `"<gene>"[Title/Abstract] AND "<disease>"[Title/Abstract]`. The output SHALL preserve `input_row`, `original_gene`, `original_disease`, `search_query`, and `query_date` without silently replacing the original values.

#### Scenario: Query construction

- **WHEN** an input row contains `gene=EGFR` and `disease=non-small cell lung cancer`
- **THEN** `search_query` SHALL equal `"EGFR"[Title/Abstract] AND "non-small cell lung cancer"[Title/Abstract]`

### Requirement: Fixed evidence output schema

The extractor SHALL write a UTF-8 CSV with columns in this exact order: `input_row`, `original_gene`, `original_disease`, `search_query`, `query_date`, `pmid`, `title`, `year`, `journal`, `claim`, `evidence_type`, `evidence_status`, `model_inference`, and `review_status`.

Allowed `evidence_type` values SHALL be `clinical`, `cohort`, `preclinical`, `review`, and `unknown`. Allowed `evidence_status` values SHALL be `supported`, `conflicting`, and `not_found`. Allowed `review_status` values SHALL be `pass` and `needs_review`.

#### Scenario: Successful record extraction

- **WHEN** one accepted query retains three PubMed records
- **THEN** the extractor SHALL write three output rows using the exact column order and allowed enumerated values

### Requirement: PMID and bibliographic traceability

Every non-empty `pmid` SHALL match a PMID present in the PubMed records retained for that query. `title`, `year`, and `journal` SHALL come from the same retained record. The extractor MUST NOT generate, repair, or infer a PMID.

#### Scenario: Retained fixture records

- **WHEN** the fixture adapter returns PMIDs `111`, `222`, and `333`
- **THEN** every non-empty output PMID SHALL be one of `111`, `222`, or `333`, and each bibliographic field SHALL match its corresponding fixture record

### Requirement: Source-supported claim extraction

The `claim` field SHALL contain a sentence copied from the retained abstract. If an abstract is absent, `claim` SHALL contain the exact PubMed title and `review_status` SHALL be `needs_review`. The extractor MUST NOT paraphrase beyond the retained source text in `claim`.

#### Scenario: Record with an abstract

- **WHEN** a retained abstract contains the sentence `EGFR alterations were associated with response in the study cohort.`
- **THEN** the output `claim` SHALL equal that retained sentence or another complete retained abstract sentence and SHALL NOT contain unsupported additions

#### Scenario: Record without an abstract

- **WHEN** a retained record has a title but no abstract
- **THEN** `claim` SHALL equal the exact title and `review_status` SHALL equal `needs_review`

### Requirement: Conservative evidence type classification

The extractor SHALL classify `evidence_type` only from retained PubMed publication types and explicit source text. Clinical trial publication types SHALL map to `clinical`; review, systematic review, and meta-analysis publication types SHALL map to `review`; explicit observational or cohort design SHALL map to `cohort`; explicit animal, cell-line, or in-vitro design SHALL map to `preclinical`; all other records SHALL map to `unknown`.

#### Scenario: Unmapped publication type

- **WHEN** a retained record lacks a publication type or explicit study-design statement
- **THEN** `evidence_type` SHALL equal `unknown`

### Requirement: Explicit not-found behavior

A valid query with zero retained PubMed records SHALL produce exactly one output row. That row SHALL preserve query provenance, set `evidence_status=not_found`, set `evidence_type=unknown`, set `review_status=pass`, set `claim` to `No PubMed records matched the preserved query as of <query_date>.`, and leave `pmid`, `title`, `year`, `journal`, and `model_inference` empty. A `not_found` row SHALL count as successful processing.

#### Scenario: Zero PubMed results

- **WHEN** the PubMed adapter returns an empty record list for input row 4 with `query_date=2026-07-12`
- **THEN** the extractor SHALL emit one `not_found` row containing `No PubMed records matched the preserved query as of 2026-07-12.` and SHALL exit successfully if all other rows succeed

### Requirement: Source-unavailable failure behavior

If the PubMed adapter cannot complete a request, the extractor SHALL write `source_unavailable`, a UTC timestamp, and retry guidance to stderr. The extractor SHALL exit non-zero and SHALL NOT finalize an evidence CSV.

#### Scenario: PubMed adapter timeout

- **WHEN** the adapter reports a timeout before returning records
- **THEN** the extractor SHALL report `source_unavailable`, include the timestamp and retry guidance, and leave no finalized evidence CSV

### Requirement: Conflicting evidence preservation

When retained PubMed claims for the same gene-disease query express opposing directions for the same outcome, the extractor SHALL preserve each source as a separate row, set `evidence_status=conflicting` on the affected rows, and set `review_status=needs_review`. The extractor MUST NOT collapse conflicting records into one conclusion.

#### Scenario: Opposing fixture claims

- **WHEN** one retained abstract sentence reports increased response and another reports no response for the same gene-disease-outcome context
- **THEN** both source rows SHALL remain in the output with their original PMIDs, `evidence_status=conflicting`, and `review_status=needs_review`

### Requirement: Evidence and model inference separation

The extractor SHALL keep `model_inference` empty by default. If a later explicitly enabled workflow supplies model inference, the extractor SHALL store it only in `model_inference`, MUST NOT copy it into `claim`, MUST NOT use it to assign `evidence_status=supported`, and SHALL set `review_status=needs_review`.

#### Scenario: Inference is supplied separately

- **WHEN** a workflow supplies `model_inference=This result could affect treatment selection`
- **THEN** the source-derived `claim` SHALL remain unchanged and `review_status` SHALL equal `needs_review`

### Requirement: Human review gate

The extractor SHALL set `review_status=needs_review` for `evidence_type=clinical`, `evidence_status=conflicting`, missing abstracts, non-empty `model_inference`, or claims concerning treatment efficacy, resistance, safety, prognosis, or eligibility. A row SHALL receive `review_status=pass` only when none of these conditions is present and the claim is directly traceable to retained PubMed text.

#### Scenario: Therapeutic implication

- **WHEN** a retained abstract sentence describes drug response or resistance
- **THEN** the output row SHALL have `review_status=needs_review` and SHALL NOT contain a treatment recommendation

### Requirement: Deterministic ordering

The extractor SHALL preserve input row order. Within each input row, output rows SHALL preserve PubMed adapter response order. Repeated execution with identical input and identical offline fixtures SHALL produce byte-identical CSV output.

#### Scenario: Two input rows with multiple records

- **WHEN** input row 1 retains PMIDs `111` and `222` and input row 2 retains PMID `333`
- **THEN** output order SHALL be row 1 PMID `111`, row 1 PMID `222`, then row 2 PMID `333`

### Requirement: Reproducible validation fixtures

The implementation SHALL provide offline fixtures for three externally verified PMID records, an empty result, opposing claims, an invalid row, a source failure, a missing abstract, and a high-risk therapeutic claim. The implementation SHALL provide a golden CSV fixing expected columns, row order, values, statuses, and review decisions. The command `uv run pytest -q` SHALL execute all validation checks without network access.

#### Scenario: Complete validation run

- **WHEN** a reviewer runs `uv run pytest -q` with network access disabled
- **THEN** schema validation, PMID membership, exact `not_found` shape, failure behavior, conflict preservation, evidence-inference separation, review gating, deterministic ordering, and golden CSV comparison SHALL all pass
