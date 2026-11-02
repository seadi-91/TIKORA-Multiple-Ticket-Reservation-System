export function formatCurrency(amount: number, currency: string = "ETB"): string {
  return `${amount.toLocaleString("en-US")} ${currency}`;
}

export default formatCurrency;

