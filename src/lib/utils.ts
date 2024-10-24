import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function partyColor(party: string) {
  switch (party.toUpperCase()) {
    case 'DEMOCRAT':
      return 'text-blue';
    case 'REPUBLICAN':
      return 'text-red';
    case 'GREEN':
      return 'text-green';
    case 'CONSTITUTION':
      return 'text-purple';
    case 'LIBERTARIAN':
      return 'text-orange';
    default:
      return 'text-brown';
  }
}
