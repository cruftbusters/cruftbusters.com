import { Amount } from './Amount'
import { BalanceSheet } from './BalanceSheet'
import { TextSheet } from './TextSheet'

export class TransferSheet {
  static requiredHeaders = ['credit', 'debit', 'amount']

  static fromTextSheet(sheet: TextSheet) {
    const [headers, records] = sheet.split()


    for (const wantHeader of this.requiredHeaders) {
      if (headers.indexOf(wantHeader) < 0) {
        throw new Error(
          'expected headers \"credit\", \"debit\", and \"amount\"',
        )
      }
    }

    return new TransferSheet(records)
  }

  constructor(private transfers: string[][] = []) {}

  public toTextSheet() {
    return new TextSheet([TransferSheet.requiredHeaders, ...this.transfers])
  }

  public toBalanceSheet() {
    const summary = new BalanceSheet()

    for (const [credit, debit, amountText] of this.transfers) {
      const amount = Amount.parse(amountText)
      summary.accrue(credit, amount.negate())
      summary.accrue(debit, amount)
    }

    return summary
  }
}
