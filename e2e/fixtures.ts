import { expect, Locator } from '@playwright/test'

import { TextSheet } from '../src/v2/Logbook/TextSheet'

export async function expectToBeTextSheet(locator: Locator, want: TextSheet) {
  const gotText = await locator.innerText()

  const tokens = gotText.split('\n')

  for (let index = 0; index < want.rows.length; index++) {
    const wantRow = want.rows[index]

    if (wantRow === undefined) {
      throw Error('expected row to be defined')
    }

    const gotRow: string[] = []

    for (const wantCell of wantRow) {
      const gotCell = tokens.shift()

      if (gotCell === undefined) {
        throw Error('expected cell to be defined')
      }

      gotRow.push(gotCell)

      try {
        expect(gotCell).toBe(wantCell)
      } catch (cause) {
        const message =
          `expectation failed on line ${index} of text sheet:\n  ` +
          want.toText().split('\n').join('  \n') +
          '\x1B[2mexpect(\x1B[22m\x1B[31mreceived\x1B[39m\x1B[2m).\x1B[22mtoBe\x1B[2m(\x1B[22m\x1B[32mexpected\x1B[39m\x1B[2m) // Object.is equality\x1B[22m\n' +
          '\n' +
          `Expected: \x1B[32m" ${wantRow} "\x1B[39m\n` +
          `Received: \x1B[31m" ${gotRow} "\x1B[39m`
        throw Error(message, { cause })
      }
    }
  }
}
