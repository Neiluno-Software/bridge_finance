
export const formatAmount = (amount: string) => {
  const float = parseFloat(amount)
  if (!float) return 0
  return Number(float.toFixed(4))
}