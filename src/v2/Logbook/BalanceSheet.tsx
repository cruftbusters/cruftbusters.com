import { TextSheet } from './TextSheet'
import { Amount } from './Amount'

export class BalanceSheet {
  static fromTransfers(transfers: TextSheet) {
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

  constructor(private readonly m: Map<string, Amount> = new Map()) {}

  public accrue(account: string, amount: Amount) {
    const before = this.m.get(account)
    const after = before ? before.plus(amount) : amount
    this.m.set(account, after)
  }

  public toTextSheet() {
    return new TextSheet([
      ['account', 'amount'],
      ...Array.from(this.m.entries())
        .filter(([_, value]) => !value.isZero())
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([account, amount]) => [account, amount.toText()]),
    ])
  }

  public pretty() {
    return Array.from(this.m.entries())
      .filter(([_, value]) => !value.isZero())
      .sort(([a], [b]) => a.localeCompare(b))
  }
}
