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

## Spectra setup

On macOS, install Spectra with `brew install --cask spectra-app`. Windows installers are available from the official Spectra download page. Open a disposable clone, demo branch, or worktree of the course repository in Spectra so generated `openspec/` artifacts do not pollute the teaching branch.

## Suggested classroom use

1. Open the repository in Spectra and confirm the `/spectra:*` skills are available.
2. Pick one example tool.
3. Ask students to identify missing clarification questions.
4. Run `/spectra:discuss`, then inspect the converged scope and non-goals.
5. Run `/spectra:propose` and review proposal, spec, design, and tasks before coding.
6. Run `/spectra:apply` only after the biomedical review gate passes.
7. Introduce one requirement change and use `/spectra:ingest` before resuming implementation.
8. Archive only after artifacts, tests, implementation, and human-review decisions agree.

## Safety boundaries

- Do not use real patient identifiers.
- Do not let an agent generate clinical recommendations.
- Do not accept PubMed IDs, trial IDs, gene IDs, or evidence claims without external validation.
- Treat `not_found` and `needs_review` as valid outputs, not failures.
