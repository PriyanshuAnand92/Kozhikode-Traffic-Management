export const formatPercent = (value: number) => `${Math.round(value)}%`;

export const formatDecimal = (value: number, digits = 1) => value.toFixed(digits);

export const formatClock = (date: Date) =>
  new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZone: 'Asia/Kolkata',
  }).format(date);

export const formatDateLong = (value: string | Date) =>
  new Intl.DateTimeFormat('en-GB', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'Asia/Kolkata',
  }).format(typeof value === 'string' ? new Date(value) : value);
