import { puzzleLoader } from '~/utils'

const loadPuzzle = puzzleLoader(import.meta.url)

const input = await loadPuzzle('input.txt')

type Coord = [number, number, number]

const coords = input.split('\n').map(coordFromStr)

const distances: { d: number; p: Coord; q: Coord }[] = []

// Compare every coordinate against every other coordinate and compute the distance between them
for (let i = 0; i < coords.length; i++) {
  for (let j = i + 1; j < coords.length; j++) {
    const [p, q] = [coords[i]!, coords[j]!]
    distances.push({ d: distance(p, q), p, q })
  }
}

// Sort distances ascending (lowest first)
distances.sort((a, b) => a.d - b.d)

let nextCircuitId = 1
const circuits = new Map<number, Set<string>>()

for (let { p, q } of distances) {
  const [pStr, qStr] = [coordToStr(p), coordToStr(q)]

  // Check if p or q already belong to any circuits
  let pCircuit: Set<string> | undefined
  let qCircuit: Set<string> | undefined

  for (let circuit of circuits.values()) {
    const [hasP, hasQ] = [circuit.has(pStr), circuit.has(qStr)]

    if (hasP && hasQ) {
      pCircuit = circuit
      qCircuit = circuit
      break
    }

    if (hasP) {
      pCircuit = circuit
    }

    if (hasQ) {
      qCircuit = circuit
    }
  }

  // Keep track of which circuit was added to (if any)
  let modifiedCircuit: Set<string> | undefined

  if (pCircuit && qCircuit) {
    // Both have a circuit, need to merge them together
    // If they are already part of the same circuit, we don't need to do anything
    if (pCircuit !== qCircuit) {
      const merged = pCircuit.union(qCircuit)
      pCircuit.clear()
      qCircuit.clear()
      circuits.set(nextCircuitId++, merged)
      modifiedCircuit = merged
    }
  } else if (pCircuit) {
    // Only P has a circuit, need to add Q to it
    pCircuit.add(qStr)
    modifiedCircuit = pCircuit
  } else if (qCircuit) {
    // Only Q has a circuit, need to add P to it
    qCircuit.add(pStr)
    modifiedCircuit = qCircuit
  } else {
    // Neither has a circuit, need to create a new one
    circuits.set(nextCircuitId++, new Set([pStr, qStr]))
  }

  // If a circuit was added to (or merged), check if it has all of the coordinates in it
  if (modifiedCircuit?.size === coords.length) {
    // If the circuit has all the coordinates in it, we've connected everything
    console.log(p[0] * q[0]) // Result is p1 * q1
    break
  }
}

// ------------------------- Helpers -------------------------

// sqrt((p1 - q1)^2 + (p2 - q2)^2 + (p3 - q3)^2)
function distance([p1, p2, p3]: Coord, [q1, q2, q3]: Coord) {
  const d1 = (p1 - q1) ** 2
  const d2 = (p2 - q2) ** 2
  const d3 = (p3 - q3) ** 2

  return Math.sqrt(d1 + d2 + d3)
}

function coordToStr([x, y, z]: Coord) {
  return `${x},${y},${z}`
}

function coordFromStr(str: string): Coord {
  const [x, y, z] = str.split(',').map(str => parseInt(str))
  return [x!, y!, z!]
}
