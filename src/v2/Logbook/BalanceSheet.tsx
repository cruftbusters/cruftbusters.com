import { TextSheet } from './TextSheet'
import { Amount } from './Amount'

export class BalanceSheet {
  static fromLogbook(logbook: TextSheet) {
    const m = new Map()

    function accrue(account: string, amount: Amount) {
      const before = m.get(account)
      const after = before ? before.plus(amount) : amount
      m.set(account, after)
    }

    for (const [credit, debit, amountText] of logbook.select(
      'credit',
      'debit',
      'amount',
    )) {
      const amount = Amount.parse(amountText)
      accrue(credit, amount.negate())
      accrue(debit, amount)
    }

    return new BalanceSheet(m)
  }

  constructor(private readonly m: Map<string, Amount> = new Map()) {}

  public pretty() {
    return Array.from(this.m.entries())
      .filter(([_, value]) => !value.isZero())
      .sort(([a], [b]) => a.localeCompare(b))
  }
}
