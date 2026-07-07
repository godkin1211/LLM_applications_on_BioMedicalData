# Seqera AI Task Packet

This prompt is for Seqera AI / Co-Scientist. It is designed for a teaching demo and should not launch cloud jobs.

```bash
seqera ai --headless "
I am teaching a small Nextflow and coding-agent lab.

Please inspect the local files:
- sample_manifest.csv
- scripts/validate_manifest.py
- nextflow/main.nf
- nextflow/nextflow.config

Goals:
- review whether the toy Nextflow scaffold is suitable for a local test-profile demo
- identify likely DSL2, params, channel, or process I/O issues
- suggest a minimal patch plan
- suggest local validation commands

Constraints:
- do not launch cloud runs
- do not modify Seqera Platform workspaces, datasets, or compute environments
- do not assume real patient data
- ask for approval before any external action

Please return:
1. assumptions
2. likely issues
3. minimal patch plan
4. local validation commands
5. what still requires human review
"
```
