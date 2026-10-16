export interface MockCoupon {
  code: string
  percentOff: number
  expiresAt: string
}

/** KURIO10 é válido; GENESIS5 já expirou; qualquer outro código é inválido */
export const couponsFixture: MockCoupon[] = [
  { code: "KURIO10", percentOff: 10, expiresAt: "2099-12-31" },
  { code: "GENESIS5", percentOff: 5, expiresAt: "2026-01-31" },
]
