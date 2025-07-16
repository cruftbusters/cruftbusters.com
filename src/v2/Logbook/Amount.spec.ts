import { expect, test } from 'vitest'
import { Amount } from './Amount'

test('zero', () => {
  {
    const actual = Amount.parse('').toText()
    const expected = '  -  '
    expect(actual).toBe(expected)
  }
  {
    const actual = Amount.parse(' - ').toText()
    const expected = '  -  '
    expect(actual).toBe(expected)
  }
  {
    const actual = Amount.parse('$-').toText()
    const expected = '  $ -  '
    expect(actual).toBe(expected)
  }
})

test('plus', () => {
  const actual = Amount.parse(' 1 ').plus(Amount.parse(' 1 ')).toText()
  const expected = '  2  '
  expect(actual).toBe(expected)
})

test('plus fractional', () => {
  {
    const actual = Amount.parse(' 0.0 ').plus(Amount.parse(' 0.00 ')).toText()
    const expected = '  0.00  '
    expect(actual).toBe(expected)
  }
  {
    const actual = Amount.parse(' 0.1 ').plus(Amount.parse(' 0.1 ')).toText()
    const expected = '  0.2  '
    expect(actual).toBe(expected)
  }
  {
    const actual = Amount.parse(' 0.1 ').plus(Amount.parse(' 0.01 ')).toText()
    const expected = '  0.11  '
    expect(actual).toBe(expected)
  }
  {
    const actual = Amount.parse(' 0.01 ').plus(Amount.parse(' 0.1 ')).toText()
    const expected = '  0.11  '
    expect(actual).toBe(expected)
  }
  {
    const actual = Amount.parse(' 0.5 ').plus(Amount.parse(' 0.5 ')).toText()
    const expected = '  1.0  '
    expect(actual).toBe(expected)
  }
})

test('plus less negative', () => {
  const actual = Amount.parse(' 2 ').plus(Amount.parse(' 1 ').negate()).toText()
  const expected = '  1  '
  expect(actual).toBe(expected)
})

test('plus greater negative', () => {
  const actual = Amount.parse(' 1 ').plus(Amount.parse(' 2 ').negate()).toText()
  const expected = '( 1 )'
  expect(actual).toBe(expected)
})

test('plus matching prefix', () => {
  const actual = Amount.parse(' $ 1 ').plus(Amount.parse(' $ 2 ')).toText()
  const expected = '  $ 3  '
  expect(actual).toBe(expected)
})

test('plus non matching prefix', () => {
  const left = Amount.parse(' $ 1 ')
  const right = Amount.parse(' USD 2 ')
  {
    const actual = left.plus(right).toText()
    const expected = '  $ 1  \n  USD 2  '
    expect(actual).toStrictEqual(expected)
  }
  {
    const actual = right.plus(left).toText()
    const expected = '  USD 2  \n  $ 1  '
    expect(actual).toStrictEqual(expected)
  }
  {
    const actual = left.plus(right).plus(left.negate()).toText()
    const expected = '  $ -  \n  USD 2  '
    expect(actual).toStrictEqual(expected)
  }
})
