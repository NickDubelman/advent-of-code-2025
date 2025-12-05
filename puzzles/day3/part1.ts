import { puzzleLoader } from '~/utils'

const loadPuzzle = puzzleLoader(import.meta.url)

const input = await loadPuzzle('input.txt')

const parsed = input.split('\n').map(line => line.split('').map(char => parseInt(char)))

const result: number[] = []

// Iterate over each line
for (const line of parsed) {
  // Mapping of a number to the indices where it is found
  const numToIndices: Map<number, number[]> = new Map()

  const seenNumbers: Set<number> = new Set()

  line.forEach((num, i) => {
    seenNumbers.add(num)
    const existing = numToIndices.get(num) ?? []
    existing.push(i)
    numToIndices.set(num, existing)
  })

  let maxSeen = Math.max(...seenNumbers)

  const maxSeenIndices = numToIndices.get(maxSeen)!

  // Is maxSeen observed more than twice?
  if (maxSeenIndices.length >= 2) {
    const joltage = 10 * maxSeen + maxSeen
    result.push(joltage)
    continue
  }

  // There must be exactly one occurrence of maxSeen
  const maxSeenIndex = maxSeenIndices[0]!

  // Is maxSeen ONLY observed in the last position?
  if (maxSeenIndex === line.length - 1) {
    const onesPlace = maxSeen

    // What is the maxSeen for the rest of the line?
    seenNumbers.delete(maxSeen)
    maxSeen = Math.max(...seenNumbers)

    const joltage = 10 * maxSeen + onesPlace
    result.push(joltage)
    continue
  }

  // maxSeen is observed before the last position...
  // the max joltage is {maxSeen} followed by the next max
  const tensPlace = maxSeen

  // What is the maxSeen for the rest of the line?

  // Need to only consider numbers that have an index after where maxSeen is
  const possibleOnesDigits = numToIndices
    .entries()
    .filter(([_num, indices]) => indices.some(i => i > maxSeenIndex))
    .map(([num]) => num)

  const onesPlace = Math.max(...possibleOnesDigits)

  const joltage = 10 * tensPlace + onesPlace
  result.push(joltage)
}

const sum = result.reduce((acc, curr) => acc + curr, 0)
console.log(sum)
