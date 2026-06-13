#!/usr/bin/env bash
# PostToolUse hook: Automatically format files with Prettier after Edit/Write operations
# This ensures consistent code formatting across the project

set -euo pipefail

# Read the hook input JSON from stdin
input=$(cat)

# Extract the file path (try both possible locations)
file_path=$(echo "$input" | jq -r '.tool_response.filePath // .tool_input.file_path // empty')

# If no file path, exit silently
if [[ -z "$file_path" ]]; then
  exit 0
fi

# Check if the file exists
if [[ ! -f "$file_path" ]]; then
  exit 0
fi

# Get file extension
extension="${file_path##*.}"

# Only format files that Prettier typically handles
case "$extension" in
  ts|tsx|js|jsx|json|css|scss|html|md|yaml|yml)
    # Find the nearest directory with package.json to run pnpm from correct context
    current_dir=$(dirname "$file_path")

    # Navigate up to find package.json
    while [[ "$current_dir" != "/" ]]; do
      if [[ -f "$current_dir/package.json" ]]; then
        cd "$current_dir"

        # Run prettier with suppressed output
        if pnpm prettier --write "$file_path" 2>/dev/null; then
          # Success - output a subtle confirmation
          echo '{"systemMessage": "✓ Formatted with Prettier", "suppressOutput": true}'
        fi
        exit 0
      fi
      current_dir=$(dirname "$current_dir")
    done

    # If no package.json found, try from the file's directory
    cd "$(dirname "$file_path")"
    pnpm prettier --write "$file_path" 2>/dev/null || true
    ;;
  *)
    # Not a file type we format - exit silently
    exit 0
    ;;
esac
