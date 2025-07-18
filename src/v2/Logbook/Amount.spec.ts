import { expect, test } from 'vitest'
import { Amount, SingleAmount } from './Amount'

test('parse empty', () => {
  const actual = Amount.parse('')
  const expected = new Amount([new SingleAmount(false, '', 0, 0, '')])
  expect(actual).toStrictEqual(expected)
})

test('parse dash', () => {
  const actual = Amount.parse(' - ')
  const expected = new Amount([new SingleAmount(false, '', 0, 0, '')])
  expect(actual).toStrictEqual(expected)
})

test('parse prefix', () => {
  const actual = Amount.parse(' $ - ')
  const expected = new Amount([new SingleAmount(false, '$', 0, 0, '')])
  expect(actual).toStrictEqual(expected)
})

test('parse suffix', () => {
  const actual = Amount.parse(' - Google Pixel 9')
  const expected = new Amount([
    new SingleAmount(false, '', 0, 0, 'Google Pixel 9'),
  ])
  expect(actual).toStrictEqual(expected)
})

test('parse commas', () => {
  const actual = Amount.parse(' 1,000,000.000 ')
  const expected = new Amount([
    new SingleAmount(false, '', 1_000_000_000, -3, ''),
  ])
  expect(actual).toStrictEqual(expected)
})

test('plus', () => {
  const actual = Amount.parse(' 1 ').plus(Amount.parse(' 1 '))
  const expected = new Amount([new SingleAmount(false, '', 2, 0, '')])
  expect(actual).toStrictEqual(expected)
})

test('plus matching prefix', () => {
  const actual = Amount.parse(' $ 1 ').plus(Amount.parse(' $ 2 '))
  const expected = new Amount([new SingleAmount(false, '$', 3, 0, '')])
  expect(actual).toStrictEqual(expected)
})

test('plus matching suffix', () => {
  const actual = Amount.parse(' 1 kilowatt hours').plus(
    Amount.parse(' 2 kilowatt hours '),
  )
  const expected = new Amount([
    new SingleAmount(false, '', 3, 0, 'kilowatt hours'),
  ])
  expect(actual).toStrictEqual(expected)
})

test('plus fractional', () => {
  {
    const actual = Amount.parse(' 0.0 ').plus(Amount.parse(' 0.00 '))
    const expected = new Amount([new SingleAmount(false, '', 0, -2, '')])
    expect(actual).toStrictEqual(expected)
  }
  {
    const actual = Amount.parse(' 0.1 ').plus(Amount.parse(' 0.1 '))
    const expected = new Amount([new SingleAmount(false, '', 2, -1, '')])
    expect(actual).toStrictEqual(expected)
  }
  {
    const actual = Amount.parse(' 0.1 ').plus(Amount.parse(' 0.01 '))
    const expected = new Amount([new SingleAmount(false, '', 11, -2, '')])
    expect(actual).toStrictEqual(expected)
  }
  {
    const actual = Amount.parse(' 0.01 ').plus(Amount.parse(' 0.1 '))
    const expected = new Amount([new SingleAmount(false, '', 11, -2, '')])
    expect(actual).toStrictEqual(expected)
  }
  {
    const actual = Amount.parse(' 0.5 ').plus(Amount.parse(' 0.5 '))
    const expected = new Amount([new SingleAmount(false, '', 10, -1, '')])
    expect(actual).toStrictEqual(expected)
  }
})

test('plus lesser negative', () => {
  const actual = Amount.parse(' 2 ').plus(Amount.parse(' 1 ').negate())
  const expected = new Amount([new SingleAmount(false, '', 1, 0, '')])
  expect(actual).toStrictEqual(expected)
})

test('plus greater negative', () => {
  const actual = Amount.parse(' 1 ').plus(Amount.parse(' 2 ').negate())
  const expected = new Amount([new SingleAmount(true, '', 1, 0, '')])
  expect(actual).toStrictEqual(expected)
})

test('plus non matching prefix or suffix', () => {
  const simple = Amount.parse(' 1 ')
  const dollar = Amount.parse(' $ 2 ')
  const usd = Amount.parse(' 3 USD ')
  {
    const actual = simple.plus(dollar).plus(usd)
    const expected = new Amount([
      new SingleAmount(false, '', 1, 0, ''),
      new SingleAmount(false, '$', 2, 0, ''),
      new SingleAmount(false, '', 3, 0, 'USD'),
    ])
    expect(actual).toStrictEqual(expected)
  }
  {
    const actual = usd.plus(dollar)
    const expected = new Amount([
      new SingleAmount(false, '', 3, 0, 'USD'),
      new SingleAmount(false, '$', 2, 0, ''),
    ])
    expect(actual).toStrictEqual(expected)
  }
  {
    const actual = dollar.plus(usd).plus(dollar.negate())
    const expected = new Amount([
      new SingleAmount(false, '$', 0, 0, ''),
      new SingleAmount(false, '', 3, 0, 'USD'),
    ])
    expect(actual).toStrictEqual(expected)
  }
})
