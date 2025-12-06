import { puzzleLoader } from '~/utils'

const loadPuzzle = puzzleLoader(import.meta.url)

const input = await loadPuzzle('input.txt')

const lines = input.split('\n')

const numberLines = lines
  .slice(0, lines.length - 1)
  .map(line => (line.match(/\S+/g) || []).map(str => parseInt(str)))

const opLine: string[] = lines[lines.length - 1]!.match(/\S+/g) || []

const opCount = opLine.length

let sum = 0

for (let i = 0; i < opCount; i++) {
  const op = opLine[i]

  // Start at 1 if * and 0 if +
  let result = op === '*' ? 1 : 0

  for (let j = 0; j < numberLines.length; j++) {
    if (op === '+') {
      result += numberLines[j]![i]!
    }

    if (op === '*') {
      result *= numberLines[j]![i]!
    }
  }

  sum += result
}

console.log(sum)
