/**
 * Formats a numeric currency amount into INR string format e.g. ₹1,250.00
 */
export function formatCurrencyINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Returns a human-friendly ETA and distance subtitle
 */
export function formatZoneMeta(city: string, distanceKm: number, etaMinutes: number): string {
  return `${city} · ${distanceKm} km · ${etaMinutes} min`;
}
