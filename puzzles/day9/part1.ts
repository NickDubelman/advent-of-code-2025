import { puzzleLoader } from '~/utils'

const loadPuzzle = puzzleLoader(import.meta.url)

const input = await loadPuzzle('input.txt')

type Coord = [number, number]

const coords: Coord[] = input.split('\n').map(line => {
  const [x, y] = line.split(',').map(str => parseInt(str))
  return [x!, y!]
})

let max = 0

for (let i = 0; i < coords.length; i++) {
  for (let j = i + 1; j < coords.length; j++) {
    const area = computeArea(coords[i]!, coords[j]!)
    if (area > max) {
      max = area
    }
  }
}

console.log(max)

function computeArea([x1, y1]: Coord, [x2, y2]: Coord) {
  return (Math.abs(x1 - x2) + 1) * (Math.abs(y1 - y2) + 1)
}
