/**
 * Currency + date formatting helpers, centralized so a client swap
 * (currency, locale) only touches this file.
 */

const CURRENCY = "USD";
const LOCALE = "es-419";

export function formatPrice(amount: number) {
  return new Intl.NumberFormat(LOCALE, {
    style: "currency",
    currency: CURRENCY,
    minimumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(iso: string) {
  return new Intl.DateTimeFormat(LOCALE, {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(iso));
}
