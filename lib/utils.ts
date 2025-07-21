import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function isMobile(): boolean {
  if (typeof window === "undefined") return false;
  return /iPhone|Android.+Mobile|iPad|iPod/.test(navigator.userAgent);
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
