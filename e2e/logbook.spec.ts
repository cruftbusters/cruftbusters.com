import { test, expect } from '@playwright/test'
import { TextSheet } from '../src/v2/Logbook/TextSheet'

test('missing headers error', async ({ page }) => {
  await page.goto('http://localhost:5173/apps/logbook')

  const sheet = new TextSheet([
    ['credit', 'debitt', 'amount'],
    ['liability', 'expense', ' 100 '],
  ])

  const text = sheet.toText()

  await page.getByLabel('transfers').fill(text)

  await expect(page.getByLabel('summary-status')).toHaveText(
    'failed to generate balance sheet: expected header row to contain "credit", "debit", "amount"',
  )
})

test('single transfer and summary', async ({ page }) => {
  await page.goto('http://localhost:5173/apps/logbook')

  const sheet = new TextSheet([
    ['credit', 'debit', 'amount'],
    ['liability', 'expense', '100'],
  ])

  const text = sheet.toText()

  await page.getByLabel('transfers').fill(text)

  await expect(page.getByLabel('summary-contents').getByRole('row')).toHaveText(
    new TextSheet([
      ['account', 'amount'],
      ['expense', '  100  '],
      ['liability', '( 100 )'],
    ]).toTextLines(''),
  )
})

test('multiple transfers and summary', async ({ page }) => {
  await page.goto('http://localhost:5173/apps/logbook')

  const sheet = new TextSheet([
    ['credit', 'debit', 'amount'],
    ['liability', 'expense', '100'],
    ['assets', 'liability', '100'],
  ])

  const text = sheet.toText()

  await page.getByLabel('transfers').fill(text)

  await expect(page.getByLabel('summary-contents').getByRole('row')).toHaveText(
    new TextSheet([
      ['account', 'amount'],
      ['assets', '( 100 )'],
      ['expense', '  100  '],
    ]).toTextLines(''),
  )
})

test('load an example for major accounting categories', async ({ page }) => {
  await page.goto('http://localhost:5173/apps/logbook')

  await page.getByLabel('select logbook:').selectOption('example')

  await expect(page.getByLabel('summary-contents').getByRole('row')).toHaveText(
    new TextSheet([
      ['account', 'amount'],
      ['assets:checking', '  51  '],
      ['equity:capital contribution', '( 200 )'],
      ['equity:draw', '  50  '],
      ['expense:government fees', '  135  '],
      ['expense:income tax', '  100  '],
      ['expense:net pay', '  300  '],
      ['expense:office supplies', '  200  '],
      ['income:checking interest', '( 1 )'],
      ['income:via client', '( 1000 )'],
      ['liability:credit card', '( 135 )'],
      ['liability:income receivable', '  500  '],
    ]).toTextLines(''),
  )
})
