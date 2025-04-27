import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// DTFS-specific helper functions

// Format currency with symbol
export function formatCurrency(amount: number, currency: string = "USD"): string {
  const symbols: Record<string, string> = {
    USD: "$",
    EUR: "€",
    PADC: "",
    DTFS: ""
  };

  const symbol = symbols[currency] || "";
  
  // Format the number with commas
  const formattedAmount = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: currency === "PADC" || currency === "DTFS" ? 0 : 2,
    maximumFractionDigits: currency === "PADC" || currency === "DTFS" ? 0 : 2,
  }).format(amount);
  
  return `${symbol}${formattedAmount}`;
}

// Format date based on locale
export function formatDate(date: Date | string): string {
  if (typeof date === "string") {
    date = new Date(date);
  }
  
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit"
  }).format(date);
}

// Get initials from name
export function getInitials(name: string): string {
  return name
    .split(" ")
    .map(part => part.charAt(0))
    .join("")
    .toUpperCase()
    .substring(0, 2);
}

// Truncate text with ellipsis
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
}

// Generate random id
export function generateId(): string {
  return Math.random().toString(36).substring(2, 10);
}

// Simulate smart contract approval
export function simulateSmartContractApproval(amount: number): Promise<boolean> {
  return new Promise((resolve) => {
    setTimeout(() => {
      // For simulation, approve transactions under $50,000
      resolve(amount < 50000);
    }, 1500);
  });
}
