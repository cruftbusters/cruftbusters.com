import { describe, expect, test } from 'vitest'
import { TransferSheet } from './TransferSheet'
import { TextSheet } from './TextSheet'

test('sheet is empty', () => {
  const sheet = new TextSheet([])

  expect(() => TransferSheet.fromTextSheet(sheet)).toThrow(
    'expected sheet not to be empty',
  )
})

test('headers are present but no records', () => {
  const sheet = new TextSheet([['credit', 'debit', 'amount']])

  const transfers = TransferSheet.fromTextSheet(sheet)

  expect(transfers.toTextSheet()).toStrictEqual(sheet)
})

test('headers and records are present', () => {
  const sheet = new TextSheet([
    ['credit', 'debit', 'amount'],
    ['my credit', 'my debit', '100'],
  ])

  const transfers = TransferSheet.fromTextSheet(sheet)

  expect(transfers.toTextSheet()).toStrictEqual(sheet)
})

describe('select', () => {
  test('select columns are missing', () => {
    const sheet = new TextSheet([[]])

    expect(() =>
      Array.from(TransferSheet.fromTextSheet(sheet).select('amount')),
    ).toThrow('expected headers "amount"')
  })
  test('select columns', () => {
    const sheet = new TextSheet([
      ['credit', 'debit', 'amount'],
      ['my credit', 'my debit', '100'],
    ])

    const transfers = TransferSheet.fromTextSheet(sheet)

    expect(
      Array.from(transfers.select('amount', 'debit', 'credit')),
    ).toStrictEqual([['100', 'my debit', 'my credit']])
  })
})
