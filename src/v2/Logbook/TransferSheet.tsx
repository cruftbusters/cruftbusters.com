import { Amount } from './Amount'
import { BalanceSheet } from './BalanceSheet'
import { TextSheet } from './TextSheet'

export class TransferSheet {
  static fromTextSheet(sheet: TextSheet) {
    const [headers, records] = sheet.split()

    const wantHeaders = ['credit', 'debit', 'amount']

    for (const wantHeader of wantHeaders) {
      if (headers.indexOf(wantHeader) < 0) {
        throw new Error(
          'expected all headers \"credit\", \"debit\", and \"amount\"',
        )
      }
    }

    return new TransferSheet(records)
  }

  constructor(private transfers: string[][] = []) {}

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
