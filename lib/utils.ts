import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility function to merge Tailwind CSS classes.
 * This combines clsx (for conditional classes) with tailwind-merge
 * (to handle conflicting Tailwind classes correctly).
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
