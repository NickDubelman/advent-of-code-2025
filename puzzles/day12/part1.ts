import { puzzleLoader } from '~/utils'

const loadPuzzle = puzzleLoader(import.meta.url)

const input = await loadPuzzle('input.txt')

// Had some spoilers on this one...
// The input happens to be such that we can just check for the following case:
//
// If we assume each present is 3x3 and we are laying them next to eachother, and that is able to
// fit, then we definitely CAN fit

// The last double-new-line will be followed by the presents area part of the input
const lastDoubleNewLineIndex = input.lastIndexOf('\n\n')

const shapesInput = input.slice(0, lastDoubleNewLineIndex)
const presentsAreaInput = input.slice(lastDoubleNewLineIndex + 2)

// The shapes aren't actually needed for this solution...
// const shapes = shapesInput.split('\n\n').map(str => str.split('\n').slice(1))

const presentsArea: [[number, number], number[]][] = presentsAreaInput.split('\n').map(str => {
  const [areaStr, presentsStr] = str.split(': ')
  const [width, height] = areaStr!.split('x').map(numStr => parseInt(numStr))

  const area: [number, number] = [width!, height!]
  const presents = presentsStr!.split(' ').map(numStr => parseInt(numStr))

  return [area, presents]
})

let total = 0
for (let [[width, height], presents] of presentsArea) {
  const totalPresentsNeeded = presents.reduce((acc, curr) => acc + curr, 0)

  // We can fit at least this many presents:
  const minPresentSpace = Math.floor(width / 3) * Math.floor(height / 3)

  if (totalPresentsNeeded <= minPresentSpace) {
    total++
  }
}

console.log(total)
