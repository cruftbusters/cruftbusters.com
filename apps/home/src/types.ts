export type Amount = { value: number; unit: 'cents' }
export type Amount2 = { value: number; exponent: number; unit: 'dollars' }
export type Balance = Amount & { children?: Map<string, Balance> }
