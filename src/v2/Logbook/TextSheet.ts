export class TextSheet {
  static parse(text: string) {
    let separator: string | undefined = undefined

    for (const char of text) {
      if (char === ',' || char === '\t') {
        separator = char
        break
      }
    }

    const lines = text.split('\n').map((line) => line.trim())

    const rows =
      separator !== undefined
        ? lines.map((line) => line.split(separator))
        : lines.map((line) => [line])

    return new TextSheet(rows)
  }

  constructor(public rows: string[][]) {}

  public *select(...names: string[]) {
    if (this.rows.length < 1) {
      throw Error('expected header row to be present')
    }

    const [headers, records] = [this.rows[0], this.rows.slice(1)]

    const indexes: number[] = []

    for (const name of names) {
      const index = headers.indexOf(name)

      if (index < 0) {
        throw new Error(
          `expected header row to contain ${names.map((name) => `"${name}"`).join(', ')}`,
        )
      }

      indexes.push(index)
    }

    for (const record of records) {
      yield indexes.map((index) => record[index] || '')
    }
  }

  public toText() {
    return this.toTextLines().join('\n')
  }

  public toTextLines(separator = ',') {
    return this.rows.map((row) => row.join(separator))
  }
}
