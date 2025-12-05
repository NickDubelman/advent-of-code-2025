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

  countAccessibleLocations() {
    let count = 0

    this.grid.forEach((line, i) => {
      line.forEach((char, j) => {
        if (char !== '@') {
          // We only care about rolls of paper (@)
          return
        }

        // If the roll of paper is in a corner, it is guaranteed to be accessible
        if (this.isCorner([i, j])) {
          count++
          return
        }

        if (this.countAdjacentPaper([i, j]) < 4) {
          count++
        }
      })
    })

    return count
  }
}

const roomMap = new RoomMap(grid)
const count = roomMap.countAccessibleLocations()
console.log(count)
