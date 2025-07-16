import { Amount } from './Amount'

export function AmountView({ amount }: { amount: Amount }) {
  return (
    <div className="amount">
      {amount.amounts.map((single) => (
        <div key={single.prefix} className="amount-one">
          <div>{single.sign ? '(' : ''}</div>
          <div>{single.prefix}</div>
          <div>{single.toNumberText()}</div>
          <div>{single.sign ? ')' : ''}</div>
        </div>
      ))}
    </div>
  )
}
