import { puzzleLoader } from '~/utils'

const loadPuzzle = puzzleLoader(import.meta.url)

const input = await loadPuzzle('input.txt')

const lines = input.split('\n')
const numberLines = lines.slice(0, lines.length - 1)
const opLineStr: string = lines[lines.length - 1]!

// We can use the operation line to determine the start and indices of each column
const columnIndexRanges: { start: number; end: number; op: string }[] = []
let startIndex = 0
for (let i = 0; i < opLineStr.length; i++) {
  if (opLineStr[i] !== ' ' && i !== 0) {
    // We've reached the end of a range
    columnIndexRanges.push({
      start: startIndex,
      end: i - 2,
      op: opLineStr[startIndex]!,
    })

    startIndex = i
  } else if (i === opLineStr.length - 1) {
    // We've reached the end of a line
    columnIndexRanges.push({
      start: startIndex,
      end: opLineStr.length - 1,
      op: opLineStr[startIndex]!,
    })
  }
}

let sum = 0

// Compute column-by-column
for (const { start, end, op } of columnIndexRanges) {
  // Start at 1 if * and 0 if +
  let result = op === '*' ? 1 : 0

  // Iterate from right-to-left (end -> start)
  for (let i = end; i >= start; i--) {
    let num = 0

    // Iterate through lines from top-to-bottom
    for (const line of numberLines) {
      if (line[i] !== ' ') {
        // Accumulate digits
        num = num * 10 + parseInt(line[i]!)
      }
    }

    if (op === '+') {
      result += num
    }

    if (op === '*') {
      result *= num
    }
  }

  sum += result
}

console.log(sum)
