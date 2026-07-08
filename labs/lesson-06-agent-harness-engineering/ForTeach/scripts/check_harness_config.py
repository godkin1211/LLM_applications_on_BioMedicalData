#!/usr/bin/env python3
import sys
from pathlib import Path


def parse_scalar(value):
    value = value.strip()
    if value == "true":
        return True
    if value == "false":
        return False
    return value


def parse_simple_yaml(text):
    lines = []
    for raw_line in text.splitlines():
        if not raw_line.strip() or raw_line.lstrip().startswith("#"):
            continue
        indent = len(raw_line) - len(raw_line.lstrip(" "))
        lines.append((indent, raw_line.strip()))

    def parse_block(index, indent):
        if index >= len(lines):
            return {}, index

        is_list = lines[index][1].startswith("- ")
        container = [] if is_list else {}

        while index < len(lines):
            line_indent, line = lines[index]
            if line_indent < indent:
                break
            if line_indent > indent:
                raise ValueError(f"Unexpected indentation near: {line}")

            if is_list:
                if not line.startswith("- "):
                    break
                container.append(parse_scalar(line[2:]))
                index += 1
                continue

            if line.startswith("- "):
                break
            if ":" not in line:
                raise ValueError(f"Unsupported line: {line}")

            key, value = line.split(":", 1)
            key = key.strip()
            value = value.strip()
            index += 1

            if value:
                container[key] = parse_scalar(value)
                continue

            if index < len(lines) and lines[index][0] > line_indent:
                child, index = parse_block(index, lines[index][0])
                container[key] = child
            else:
                container[key] = {}

        return container, index

    parsed, next_index = parse_block(0, lines[0][0] if lines else 0)
    if next_index != len(lines):
        raise ValueError("Could not parse the full file")
    return parsed


def validate(config):
    errors = []
    agent = config.get("agent", {})

    if "./" in agent.get("read_paths", []):
        errors.append("read_paths must not allow the whole project with ./")
    if "./" in agent.get("write_paths", []):
        errors.append("write_paths must not allow the whole project with ./")
    if agent.get("network") is True:
        errors.append("network must use allowed_domains instead of true")

    memory = agent.get("memory", {})
    if memory.get("store_phi") is True:
        errors.append("memory.store_phi must be false")

    logging = agent.get("logging", {})
    if logging.get("enabled") is not True:
        errors.append("logging.enabled must be true")
    if logging.get("redact_phi") is not True:
        errors.append("logging.redact_phi must be true")
    if logging.get("log_full_trajectory") is not True:
        errors.append("logging.log_full_trajectory must be true")

    state = agent.get("state", {})
    if state.get("externalized") is not True:
        errors.append("state.externalized must be true")
    if state.get("track_artifacts") is not True:
        errors.append("state.track_artifacts must be true")
    if state.get("track_verification_records") is not True:
        errors.append("state.track_verification_records must be true")

    observability = agent.get("observability", {})
    if observability.get("component_map") is not True:
        errors.append("observability.component_map must be true")
    if observability.get("experience_summary") is not True:
        errors.append("observability.experience_summary must be true")
    if observability.get("decision_predictions") is not True:
        errors.append("observability.decision_predictions must be true")

    audit = agent.get("audit", {})
    if audit.get("boundary_compliance") is not True:
        errors.append("audit.boundary_compliance must be true")
    if audit.get("execution_fidelity") is not True:
        errors.append("audit.execution_fidelity must be true")
    if audit.get("information_flow") is not True:
        errors.append("audit.information_flow must be true")

    verification = agent.get("verification", {})
    if verification.get("require_citation_for_claims") is not True:
        errors.append("verification.require_citation_for_claims must be true")

    review_triggers = agent.get("human_review_required_if", [])
    if "clinical_action" not in review_triggers:
        errors.append("human_review_required_if must include clinical_action")
    if "contains_phi" not in review_triggers:
        errors.append("human_review_required_if must include contains_phi")

    denied_paths = agent.get("denied_paths", [])
    if "data/phi/" not in denied_paths:
        errors.append("denied_paths must include data/phi/")

    return errors


def main():
    if len(sys.argv) != 2:
        print("Usage: check_harness_config.py <config.yaml>", file=sys.stderr)
        return 2

    path = Path(sys.argv[1])
    try:
        config = parse_simple_yaml(path.read_text(encoding="utf-8"))
    except Exception as exc:
        print(f"Could not parse config: {exc}", file=sys.stderr)
        return 2

    errors = validate(config)
    if errors:
        print("FAILED")
        for error in errors:
            print(f"- {error}")
        return 1

    print("OK: harness config passed safety checks")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
