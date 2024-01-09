'use client';

import { create } from 'zustand';
import { phoneDigitCount, codeDigitCount } from '@/constants';

type State = {
  phoneDigits: string[];
  codeDigits: string[];
  phoneNumber: string;
  confirmedCode: boolean;
};

type Actions = {
  setPhoneDigit: (index: number, digit: string) => void;
  setCodeDigit: (index: number, digit: string) => void;
  confirmPhoneNumber: () => void;
  resetPhoneNumber: () => void;
  confirmCode: () => void;
  unconfirmCode: () => void;
  goBack: () => void;
};

export const useStore = create<State & Actions>((set, get) => ({
  phoneDigits: Array(phoneDigitCount).fill(''),
  codeDigits: Array(codeDigitCount).fill(''),
  phoneNumber: '',
  confirmedCode: false,
  setPhoneDigit: (index: number, digit: string) =>
    set((state) => {
      const newDigits = [...state.phoneDigits];
      newDigits.splice(index, 1, digit);
      return { phoneDigits: newDigits };
    }),
  setCodeDigit: (index: number, digit: string) =>
    set((state) => {
      const newDigits = [...state.codeDigits];
      newDigits.splice(index, 1, digit);
      return { codeDigits: newDigits };
    }),
  confirmPhoneNumber: () =>
    set((state) => ({
      phoneNumber: state.phoneDigits.join(''),
    })),
  resetPhoneNumber: () => set({ phoneNumber: '' }),
  confirmCode: () => set({ confirmedCode: true }),
  unconfirmCode: () => set({ confirmedCode: false }),
  goBack: () => {
    const state = get();
    if (state.confirmedCode) {
      set({ confirmedCode: false });
    } else if (state.phoneNumber) {
      set({ phoneNumber: '' });
    }
  },
}));

export const useStep = () =>
  useStore((state) => (!state.phoneNumber ? 1 : !state.confirmedCode ? 2 : 3));