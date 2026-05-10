export function formatCurrency(value) {
  const number = Number(value || 0);
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(number);
}

export function formatCompactCurrency(value) {
  const number = Number(value || 0);
  if (Math.abs(number) >= 1000) {
    return `$${number.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
  }
  return formatCurrency(number);
}

export function formatDate(value) {
  if (!value) return '-';
  const date = value instanceof Date ? value : new Date(value);
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

export function formatDateRange(start, end) {
  return `${formatDate(start)} - ${formatDate(end)}`;
}

export function toIsoDate(value) {
  const date = value instanceof Date ? value : new Date(value);
  return date.toISOString().slice(0, 10);
}

export function titleCase(value = '') {
  return String(value)
    .split(' ')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

export function delay(ms = 450) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

export function addDays(value, days = 1) {
  const date = value instanceof Date ? new Date(value) : new Date(value);
  date.setDate(date.getDate() + Number(days || 0));
  return date;
}

export function addDaysIso(value, days = 1) {
  return toIsoDate(addDays(value, days));
}
