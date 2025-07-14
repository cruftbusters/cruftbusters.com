import { expect, test } from 'vitest'
import { Amount } from './Amount'

test('zero', () => {
  {
    const actual = Amount.parse('').toText()
    const expected = ' - '
    expect(actual).toBe(expected)
  }
  {
    const actual = Amount.parse(' - ').toText()
    const expected = ' - '
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

test('plus negative', () => {
  const actual = Amount.parse(' 2 ').plus(Amount.parse(' 1 ').negate()).toText()
  const expected = '  1  '
  expect(actual).toBe(expected)
})

test('plus greater negative', () => {
  const actual = Amount.parse(' 1 ').plus(Amount.parse(' 2 ').negate()).toText()
  const expected = '( 1 )'
  expect(actual).toBe(expected)
})
