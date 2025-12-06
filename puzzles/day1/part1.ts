import { puzzleLoader } from '~/utils'

const loadPuzzle = puzzleLoader(import.meta.url)

const input = await loadPuzzle('input.txt')
const instructions = parseInstructions(input)

let location = 50
let count = 0

for (let instr of instructions) {
  location = moveDial(location, instr)

  if (location === 0) {
    count++
  }
}

console.log(count)

export function parseInstructions(input: string) {
  return input.split('\n').map(line => {
    let dir: 'L' | 'R'
    if (line[0] !== 'L' && line[0] !== 'R') {
      throw new Error(`Invalid input, ${line[0]} is not a valid direction`)
    }
    dir = line[0]

    return { dir, num: parseInt(line.slice(1)) }
  })
}

export interface Instruction {
  dir: 'L' | 'R'
  num: number
}

function moveDial(location: number, instr: Instruction) {
  if (instr.dir === 'R') {
    // R means +
    location = location + instr.num
  } else {
    // L means -
    location = location - instr.num
  }

  while (location > 99) {
    location -= 100
  }

  while (location < 0) {
    location += 100
  }

  return location
}
