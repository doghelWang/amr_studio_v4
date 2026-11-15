#!/usr/bin/env bash
# usage: scripts/log.sh "<stage>" "<what happened>"  — appends a timestamped row to docs/PROGRESS.md
printf '| %s | %s | %s |\n' "$(TZ=America/Los_Angeles date '+%Y-%m-%d %H:%M')" "$1" "$2" >> "$(dirname "$0")/../docs/PROGRESS.md"
