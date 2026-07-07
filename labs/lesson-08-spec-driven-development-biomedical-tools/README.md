# Lesson 08 Lab: Spec-driven development for biomedical tools

This lab provides a lightweight spec-driven development package for biomedical tools.

## Learning goal

Students should learn to turn a vague biomedical tool request into a `SPEC.md` that a coding agent can implement and a reviewer can verify.

## Files

- `templates/biomedical-tool-spec-template.md`: reusable `SPEC.md` template.
- `examples/pubmed-evidence-extractor/SPEC.md`: spec for a PubMed evidence table extractor.
- `examples/gene-list-annotation-tool/SPEC.md`: spec for a gene list annotation tool.
- `examples/clinical-trial-summarizer/SPEC.md`: spec for a clinical trial summarizer.
- `prompts/create_spec_prompt.md`: prompt for asking an agent to draft a spec.
- `prompts/implement_from_spec_prompt.md`: prompt for asking an agent to implement from a spec.
- `prompts/spectra_demo_prompt.md`: classroom demo prompt for a Spectra-style workflow.

## Suggested classroom use

1. Pick one example tool.
2. Ask students to identify missing clarification questions.
3. Ask students to edit the spec template.
4. Ask a coding agent to create an implementation plan, but not code yet.
5. Review whether the implementation plan satisfies the spec.
6. Optionally run the Spectra demo prompt to show `discuss -> propose -> apply -> ingest`.

## Safety boundaries

- Do not use real patient identifiers.
- Do not let an agent generate clinical recommendations.
- Do not accept PubMed IDs, trial IDs, gene IDs, or evidence claims without external validation.
- Treat `not_found` and `needs_review` as valid outputs, not failures.
