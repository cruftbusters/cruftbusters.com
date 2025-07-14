import { describe, expect, test } from 'vitest'
import { TextSheet } from './TextSheet'

describe('autodetect separator', () => {
  test('comma', () => {
    expect(TextSheet.parse('h1,h2')).toStrictEqual(
      new TextSheet([['h1', 'h2']]),
    )
  })

  test('tab', () => {
    expect(TextSheet.parse('h1\th2')).toStrictEqual(
      new TextSheet([['h1', 'h2']]),
    )
  })
})
