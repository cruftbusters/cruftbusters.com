export class Amount {
  static parse(text: string) {
    const [whole, fraction = ''] = text.split('.').map((v) => v.trim())
    const digits = whole + fraction
    const mantissa = ['', '-'].indexOf(digits) < 0 ? parseInt(digits) : 0
    const exponent = 0 - fraction.length
    const amount = new Amount(false, mantissa, exponent)

    return amount
  }

  constructor(
    public sign: boolean = false,
    public mantissa: number = 0,
    public exponent: number = 0,
  ) {}

  public negate() {
    return new Amount(!this.sign, this.mantissa, this.exponent)
  }

  public plus(other: Amount) {
    const floor = Math.min(this.exponent, other.exponent)

    const leftDigits = this.mantissa * Math.pow(10, this.exponent - floor)

    const rightDigits = other.mantissa * Math.pow(10, other.exponent - floor)

    const mantissa =
      this.sign === other.sign
        ? leftDigits + rightDigits
        : leftDigits - rightDigits

    if (mantissa === 0) {
      return new Amount()
    } else if (mantissa < 0) {
      return new Amount(!this.sign, -mantissa, floor)
    } else {
      return new Amount(this.sign, mantissa, floor)
    }
  }

  public toText() {
    if (this.mantissa === 0) {
      return ' - '
    }

    let result = this.mantissa.toString()

    const whole = result.substring(0, result.length + this.exponent) || '0'

    const fraction = result.substring(result.length + this.exponent)

    result = fraction ? `${whole}.${fraction}` : whole

    result = this.sign ? `( ${result} )` : `  ${result}  `

    return result
  }
}
