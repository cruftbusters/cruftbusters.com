import { Amount, SingleAmount } from './Amount'
import { SingleInnerAmount } from './Amount'

export function AmountView({ amount }: { amount: Amount }) {
  return (
    <div className="amount">
      {amount.amounts.map((single) => (
        <SingleAmountView amount={single} key={single.key()} />
      ))}
    </div>
  )
}

function SingleAmountView({ amount }: { amount: SingleAmount }) {
  return (
    <div className="amount-one">
      <div>{amount.sign ? '(' : ''}</div>
      <div>{amount.prefix}</div>
      <SingleInnerAmountView amount={amount.innerAmount()} />
      <div>{amount.suffix}</div>
      <div>{amount.sign ? ')' : ''}</div>
    </div>
  )
}

function SingleInnerAmountView({ amount }: { amount: SingleInnerAmount }) {
  return (
    <div className="amount-one-inner">
      <div>{amount.whole()}</div>
      <div>{amount.separator('.')}</div>
      <div className="fraction">{amount.fraction()}</div>
    </div>
  )
}
