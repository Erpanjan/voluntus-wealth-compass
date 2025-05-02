
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Add formatDate function
export function formatDate(date: string): string {
  if (!date) return '';
  
  try {
    const dateObj = new Date(date);
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }).format(dateObj);
  } catch (error) {
    console.error('Error formatting date:', error);
    return date; // Return the original string if formatting fails
  }
}
