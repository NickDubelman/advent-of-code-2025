import { puzzleLoader } from '~/utils'
import { parseInstructions, type Instruction } from './part1'

const loadPuzzle = puzzleLoader(import.meta.url)

const input = await loadPuzzle('input.txt')
const instructions = parseInstructions(input)

let location = 50
let count = 0

for (let instr of instructions) {
  let zeroClicks = 0
  ;[location, zeroClicks] = moveDial(location, instr)

  count += zeroClicks
}

console.log(count)

function moveDial(location: number, instr: Instruction): [number, number] {
  const startedAt0 = location === 0
  let zeroClicks = 0
  if (instr.dir === 'R') {
    // R means +
    location += instr.num
  } else {
    // L means -
    location -= instr.num
  }

  if (location <= 0) {
    if (startedAt0) {
      zeroClicks = Math.floor(-location / 100)
    } else {
      zeroClicks = 1 + Math.floor(-location / 100)
    }
  } else {
    zeroClicks = Math.floor(location / 100)
  }

  while (location > 99) {
    location -= 100
  }

  while (location < 0) {
    location += 100
  }

  return [location, zeroClicks]
}
