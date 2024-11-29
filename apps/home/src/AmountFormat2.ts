import { Amount2 } from './types'

export class AmountFormat2 {
  static errors = {
    PARTIAL_CENTS: 'partial cents is not implemented',
  }
  static parse(text: string): Amount2 {
    const sign = text.indexOf('-') > -1 || text.indexOf('(') > -1 ? -1 : 1
    const [left, right] = text.replace(/[^\d\.]/g, '').split('.')
    const exponent = -right?.length || 0
    const dollars = parseInt(left) || 0
    const value =
      sign * (dollars * Math.pow(10, -exponent) + (parseInt(right) || 0))
    return { value, exponent, unit: 'dollars' }
  }
  static format(amount: Amount2) {
    const sign = Math.sign(amount.value)
    const digits = (sign * amount.value)
      .toString()
      .padStart(-amount.exponent, '0')
    const offset = digits.length + amount.exponent
    const dollars = digits.slice(0, offset) || '0'
    const cents = digits.slice(offset).padEnd(2, '0')
    const text = ` $ ${dollars}.${cents} `
    return sign >= 0 ? text : ` (${text}) `
  }
}
