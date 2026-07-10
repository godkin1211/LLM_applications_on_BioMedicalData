# LLM Applications on BioMedical Data

Course materials for a summer workshop on AI agents and LLM-based workflows for biomedical data applications.

The course is designed for undergraduate students, graduate students, and biomedical researchers who want to use AI agents responsibly in research workflows.

## Completed slide decks

| File | Topic | Session role |
| --- | --- | --- |
| `slides/course-introduction-ai-agent-biomedical-workflow.pptx` | Course introduction | Opening session; scope, expectations, and biomedical workflow framing |
| `slides/lesson-02-ai-agents-vibe-coding-desktop-utilities.pptx` | Introduction to AI agents, vibe coding, and desktop utilities | Agent concepts, workflow thinking, and practical desktop-agent use |
| `slides/lesson-03-llm-basics-for-agent-users.pptx` | LLM basics for agent users | Tokens, context, embeddings, hallucination, tool use, reproducibility, and task specs |
| `slides/lesson-04-desktop-agent-literature-evidence-workflow-animated.pptx` | Desktop agent literature evidence workflow | 40-slide animated lesson covering reproducible search, source triage, evidence tables, citation checks, and research notes |
| `slides/lesson-05-biomedical-evidence-table-hands-on.pptx` | Biomedical evidence table hands-on | Hands-on task spec, evidence table validation, and research-note workflow |
| `slides/lesson-10-biomedical-hackathon-briefing.pptx` | Biomedical hackathon briefing | Day 3 briefing covering challenge tracks, scope rules, artifacts, evaluation, scoring, and demo format |

## Repository layout

- `docs/`: Course syllabus and written teaching plans.
- `demos/`: Demo task packets, prompts, source inventories, evidence tables, and research notes.
- `slides/`: PowerPoint decks for teaching.
- `scripts/presentations/`: Source scripts used to generate the current slide decks.

The presentation scripts require the OpenAI artifact presentation runtime used during deck generation.

## Course syllabus

- `docs/course-syllabus.md`: Detailed three-day syllabus, session-level teaching plan, lab outputs, harness engineering module, loop engineering module, and hackathon rubric.
- `docs/supplement-baoyu-agent-practices.md`: Supplemental reading and classroom activities based on Baoyu's public LLM / agent practice notes.

## Current design direction

The decks use a restrained teaching-workshop style:

- off-white background, dark ink text, and compact explanatory layouts
- indigo for LLM/model concepts
- teal for tools, databases, and biomedical data
- amber for verification and human review
- coral for risk and failure modes

The instructional emphasis is not on prompt tricks. The course frames AI agents as auditable workflows: model calls, tools, state, evidence, checks, and human review.

## Status

The first five Day 1 slide decks have been generated and visually checked for text overflow and layout issues.
