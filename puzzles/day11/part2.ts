import { puzzleLoader } from '~/utils'

const loadPuzzle = puzzleLoader(import.meta.url)

const input = await loadPuzzle('input.txt')

const graph: Record<string, string[]> = input
  .split('\n')
  .map(line => {
    const [node, neighborsStr] = line.split(':')
    return {
      node: node!,
      neighbors: neighborsStr!.trim().split(' '),
    }
  })
  .reduce((acc, { node, neighbors }) => {
    acc[node] = neighbors
    return acc
  }, {} as Record<string, string[]>)

// Find every possible path from svr -> out (must go through dac and fft)
// Solution is basically same as part 1 but with memoization

console.log(traverse_dfs('svr', 'out', new Set(), new Map()))

function traverse_dfs(
  node: string,
  destination: string,
  visited: Set<string>,
  memoCache: Map<string, number>
) {
  const seenDac = visited.has('dac')
  const seenFft = visited.has('fft')
  const memoKey = `${node} - ${destination} - ${seenDac ? 1 : 0}${seenFft ? 1 : 0}`

  const memoized = memoCache.get(memoKey)
  if (memoized !== undefined) {
    return memoized
  }

  if (node === destination) {
    const result = seenDac && seenFft ? 1 : 0
    memoCache.set(memoKey, result)
    return result
  }

  // Mark node as visited within the current path we are traversing
  visited.add(node)

  let total = 0
  for (let neighbor of graph[node] ?? []) {
    if (visited.has(neighbor)) {
      continue // already visited
    }

    total += traverse_dfs(neighbor, destination, visited, memoCache)
  }

  // Remove node from visited so other paths can go through the node
  visited.delete(node)

  memoCache.set(memoKey, total)

  return total
}
