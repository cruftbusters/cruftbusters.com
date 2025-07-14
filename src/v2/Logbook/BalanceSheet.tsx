import { TextSheet } from './TextSheet'
import { Amount } from './Amount'
import { TransferSheet } from './TransferSheet'

export class BalanceSheet {
  static fromTransferSheet(transfers: TransferSheet) {
    const summary = new BalanceSheet()

    for (const [credit, debit, amountText] of transfers.select(
      'credit',
      'debit',
      'amount',
    )) {
      const amount = Amount.parse(amountText)
      summary.accrue(credit, amount.negate())
      summary.accrue(debit, amount)
    }

    return summary
  }

  constructor(private balanceSheet: Map<string, Amount> = new Map()) {}

  public accrue(account: string, amount: Amount) {
    const before = this.balanceSheet.get(account) || new Amount()
    const after = before.plus(amount)
    if (after.mantissa === 0) {
      this.balanceSheet.delete(account)
    } else {
      this.balanceSheet.set(account, after)
    }
  }

  public toTextSheet() {
    return new TextSheet([
      ['account', 'amount'],
      ...Array.from(this.balanceSheet.entries())
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([account, amount]) => [account, amount.toText()]),
    ])
  }
}
