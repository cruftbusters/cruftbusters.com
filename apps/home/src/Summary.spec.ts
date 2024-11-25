import { describe, expect, test } from 'vitest'
import { Summary } from './Summary'
import { TextSheet } from './TextSheet'

describe(Summary, () => {
  test('missing headers', () => {
    const sheet = TextSheet.fromArray()
    expect(() => Summary.fromTextSheet(sheet)).toThrow(
      Summary.errors.MISSING_HEADERS,
    )
  })
  test('empty', () => {
    const sheet = TextSheet.fromArray([
      'debitAccount',
      'creditAccount',
      'amount',
    ])
    const actual = Summary.fromTextSheet(sheet)
    expect(actual).toEqual({ type: 'cents', amount: 0 })
  })
  test('one transfer', () => {
    const sheet = TextSheet.fromArray(
      ['date', 'memo', 'debitAccount', 'creditAccount', 'amount'],
      ['date', 'memo', 'debitAccount', 'creditAccount', '1000'],
    )
    const actual = Summary.fromTextSheet(sheet)
    expect(actual).toEqual({
      type: 'cents',
      amount: 0,
      children: new Map([
        ['debitAccount', { type: 'cents', amount: 1000 }],
        ['creditAccount', { type: 'cents', amount: -1000 }],
      ]),
    })
  })
})
