#!/usr/bin/env bash
set -u

cd "$(dirname "$0")"

printf "\n=== Demo 1: harness floor ===\n"
bash harness_floor_template/biomed-loop/run.sh

printf "\n=== Demo 2: safe config should pass ===\n"
python3 scripts/check_harness_config.py harness_config.safe.yaml

printf "\n=== Demo 3: unsafe config should fail with teachable errors ===\n"
if python3 scripts/check_harness_config.py harness_config.unsafe.yaml; then
  printf "Unexpected: unsafe config passed.\n"
  exit 1
else
  printf "\nExpected failure: the validator caught unsafe harness settings.\n"
fi

printf "\nDemo finished.\n"

