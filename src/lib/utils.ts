import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Utilitário padrão para mesclar classes do Tailwind CSS (usado pelo Shadcn UI)
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Formata uma data no padrão brasileiro (DD/MM/AAAA)
export function formatDateBR(dateString: string): string {
  if (!dateString) return '';
  const [year, month, day] = dateString.split('-');
  return `${day}/${month}/${year}`;
}

// Retorna a quantidade de diárias entre check-in e check-out
export function calculateNights(checkIn: string, checkOut: string): number {
  if (!checkIn || !checkOut) return 0;
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}
