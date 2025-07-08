export class Amount {
  static parse(text: string) {
    return new Amount(false, text.trim())
  }

  constructor(
    public sign: boolean = false,
    public digits: string = '',
  ) {}

  private mantissa() {
    return this.digits === '' ? 0 : parseInt(this.digits)
  }

  public negate() {
    return new Amount(!this.sign, this.digits)
  }

  public plus(other: Amount) {
    let mantissa

    if (this.sign === other.sign) {
      mantissa = this.mantissa() + other.mantissa()
    } else {
      mantissa = this.mantissa() - other.mantissa()
    }

    if (mantissa === 0) {
      return new Amount()
    } else if (mantissa < 0) {
      return new Amount(!this.sign, (-mantissa).toString())
    } else {
      return new Amount(this.sign, mantissa.toString())
    }
  }

  public toText() {
    let result = this.digits

    if (this.digits === '') {
      result = ' - '
    } else if (this.sign) {
      result = ` ( ${result} ) `
    } else {
      result = ` ${result} `
    }

    return result
  }
}
