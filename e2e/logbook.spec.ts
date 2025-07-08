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

  await page.getByRole('button', { name: 'save' }).click()

  await expect(page.getByLabel('status')).toHaveText(
    'error: transfer sheet does not include all headers of "credit", "debit", and "amount"',
  )
})

test('single transfer and summary', async ({ page }) => {
  await page.goto('http://localhost:5173/apps/logbook')

  const sheet = new TextSheet([
    ['credit', 'debit', 'amount'],
    ['liability', 'expense', ' 100 '],
  ])

  const text = sheet.toText()

  await page.getByLabel('transfers').fill(text)

  await page.getByRole('button', { name: 'save' }).click()

  await expect(page.getByLabel('status')).toHaveText('success')

  const want = new TextSheet([
    ['account', 'amount'],
    ['expense', ' 100 '],
    ['liability', ' ( 100 ) '],
  ])

  await expect(page.getByLabel('summary')).toHaveText(want.toText())
})

test('multiple transfers and summary', async ({ page }) => {
  await page.goto('http://localhost:5173/apps/logbook')

  const sheet = new TextSheet([
    ['credit', 'debit', 'amount'],
    ['liability', 'expense', ' 100 '],
    ['assets', 'liability', ' 100 '],
  ])

  const text = sheet.toText()

  await page.getByLabel('transfers').fill(text)

  await page.getByRole('button', { name: 'save' }).click()

  await expect(page.getByLabel('status')).toHaveText('success')

  const want = new TextSheet([
    ['account', 'amount'],
    ['assets', ' ( 100 ) '],
    ['expense', ' 100 '],
  ])

  await expect(page.getByLabel('summary')).toHaveText(want.toText())
})
