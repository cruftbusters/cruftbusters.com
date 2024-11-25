import { describe, expect, test } from 'vitest'
import { TextSheet } from './TextSheet'

describe(TextSheet, () => {
  describe('from array to text', () => {
    test('2x2', () => {
      const sheet = TextSheet.fromArray(
        ['date', 'memo'],
        ['2024-01-01', 'the memo'],
      )
      expect(sheet.toText()).toBe('date,memo\n2024-01-01,the memo')
    })
    test('quote comma', () => {
      const sheet = TextSheet.fromArray(
        ['da,te'],
      )
      expect(sheet.toText()).toBe('"da,te"')
    })
  })
  describe('from text to array', () => {
    test('2x2', () => {
      const sheet = TextSheet.fromText('date,memo\n2024-01-01,the memo')
      expect(sheet.toArray()).toEqual([
        ['date', 'memo'],
        ['2024-01-01', 'the memo'],
      ])
    })
    test('quoted comma', () => {
      const sheet = TextSheet.fromText('"da,te"')
      expect(sheet.toArray()).toEqual([['da,te']])
    })
    test('trailing newline', () => {
      const sheet = TextSheet.fromText('wasd\n')
      expect(sheet.toArray()).toEqual([['wasd']])
    })
  })
})
