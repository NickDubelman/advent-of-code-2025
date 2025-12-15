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

// Find every possible path from you -> out
console.log(traverse_dfs('you', 'out', new Set()))

function traverse_dfs(node: string, destination: string, visited: Set<string>) {
  if (node === destination) {
    return 1
  }

  // Mark node as visited within the current path we are traversing
  visited.add(node)

  let total = 0
  for (let neighbor of graph[node] ?? []) {
    if (visited.has(neighbor)) {
      continue // already visited
    }

    total += traverse_dfs(neighbor, destination, visited)
  }

  // Remove node from visited so other paths can go through the node
  visited.delete(node)

  return total
}
