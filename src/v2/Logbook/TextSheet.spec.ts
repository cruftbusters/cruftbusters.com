import { describe, expect, test } from 'vitest'
import { TextSheet } from './TextSheet'

describe('parsing', () => {
  test('no separator', () => {
    expect(TextSheet.parse('h1')).toStrictEqual(new TextSheet([['h1']]))
  })

  test('autodetect comma', () => {
    expect(TextSheet.parse('h1,h2')).toStrictEqual(
      new TextSheet([['h1', 'h2']]),
    )
  })

  test('autodetect tab', () => {
    expect(TextSheet.parse('h1\th2')).toStrictEqual(
      new TextSheet([['h1', 'h2']]),
    )
  })

  test('trim lines', () => {
    expect(TextSheet.parse(' x , x \n x , x ')).toStrictEqual(
      new TextSheet([
        ['x ', ' x'],
        ['x ', ' x'],
      ]),
    )
  })
})

describe('formatting', () => {
  test('format empty sheet', () => {
    const sheet = new TextSheet([])

    expect(sheet.toText()).toEqual('')
  })
})

describe('select', () => {
  test('headers row is missing', () => {
    const sheet = new TextSheet([])

    expect(() => Array.from(sheet.select(''))).toThrow(
      'expected header row to be present',
    )
  })
  test('select columns are missing from headers', () => {
    const sheet = new TextSheet([[]])

    expect(() => Array.from(sheet.select('amount'))).toThrow(
      'expected header row to contain "amount"',
    )
  })
  test('select columns', () => {
    const sheet = new TextSheet([
      ['credit', 'debit', 'amount'],
      ['my credit', 'my debit', '100'],
    ])

    expect(Array.from(sheet.select('amount', 'debit', 'credit'))).toStrictEqual(
      [['100', 'my debit', 'my credit']],
    )
  })
})
