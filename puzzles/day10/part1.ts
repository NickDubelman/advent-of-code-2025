import { puzzleLoader } from '~/utils'

const loadPuzzle = puzzleLoader(import.meta.url)

const input = await loadPuzzle('input.txt')

// Button is a list of numbers where each number is an index to toggle
type Button = number[]

type Machine = {
  indicators: (0 | 1)[]
  buttons: Button[]
}

// Parse the input into a list of machines
const machines: Machine[] = input.split('\n').map(line => {
  const split = line.split(' ')

  const rawIndicatorStr = split[0]!

  // Indicator str always starts and ends with [] - chop off first and last char
  const indicators = [...rawIndicatorStr.slice(1, rawIndicatorStr.length - 1)].map(str => {
    if (str === '.') {
      return 0
    } else {
      return 1
    }
  })

  const buttons = split.slice(1, split.length - 1).map(rawButtonStr => {
    // Button str always start and ends with () - chop off first and last char
    const button: Button = rawButtonStr
      .slice(1, rawButtonStr.length - 1)
      .split(',')
      .map(str => parseInt(str))

    return button
  })

  return { indicators, buttons }
})

const sum = machines.map(solveMachine).reduce((acc, curr) => acc + curr, 0)
console.log(sum)

function solveMachine(machine: Machine) {
  const wantStr = machine.indicators.join(',')

  let i = 1
  while (true) {
    // Try every possible combination of size {i} to see if it solves the machine
    const combos = getAllCombinations(machine.buttons, i)

    // Check each combo
    for (const combo of combos) {
      // Initialize state to all 0s
      const state = machine.indicators.map(() => 0)

      // For this combo, press each button and update the state
      for (const button of combo) {
        for (const num of button) {
          // Toggle state
          state[num] = state[num] === 0 ? 1 : 0
        }
      }

      if (wantStr === state.join(',')) {
        // This combo is a solution
        return i
      }
    }

    // None of the combos worked, try more button presses
    i++
  }
}

// NOTE: Had help from ChatGPT to write this helper
function getAllCombinations(buttons: Button[], numPresses: number) {
  const result: Button[][] = []

  function backtrack(startIndex: number, combo: Button[]) {
    if (combo.length === numPresses) {
      result.push([...combo])
      return
    }

    for (let i = startIndex; i < buttons.length; i++) {
      combo.push(buttons[i]!)
      backtrack(i, combo)
      combo.pop()
    }
  }

  backtrack(0, [])
  return result
}
