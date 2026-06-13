#!/usr/bin/env bash
# PreToolUse hook: Block reading of .env files for security
# This hook prevents Claude from accidentally reading sensitive environment files

set -euo pipefail

# Read the hook input JSON from stdin
input=$(cat)

# Extract the file path from the tool input
file_path=$(echo "$input" | jq -r '.tool_input.file_path // empty')

# If no file path, allow (not a file read operation)
if [[ -z "$file_path" ]]; then
  echo '{"continue": true}'
  exit 0
fi

# Get the basename of the file
filename=$(basename "$file_path")

# Check if the filename matches .env patterns
if [[ "$filename" =~ ^\.env($|\.) ]]; then
  # Block the operation
  jq -n '{
    continue: false,
    stopReason: "Reading .env files is blocked for security. These files contain secrets and should not be accessed.",
    systemMessage: "🛑 Security: Blocked reading of .env file",
    hookSpecificOutput: {
      hookEventName: "PreToolUse",
      additionalContext: "The file \($file_path) matches .env pattern and is blocked by security policy."
    }
  }' --arg file_path "$file_path"
  exit 0
fi

# Allow the operation
echo '{"continue": true}'
