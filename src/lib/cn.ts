import { clsx, type ClassValue } from "clsx";

/**
 * Combines class names into a single string.
 * Useful for conditional styling with Tailwind CSS.
 */
export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}
