import { puzzleLoader } from '~/utils'

const loadPuzzle = puzzleLoader(import.meta.url)

const input = await loadPuzzle('example.txt')

// TODO:
