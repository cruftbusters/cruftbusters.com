export class TextSheet {
  static parse(text: string) {
    const rows = text.split('\n').map((line) => line.split(','))
    return new TextSheet(rows)
  }

  constructor(public rows: string[][]) {}

  public toText() {
    return this.rows.map((row) => row.join(',')).join('\n')
  }

  public split(): [string[], string[][]] {
    return [this.rows[0], this.rows.slice(1)]
  }
}
