import { TextSheet } from './TextSheet'

export class TransferSheet {
  static fromTextSheet(sheet: TextSheet) {
    const [headers, records] = sheet.split()

    if (headers === undefined) {
      throw Error('expected sheet not to be empty')
    }

    return new TransferSheet(headers, records)
  }

  constructor(
    private headers: string[],
    private records: string[][] = [],
  ) {}

  public toTextSheet() {
    return new TextSheet([this.headers, ...this.records])
  }

  public *select(...names: string[]) {
    const indexes: number[] = []
    for (const name of names) {
      const index = this.headers.indexOf(name)

      if (index < 0) {
        throw new Error(
          `expected headers ${names.map((name) => `"${name}"`).join(', ')}`,
        )
      }

      indexes.push(index)
    }

    for (const transfer of this.records) {
      yield indexes.map((index) => transfer[index] || '')
    }
  }
}
