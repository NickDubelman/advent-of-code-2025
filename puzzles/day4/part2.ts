import { puzzleLoader } from '~/utils'

const loadPuzzle = puzzleLoader(import.meta.url)

const input = await loadPuzzle('input.txt')

// Parse the input into a 2d list that represents a map of the room
const grid = input.split('\n').map(line => line.split(''))

class RoomMap {
  constructor(private grid: string[][]) {}

  isCorner([rowIndex, colIndex]: [number, number]) {
    const corners = [
      [0, 0], // Top-left
      [0, this.grid[0]!.length - 1], // Top-right
      [this.grid.length - 1, 0], // Bottom-left
      [this.grid.length - 1, this.grid[0]!.length - 1], // Bottom-right
    ]

    for (const [row, col] of corners) {
      if (rowIndex === row && colIndex === col) {
        return true
      }
    }

    return false
  }

  isValidCoord([rowIndex, colIndex]: [number, number]) {
    if (rowIndex < 0 || colIndex < 0) {
      return false
    }

    if (rowIndex >= this.grid.length) {
      return false
    }

    if (colIndex >= this.grid[0]!.length) {
      return false
    }

    return true
  }

  getCoord([rowIndex, colIndex]: [number, number]) {
    return this.grid[rowIndex]![colIndex]
  }

  setCoord([rowIndex, colIndex]: [number, number], value: '.' | '@') {
    this.grid[rowIndex]![colIndex] = value
  }

  countAdjacentPaper([rowIndex, colIndex]: [number, number]) {
    const toCheck: [number, number][] = [
      [-1, 0], // Above
      [0, 1], // Right
      [1, 0], // Below
      [0, -1], // Left

      [-1, -1], // Top-left corner
      [-1, 1], // Top-right corner
      [1, 1], // Bottom-right corner
      [1, -1], // Bottom-left corner
    ]

    let count = 0

    for (const [rowDelta, colDelta] of toCheck) {
      const coord: [number, number] = [rowIndex + rowDelta, colIndex + colDelta]
      if (!this.isValidCoord(coord)) {
        continue
      }

      if (this.getCoord(coord) === '@') {
        count++
      }
    }

    return count
  }

  isLocationAccessible(coord: [number, number]) {
    if (this.getCoord(coord) !== '@') {
      // Only locations that have a roll of paper are accessible
      return false
    }

    // If the roll of paper is in a corner, it is guaranteed to be accessible
    // Otherwise, it is accessible if there is less than 4 paper adjacent to it
    return this.isCorner(coord) || this.countAdjacentPaper(coord) < 4
  }

  clearAccessibleLocations() {
    let removedCount = 0

    this.grid.forEach((line, i) => {
      line.forEach((_, j) => {
        if (this.isLocationAccessible([i, j])) {
          this.setCoord([i, j], '.')
          removedCount++
        }
      })
    })

    return removedCount
  }
}

const roomMap = new RoomMap(grid)
let total = 0

let removedCount = 0
do {
  removedCount = roomMap.clearAccessibleLocations()
  total += removedCount
} while (removedCount > 0)

console.log(total)
