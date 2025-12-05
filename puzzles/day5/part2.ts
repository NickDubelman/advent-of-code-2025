import { puzzleLoader } from '~/utils'

const loadPuzzle = puzzleLoader(import.meta.url)

const input = await loadPuzzle('input.txt')

const [section1] = input.split('\n\n')

const freshRanges: [number, number][] = section1!.split('\n').map(rangeStr => {
  const [start, end] = rangeStr.split('-').map(id => parseInt(id))
  return [start!, end!]
})

// Sort the ranges by their start range
freshRanges.sort((a, b) => (a[0] < b[0] ? -1 : 1))

// Find overlapping ranges and consolidate them
let consolidated: [number, number][] = []

for (let i = 0; i < freshRanges.length; i++) {
  if (i === 0) {
    // Just add the first range
    consolidated.push(freshRanges[i]!)
    continue
  }

  const [lastStart, lastEnd] = consolidated[consolidated.length - 1]!
  const [currStart, currEnd] = freshRanges[i]!

  // For each range, check if the last one has an end that is >= this range's start
  if (lastEnd >= currStart) {
    // Overlapping ranges
    // Update the end of the last range to have max(lastEnd, currEnd)
    const newMax = Math.max(lastEnd, currEnd)
    consolidated[consolidated.length - 1] = [lastStart, newMax]
  } else {
    // New distinct range
    consolidated.push(freshRanges[i]!)
  }
}

// Now that we've consolidated the ranges, we can just use subtraction and addition 🧮 🤓
const count = consolidated.reduce((acc, curr) => {
  const [start, end] = curr
  const numFresh = end - start + 1
  return acc + numFresh
}, 0)

console.log(count)
