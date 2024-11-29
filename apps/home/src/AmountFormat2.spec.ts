import { describe, expect, test } from 'vitest'
import { AmountFormat2 } from './AmountFormat2'
import { Amount2 } from './types'

describe(AmountFormat2, () => {
  describe('parse', () => {
    test('integer part', () => {
      const actual = AmountFormat2.parse('1')
      const expected: Amount2 = { value: 1, exponent: 0, unit: 'dollars' }
      expect(actual).toEqual(expected)
    })
    test('fractional part', () => {
      const actual = AmountFormat2.parse('.1')
      const expected: Amount2 = { value: 1, exponent: -1, unit: 'dollars' }
      expect(actual).toEqual(expected)
    })
    test('sign', () => {
      const actual = AmountFormat2.parse('-12.34')
      const expected: Amount2 = { value: -1234, exponent: -2, unit: 'dollars' }
      expect(actual).toEqual(expected)
    })
    test('prefix', () => {
      const actual = AmountFormat2.parse('$ 12.34')
      const expected: Amount2 = { value: 1234, exponent: -2, unit: 'dollars' }
      expect(actual).toEqual(expected)
    })
    test('sign via parenthesis', () => {
      const actual = AmountFormat2.parse('( $ 12.34 )')
      const expected: Amount2 = { value: -1234, exponent: -2, unit: 'dollars' }
      expect(actual).toEqual(expected)
    })
  })
  describe('format', () => {
    test('one dollar no cents', () => {
      const actual = AmountFormat2.format({
        value: 1,
        exponent: 0,
        unit: 'dollars',
      })
      const expected = ' $ 1.00 '
      expect(actual).toEqual(expected)
    })
    test('no dollar no cents', () => {
      const actual = AmountFormat2.format({
        value: 0,
        exponent: 0,
        unit: 'dollars',
      })
      const expected = ' $ 0.00 '
      expect(actual).toEqual(expected)
    })
    test('no dollar ten cents', () => {
      const actual = AmountFormat2.format({
        value: 1,
        exponent: -1,
        unit: 'dollars',
      })
      const expected = ' $ 0.10 '
      expect(actual).toEqual(expected)
    })
    test('no dollar sub cents', () => {
      const actual = AmountFormat2.format({
        value: 1,
        exponent: -3,
        unit: 'dollars',
      })
      const expected = ' $ 0.001 '
      expect(actual).toEqual(expected)
    })
    test('signed dollar and cents', () => {
      const actual = AmountFormat2.format({
        value: -1234,
        exponent: -2,
        unit: 'dollars',
      })
      const expected = ' ( $ 12.34 ) '
      expect(actual).toEqual(expected)
    })
  })
})
