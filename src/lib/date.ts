export const THAI_TIME_ZONE = "Asia/Bangkok";

export function toDateInputValue(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function todayInTimeZone(timeZone: string = THAI_TIME_ZONE): string {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());

  const year = parts.find((part) => part.type === "year")?.value;
  const month = parts.find((part) => part.type === "month")?.value;
  const day = parts.find((part) => part.type === "day")?.value;

  if (!year || !month || !day) {
    return toDateInputValue(new Date());
  }

  return `${year}-${month}-${day}`;
}

export function yesterdayInTimeZone(timeZone: string = THAI_TIME_ZONE): string {
  const today = todayInTimeZone(timeZone);
  const d = new Date(`${today}T00:00:00`);
  d.setDate(d.getDate() - 1);
  return toDateInputValue(d);
}
