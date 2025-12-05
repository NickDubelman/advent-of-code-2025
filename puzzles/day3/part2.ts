import { puzzleLoader } from '~/utils'

const loadPuzzle = puzzleLoader(import.meta.url)

const input = await loadPuzzle('input.txt')

const parsed = input.split('\n').map(line => line.split('').map(char => parseInt(char)))

// In part 2, we have 12 digits instead of 2 digits
// We need to find the max with 11+ digits after it, we lock that in as 1st digit
// Then we need to find the max with 10+ digits after it ONLY considering the nums AFTER the 1st digit
// And so on until we have all digits

let sum = 0

for (let line of parsed) {
  sum += getMaxJoltage(line)
}

console.log(sum)

// Find the max digit that has at least {i} digits after it
// Return the max digit and the tail
//
// (987654321111111, 11, []) -> (9, 87654321111111)
// (87654321111111, 10, [9]) -> (8, 7654321111111)
// (7654321111111, 9, [9, 8]) -> (7, 654321111111)
// ...
// (11111, 1, [9876543211]) -> (1, [1111])
// (1111, 0, [98765432111]) -> (1, [])
function getMaxJoltage(inputDigits: number[]) {
  const resultDigits = []

  // 11..0
  for (let tailLength = 11; tailLength >= 0; tailLength--) {
    // Chop-off any elements that have less than {tailLength} digits after
    const consider = inputDigits.slice(0, inputDigits.length - tailLength)

    // What is the max of the digits to consider?
    const maxDigit = Math.max(...consider)

    resultDigits.push(maxDigit)

    if (tailLength == 0) {
      // We've found all the result digits
      break
    }

    const earliestIndexWithMax = inputDigits.indexOf(maxDigit)

    // Tail is everything after the earliest max
    const tail = inputDigits.slice(earliestIndexWithMax + 1)
    inputDigits = tail
  }

  let resultJoltage = 0
  for (const d of resultDigits) {
    resultJoltage = resultJoltage * 10 + d
  }

  return resultJoltage
}
