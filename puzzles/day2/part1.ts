import { puzzleLoader } from '~/utils'

const loadPuzzle = puzzleLoader(import.meta.url)

const input = await loadPuzzle('input.txt')

type Range = [string, string]

const ranges: Range[] = input.split(',').map(rangeStr => {
  const split = rangeStr.split('-')
  return [split[0]!, split[1]!]
})

const invalidIds = []

for (let range of ranges) {
  if (!couldRangeHaveSillyNumbers(range)) {
    continue
  }

  const [start, end] = range
  for (let i = parseInt(start); i <= parseInt(end); i++) {
    const numStr = String(i)
    if (isSilly(numStr)) {
      invalidIds.push(numStr)
    }
  }
}

const sum = invalidIds.map(id => parseInt(id)).reduce((acc, curr) => acc + curr, 0)
console.log(sum)

// a number is "silly" if it consists of some sequence of digits repeated twice
function isSilly(numStr: string): boolean {
  // If {numStr} has odd length, it cannot be silly
  if (hasOddLength(numStr)) {
    return false
  }

  // {numStr} is even, divide it into two equal parts and check if they are the same

  // 1010 -> len 4, (0,2), (2)
  // 100100 -> len 6, (0, 3), (3)
  const midpointIndex = numStr.length / 2

  const [first, second] = [numStr.slice(0, midpointIndex), numStr.slice(midpointIndex)]

  return first === second
}

// we don't want to bother checking ranges that could not possibly have any silly numbers
function couldRangeHaveSillyNumbers([start, end]: Range): boolean {
  // If they have same length and this is odd, then there is no even length values between them
  if (start.length === end.length && hasOddLength(start)) {
    return false
  }

  // TODO: Other ways to eliminate?

  return true
}

function hasOddLength(str: string): boolean {
  return str.length % 2 === 1
}
