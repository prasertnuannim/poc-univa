import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getThaiHour() {
  const hh = new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    hour12: false,
    timeZone: "Asia/Bangkok",
  }).format(new Date());

  return Number(hh); // 0-23
}

const THAI_TIME_OFFSET_HOURS = 7; 
const HOUR_LABEL_REGEX = /^(\d{2}):00$/; 

export function toThaiHourLabel(label: string) { 
  const match = HOUR_LABEL_REGEX.exec(label); 
  if (!match) return label; const hour = Number(match[1]); 
  if (Number.isNaN(hour) || hour < 0 || hour > 23) 
    return label; 
  const thaiHour = (hour + THAI_TIME_OFFSET_HOURS) % 24; 
  return `${String(thaiHour).padStart(2, "0")}:00`; }