import { puzzleLoader } from '~/utils'

const loadPuzzle = puzzleLoader(import.meta.url)

const input = await loadPuzzle('input.txt')

const grid = input.split('\n').map(line => line.split(''))

// The first line has an S somewhere
const startIndex = grid[0]!.indexOf('S')

// Our algorithm is to recursively find how many reachable splitters there are from each splitter
// We start at the top and go towards the bottom
// Each reachable splitter introduces 1 new possible path
// In order to make this run in a reasonable time, need to memoize results (dynamic programming)

const memoCache = new Map<string, number>()
const count = 2 + countReachableSplitters(grid, [2, startIndex], memoCache)
console.log(count)

type Coord = [number, number]

function countReachableSplitters(
  grid: string[][],
  [row, col]: Coord,
  memoCache: Map<string, number>
): number {
  // Base case: row is the second to last line
  if (row === grid.length - 2) {
    return 0
  }

  // Check if we've already solved this problem
  let solution = memoCache.get(`${row},${col}`)
  if (solution) {
    return solution
  }

  // Find the reachable splitters from {coord}
  const nextSplitterRow = row + 2
  const reachableSplitters: [number, number][] = []

  let [leftBlocked, rightBlocked] = [false, false]
  for (let i = nextSplitterRow; i < grid.length - 1; i++) {
    // For each row below
    if (grid[i]![col - 1]! === '^' && !leftBlocked) {
      reachableSplitters.push([i, col - 1])
      leftBlocked = true
    }

    if (grid[i]![col + 1]! === '^' && !rightBlocked) {
      reachableSplitters.push([i, col + 1])
      rightBlocked = true
    }

    if (leftBlocked && rightBlocked) {
      break
    }
  }

  solution =
    reachableSplitters.length +
    reachableSplitters
      .map(coord => countReachableSplitters(grid, coord, memoCache))
      .reduce((acc, curr) => acc + curr, 0)

  memoCache.set(`${row},${col}`, solution)
  return solution
}
