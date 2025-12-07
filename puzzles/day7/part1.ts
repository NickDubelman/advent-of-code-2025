import { puzzleLoader } from '~/utils'

const loadPuzzle = puzzleLoader(import.meta.url)

const input = await loadPuzzle('input.txt')

const grid = input.split('\n').map(line => line.split(''))

// The first line has an S somewhere
const startIndex = grid[0]!.indexOf('S')

// Use a set to keep of track of where beams are
class BeamSet {
  private locations: Set<string>

  constructor(coord?: [number, number]) {
    this.locations = coord ? new Set([BeamSet.asStr(coord)]) : new Set()
  }

  // Make BeamSet iterable
  *[Symbol.iterator]() {
    for (const l of this.locations) {
      const nums = l.split(',').map(str => parseInt(str))
      const coord: [number, number] = [nums[0]!, nums[1]!]
      yield coord
    }
  }

  static asStr([row, col]: [number, number]) {
    return `${row},${col}`
  }

  has(coord: [number, number]) {
    return this.locations.has(BeamSet.asStr(coord))
  }

  add(coord: [number, number]) {
    this.locations.add(BeamSet.asStr(coord))
  }
}

let beamLocations = new BeamSet([0, startIndex])

let count = 0

// Start at top row and iterate downards (no need to do anything for the last row)
for (let i = 0; i < grid.length - 1; i++) {
  const newBeamLocations = new BeamSet()

  for (let [beam_row, beam_col] of beamLocations) {
    // For each beam location, move it down or split depending on what is directly below
    const below_row = beam_row + 1
    if (grid[below_row]![beam_col]! === '.') {
      newBeamLocations.add([below_row, beam_col])
    }

    if (grid[below_row]![beam_col]! === '^') {
      count += 1
      newBeamLocations.add([below_row, beam_col - 1])
      newBeamLocations.add([below_row, beam_col + 1])
    }
  }

  beamLocations = newBeamLocations
}

console.log(count)
