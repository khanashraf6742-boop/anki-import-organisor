#!/usr/bin/env bash
#
# Install the agent library into a coding tool's agent directory.
#
# Usage:
#   ./scripts/install.sh --tool claude-code [--category <name>] [--dest <path>]
#
# Examples:
#   ./scripts/install.sh --tool claude-code
#   ./scripts/install.sh --tool claude-code --category engineering
#   ./scripts/install.sh --tool claude-code --dest /custom/path/agents

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CATEGORIES=(engineering product design marketing data)

TOOL=""
CATEGORY=""
DEST=""

usage() {
  echo "Usage: $0 --tool <claude-code> [--category <${CATEGORIES[*]}>] [--dest <path>]"
  exit 1
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --tool)
      TOOL="$2"
      shift 2
      ;;
    --category)
      CATEGORY="$2"
      shift 2
      ;;
    --dest)
      DEST="$2"
      shift 2
      ;;
    -h|--help)
      usage
      ;;
    *)
      echo "Unknown argument: $1" >&2
      usage
      ;;
  esac
done

if [[ -z "$TOOL" ]]; then
  echo "Error: --tool is required" >&2
  usage
fi

case "$TOOL" in
  claude-code)
    DEST="${DEST:-$HOME/.claude/agents}"
    ;;
  *)
    echo "Error: unsupported tool '$TOOL' (supported: claude-code)" >&2
    exit 1
    ;;
esac

if [[ -n "$CATEGORY" ]]; then
  if [[ ! -d "$REPO_ROOT/$CATEGORY" ]]; then
    echo "Error: unknown category '$CATEGORY' (available: ${CATEGORIES[*]})" >&2
    exit 1
  fi
  SOURCE_DIRS=("$REPO_ROOT/$CATEGORY")
else
  SOURCE_DIRS=()
  for cat in "${CATEGORIES[@]}"; do
    SOURCE_DIRS+=("$REPO_ROOT/$cat")
  done
fi

mkdir -p "$DEST"

installed=0
for dir in "${SOURCE_DIRS[@]}"; do
  [[ -d "$dir" ]] || continue
  for file in "$dir"/*.md; do
    [[ -e "$file" ]] || continue
    cp "$file" "$DEST/"
    installed=$((installed + 1))
  done
done

echo "Installed $installed agent(s) to $DEST"
