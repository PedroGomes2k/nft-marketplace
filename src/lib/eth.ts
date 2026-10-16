import Decimal from "decimal.js"

/**
 * Valores em ETH trafegam como string decimal ("1.19") e as contas usam
 * decimal.js: em JavaScript puro, 0.1 + 0.2 dá 0.30000000000000004.
 */
export function eth(value: string | number | Decimal): Decimal {
  return new Decimal(value)
}

/** Sempre pelo menos 2 casas: "1.2" vira "1.20"; "0.016" continua "0.016" */
export function formatEth(value: string | Decimal): string {
  const decimal = new Decimal(value)
  return decimal.decimalPlaces() < 2 ? decimal.toFixed(2) : decimal.toFixed()
}

export function multiplyEth(unitPrice: string, quantity: number): string {
  return formatEth(new Decimal(unitPrice).times(quantity))
}
