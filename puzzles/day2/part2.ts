import { puzzleLoader } from '~/utils'

const loadPuzzle = puzzleLoader(import.meta.url)

const input = await loadPuzzle('input.txt')

type Range = [string, string]

const ranges: Range[] = input.split(',').map(rangeStr => {
  const split = rangeStr.split('-')
  return [split[0]!, split[1]!]
})

const invalidIds = []

for (let range of ranges) {
  const [start, end] = range
  for (let i = parseInt(start); i <= parseInt(end); i++) {
    const numStr = String(i)
    if (isSilly(numStr)) {
      invalidIds.push(numStr)
    }
  }
}

const sum = invalidIds.map(id => parseInt(id)).reduce((acc, curr) => acc + curr, 0)
console.log(sum)

// a number is "silly" if it consists of some sequence of digits repeated AT LEAST twice
function isSilly(numStr: string): boolean {
  // From len 1..numStr.length, break numStr into equal sized chunks
  // Then check if each chunk is equal

  // Len 1 is "equally chunkable" for all values
  // Len 2 is only equally chunkable for values with even length
  // Len 3 is only equally chunkable for values where length%3=0
  for (let i = 0; i < numStr.length; i++) {
    if (i !== 1 && numStr.length % i !== 0) {
      // Len is not "equally chunkable" by i
      continue
    }

    const chunks = chunk(numStr, i)
    const first = chunks[0]
    if (chunks.every(c => c === first)) {
      return true
    }
  }

  return false
}

function chunk(numStr: string, size: number): string[] {
  const chunks: string[] = []

  for (let i = 0; i < numStr.length; i += size) {
    chunks.push(numStr!.slice(i, i + size))
  }

  return chunks
}
