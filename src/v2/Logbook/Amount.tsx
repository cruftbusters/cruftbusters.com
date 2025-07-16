export class Amount {
  static parse(text: string) {
    return new Amount([SingleAmount.parse(text)])
  }

  constructor(public amounts: SingleAmount[]) {}

  public isZero() {
    return this.amounts.every((amount) => amount.isZero())
  }

  public negate() {
    return new Amount(this.amounts.map((amount) => amount.negate()))
  }

  public plus(other: Amount) {
    const m: Map<string, SingleAmount> = new Map()

    for (const amount of this.amounts.concat(other.amounts)) {
      const v = m.get(amount.prefix)
      const w = v ? v.plus(amount) : amount
      if (w.prefix !== '' || w.mantissa !== 0 || w.exponent !== 0) {
        m.set(amount.prefix, w)
      } else {
        m.delete(amount.prefix)
      }
    }

    return new Amount(Array.from(m.values()))
  }

  public toText() {
    return this.amounts.map((amount) => amount.toText()).join('\n') || ' - '
  }
}

class SingleAmount {
  static parse(text: string) {
    const textWithoutCommas = text.replace(/,/g, '')
    const index = textWithoutCommas.search(/(?=\d|-)/)
    const prefix = textWithoutCommas.slice(0, index).trim()
    const [whole, fraction = ''] = textWithoutCommas
      .slice(index)
      .split('.')
      .map((v) => v.trim())
    const digits = whole + fraction
    const mantissa = ['', '-'].indexOf(digits) < 0 ? parseInt(digits) : 0
    const exponent = 0 - fraction.length
    const amount = new SingleAmount(false, prefix, mantissa, exponent)

    return amount
  }

  constructor(
    public sign: boolean = false,
    public prefix: string = '',
    public mantissa: number = 0,
    public exponent: number = 0,
  ) {}

  public isZero() {
    return this.mantissa === 0
  }

  public negate() {
    return new SingleAmount(
      !this.sign,
      this.prefix,
      this.mantissa,
      this.exponent,
    )
  }

  public plus(other: SingleAmount) {
    if (this.prefix !== other.prefix) {
      throw Error('expected matching prefix')
    }

    const floor = Math.min(this.exponent, other.exponent)

    const leftDigits = this.mantissa * Math.pow(10, this.exponent - floor)

    const rightDigits = other.mantissa * Math.pow(10, other.exponent - floor)

    const mantissa =
      this.sign === other.sign
        ? leftDigits + rightDigits
        : leftDigits - rightDigits

    if (mantissa === 0) {
      return new SingleAmount(this.sign, this.prefix, 0, floor)
    } else if (mantissa < 0) {
      return new SingleAmount(!this.sign, this.prefix, -mantissa, floor)
    } else {
      return new SingleAmount(this.sign, this.prefix, mantissa, floor)
    }
  }

  public toText() {
    let result = this.mantissa.toString().padStart(-this.exponent, '0')

    const _whole = result.substring(0, result.length + this.exponent) || '0'

    let whole = ''

    for (let index = 0; index < _whole.length; index++) {
      if (index !== 0 && index % 3 === 0 && index < _whole.length) {
        whole = `,${whole}`
      }
      whole = `${_whole[_whole.length - index - 1]}${whole}`
    }

    const fraction = result.substring(result.length + this.exponent)

    result = fraction ? `${whole}.${fraction}` : whole

    result = result === '0' ? '-' : result

    result = this.prefix ? `${this.prefix} ${result}` : result

    result = this.sign ? `( ${result} )` : `  ${result}  `

    return result
  }
}
