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
      <div>{amount.sign ? ')' : ''}</div>
      <div className="left-align">{amount.suffix}</div>
    </div>
  )
}

function SingleInnerAmountView({ amount }: { amount: SingleInnerAmount }) {
  return (
    <div className="amount-one-inner">
      <div>{amount.whole()}</div>
      <div>{amount.separator('.')}</div>
      <div className="left-align">{amount.fraction()}</div>
    </div>
  )
}
