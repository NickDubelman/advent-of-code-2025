export function puzzleLoader(baseUrl: string | URL) {
  return async function load(filename: string) {
    const url = new URL(filename, baseUrl)
    return Bun.file(url).text()
  }
}
