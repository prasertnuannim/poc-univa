export function toThaiDate(date: Date): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Bangkok",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

export function toThaiDateTime(date: Date): string {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Bangkok",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
}

export function getThaiDayRange(date: string) {
  const startThai = new Date(`${date}T00:00:00+07:00`);
  const endThai = new Date(`${date}T23:59:59.999+07:00`);

  return {
    startUTC: new Date(startThai.toISOString()),
    endUTC: new Date(endThai.toISOString()),
  };
}
