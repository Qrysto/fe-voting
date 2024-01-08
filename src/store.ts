'use client';

import { create } from 'zustand';
import { digitCount } from '@/constants';

type State = {
  phoneDigits: string[];
  phoneNumber: string;
  confirmedCode: boolean;
};

type Actions = {
  setPhoneDigit: (index: number, digit: string) => void;
  confirmPhoneNumber: () => void;
  resetPhoneNumber: () => void;
};

export const useStore = create<State & Actions>((set) => ({
  phoneDigits: Array(digitCount).fill(''),
  phoneNumber: '',
  confirmedCode: false,
  setPhoneDigit: (index: number, digit: string) =>
    set((state) => {
      const newDigits = [...state.phoneDigits];
      newDigits.splice(index, 1, digit);
      return { phoneDigits: newDigits };
    }),
  confirmPhoneNumber: () =>
    set((state) => ({
      phoneNumber: state.phoneDigits.join(''),
    })),
  resetPhoneNumber: () => set({ phoneNumber: '' }),
}));

export const useStep = () =>
  useStore((state) => (!state.phoneNumber ? 1 : !state.confirmedCode ? 2 : 3));
