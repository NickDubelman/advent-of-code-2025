import { puzzleLoader } from '~/utils'

const loadPuzzle = puzzleLoader(import.meta.url)

const input = await loadPuzzle('input.txt')

const [section1, section2] = input.split('\n\n')

const freshRanges: [number, number][] = section1!.split('\n').map(rangeStr => {
  const [start, end] = rangeStr.split('-').map(id => parseInt(id))
  return [start!, end!]
})

const availableIds = section2!.split('\n').map(id => parseInt(id))

let count = 0
for (const id of availableIds) {
  for (let [start, end] of freshRanges) {
    if (start <= id && id <= end) {
      count++
      break
    }
  }
}

console.log(count)
