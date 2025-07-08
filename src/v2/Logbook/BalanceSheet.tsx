import { TextSheet } from './TextSheet'
import { Amount } from './Amount'

export class BalanceSheet {
  constructor(private balanceSheet: Map<string, Amount> = new Map()) {}

  public accrue(account: string, amount: Amount) {
    const before = this.balanceSheet.get(account) || new Amount()
    const after = before.plus(amount)
    if (after.digits === '') {
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
