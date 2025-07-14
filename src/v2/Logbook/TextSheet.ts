export class TextSheet {
  static parse(text: string) {
    let separator: string | undefined = undefined

    for (const char of text) {
      if (char === ',' || char === '\t') {
        separator = char
        break
      }
    }

    if (separator === undefined) {
      throw Error('failed to detect separator')
    }

    const rows = text.split('\n').map((line) => line.split(separator))
    return new TextSheet(rows)
  }

  constructor(public rows: string[][]) {}

  public toText() {
    return this.toTextLines().join('\n')
  }

  public toTextLines(separator = ',') {
    return this.rows.map((row) => row.join(separator))
  }

  public split(): [string[], string[][]] {
    return [this.rows[0], this.rows.slice(1)]
  }
}
