## 1. Project and schema foundation

- [ ] 1.1 Create the installable Python package and `pubmed-evidence extract --input <queries.csv> --output <evidence.csv>` command in `pyproject.toml` and `src/pubmed_evidence_extractor/cli.py`; verify that `uv run pubmed-evidence --help` exits successfully and lists the required extract arguments.
- [ ] 1.2 Implement Closed and validated input schema plus Fail-fast batch validation in `src/pubmed_evidence_extractor/models.py`; verify with tests named `test_valid_input_defaults_max_records`, `test_invalid_input_aborts_batch`, and `test_undeclared_column_is_rejected`.
- [ ] 1.3 Implement CSV input and evidence output contracts and Fixed evidence output schema with the exact field order and enumerated values; verify with `test_output_header_is_exact` and schema assertions against `tests/fixtures/golden_evidence.csv`.

## 2. PubMed retrieval and evidence extraction

- [ ] 2.1 Implement PubMed source boundary and adapter together with PubMed-only evidence boundary in `src/pubmed_evidence_extractor/pubmed.py`; verify with `test_adapter_accepts_only_pubmed_records` and a test proving non-PubMed content is ignored.
- [ ] 2.2 Implement Deterministic PubMed query provenance so original values and the exact executed Title/Abstract query are preserved; verify with `test_query_string_and_original_values_are_preserved`.
- [ ] 2.3 Implement Source-unavailable failure behavior so adapter timeout writes the required status, UTC timestamp, and retry guidance without finalizing output; verify with `test_source_unavailable_leaves_no_output`.
- [ ] 2.4 Implement PMID and bibliographic traceability plus Source-supported claim extraction in `src/pubmed_evidence_extractor/extract.py`; verify with `test_pmid_and_metadata_match_fixture_record`, `test_claim_is_retained_abstract_sentence`, and `test_missing_abstract_uses_exact_title`.
- [ ] 2.5 Implement Conservative evidence type classification from retained publication types and explicit source text; verify every allowed mapping and the `unknown` fallback with `test_evidence_type_mapping`.

## 3. Status, conflict, and review policy

- [ ] 3.1 Implement Deterministic status rows and Explicit not-found behavior so an empty result produces exactly one successful provenance-preserving row; verify the complete row against `test_not_found_row_matches_contract`.
- [ ] 3.2 Implement Conflicting evidence preservation without collapsing opposing PubMed records; verify both PMIDs remain separate with `conflicting` and `needs_review` in `test_conflicting_records_are_preserved`.
- [ ] 3.3 Implement Evidence and inference separation, Evidence and model inference separation, and Human review gate so source claims remain unchanged and every high-risk condition receives `needs_review`; verify with `test_inference_never_changes_claim` and parameterized `test_human_review_gate`.
- [ ] 3.4 Implement Deterministic ordering across input rows and adapter records; verify repeated fixture runs are byte-identical with `test_output_order_and_bytes_are_deterministic`.

## 4. Fixture-first validation and acceptance

- [ ] 4.1 Build Fixture-first validation and Reproducible validation fixtures in `tests/fixtures/pubmed_records.json`, `tests/fixtures/queries.csv`, and `tests/fixtures/golden_evidence.csv`; verify fixture coverage includes three externally verified PMIDs, empty results, opposing claims, invalid input, source failure, missing abstract, and a therapeutic claim.
- [ ] 4.2 Add end-to-end tests in `tests/test_pubmed_evidence_extractor.py` covering every requirement scenario and the CLI exit contract; verify `uv run pytest -q` passes with network access disabled and performs an exact golden CSV comparison.
- [ ] 4.3 Review the implementation against `openspec/changes/pubmed-evidence-extractor/specs/pubmed-evidence-extraction/spec.md` and confirm no clinical recommendation, non-PubMed evidence, inferred PMID, or silent conflict resolution is present; verify with a completed acceptance checklist and a final `uv run pytest -q` run.
