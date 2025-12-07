#!/usr/bin/env bash

set -euo pipefail

# Find puzzle day folders matching day<number>
days=(./puzzles/day[0-9]*)

# Handle case where no day directories exist
if [[ ${#days[@]} -eq 0 || ${days[0]} == "./puzzles/day[0-9]*" ]]; then
  echo "No day folders found in ./puzzles" >&2
  exit 1
fi

# Extract numeric suffixes, find max, and compute next day
max_day=0
for dir in "${days[@]}"; do
  base=$(basename "$dir")
  num=${base#day}
  if [[ $num =~ ^[0-9]+$ && $num -gt $max_day ]]; then
    max_day=$num
  fi
done

next_day=$((max_day + 1))
next_dir="./puzzles/day${next_day}"

echo "Highest day: $max_day"
echo "Creating: $next_dir"

mkdir -p "$next_dir"

cat >"$next_dir/part1.ts" <<'EOF'
import { puzzleLoader } from '~/utils'

const loadPuzzle = puzzleLoader(import.meta.url)

const input = await loadPuzzle('example.txt')
EOF

cat >"$next_dir/part2.ts" <<'EOF'
import { puzzleLoader } from '~/utils'

const loadPuzzle = puzzleLoader(import.meta.url)

const input = await loadPuzzle('example.txt')
EOF

touch "$next_dir/example.txt" "$next_dir/input.txt"

echo "Created files in $next_dir"
