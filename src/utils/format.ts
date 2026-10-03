/**
 * Formats a numeric amount into Paraguayan Guaraní currency representation.
 * Example: 18000 -> "₲ 18.000"
 */
export function formatGuarani(amount: number): string {
  const rounded = Math.round(amount);
  const formatted = rounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `₲ ${formatted}`;
}
