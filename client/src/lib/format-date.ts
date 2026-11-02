export function formatDate(dateInput: string | Date | number): string {
  if (!dateInput) return "";
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return String(dateInput);

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export function formatTime(dateInput: string | Date | number): string {
  if (!dateInput) return "";
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  }).format(date);
}

export function formatDateTime(dateInput: string | Date | number): string {
  if (!dateInput) return "";
  return `${formatDate(dateInput)} at ${formatTime(dateInput)}`;
}

export default formatDate;

