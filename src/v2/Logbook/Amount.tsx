export class Amount {
  static parse(text: string) {
    const singleAmount = SingleAmount.parse(text)
    return new Amount([singleAmount])
  }

  constructor(public amounts: SingleAmount[]) {}

  public isEmpty() {
    return this.amounts.every((amount) => amount.isEmpty())
  }

  public isZero() {
    return this.amounts.every((amount) => amount.isZero())
  }

  public negate() {
    return new Amount(this.amounts.map((amount) => amount.negate()))
  }

  public plus(other: Amount) {
    const m: Map<string, SingleAmount> = new Map()

    for (const amount of this.amounts.concat(other.amounts)) {
      const key = amount.key()
      const v = m.get(key)
      const w = v ? v.plus(amount) : amount
      if (w.isEmpty()) {
        m.delete(key)
      } else {
        m.set(key, w)
      }
    }

    return new Amount(Array.from(m.values()))
  }
}

export class SingleAmount {
  static parse(text: string) {
    const m = text.match(
      /^\s*([^\s\d-]*)\s*(-|[\d,]*)\.?(\d*)\s*([^\d]?.*?)\s*$/,
    )

    if (!m) {
      throw Error(`failed to parse input: '${text}'`)
    }

    let [_, prefix, whole, fraction, suffix] = m

    whole = whole.replace(/,/g, '')

    const digits = whole + fraction
    const mantissa = ['', '-'].indexOf(digits) < 0 ? parseInt(digits) : 0
    const exponent = 0 - fraction.length
    const amount = new SingleAmount(false, prefix, mantissa, exponent, suffix)

    return amount
  }

  constructor(
    public sign: boolean = false,
    public prefix: string = '',
    public mantissa: number = 0,
    public exponent: number = 0,
    public suffix: string = '',
  ) {}

  public key() {
    return JSON.stringify({ prefix: this.prefix, suffix: this.suffix })
  }

  public isEmpty() {
    return this.prefix === '' && this.mantissa === 0 && this.exponent === 0
  }

  public isZero() {
    return this.mantissa === 0
  }

  public negate() {
    return new SingleAmount(
      !this.sign,
      this.prefix,
      this.mantissa,
      this.exponent,
      this.suffix,
    )
  }

  public plus(other: SingleAmount) {
    if (this.prefix !== other.prefix) {
      throw Error('expected matching prefix')
    } else if (this.suffix !== other.suffix) {
      throw Error('expected matching suffix')
    }

    const floor = Math.min(this.exponent, other.exponent)

    const leftDigits = this.mantissa * Math.pow(10, this.exponent - floor)

    const rightDigits = other.mantissa * Math.pow(10, other.exponent - floor)

    const mantissa =
      this.sign === other.sign
        ? leftDigits + rightDigits
        : leftDigits - rightDigits

    if (mantissa === 0) {
      return new SingleAmount(this.sign, this.prefix, 0, floor, this.suffix)
    } else if (mantissa < 0) {
      return new SingleAmount(
        !this.sign,
        this.prefix,
        -mantissa,
        floor,
        this.suffix,
      )
    } else {
      return new SingleAmount(
        this.sign,
        this.prefix,
        mantissa,
        floor,
        this.suffix,
      )
    }
  }

  public innerAmount() {
    let result = this.mantissa.toString().padStart(-this.exponent, '0')

    let whole = result.substring(0, result.length + this.exponent) || '0'

    for (let index = whole.length - 3; index > 0; index -= 3) {
      whole = whole.substring(0, index) + ',' + whole.substring(index)
    }

    const fraction = result.substring(result.length + this.exponent)

    return new SingleInnerAmount(whole, fraction)
  }
}

export class SingleInnerAmount {
  constructor(
    private readonly _whole: string,
    private readonly _fraction: string,
  ) {}

  public whole() {
    return this._whole
  }

  public separator(text: string) {
    return this._fraction ? text : ''
  }

  public fraction() {
    return this._fraction
  }
}
