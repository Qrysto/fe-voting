'use client';

import { create } from 'zustand';
import { phoneDigitCount, codeDigitCount } from '@/constants';

type State = {
  phoneDigits: string[];
  codeDigits: string[];
  phoneNumber: string;
  confirmedCode: boolean;
  votes: string[];
};

type Actions = {
  setPhoneDigit: (index: number, digit: string) => void;
  setCodeDigit: (index: number, digit: string) => void;
  confirmPhoneNumber: () => void;
  resetPhoneNumber: () => void;
  confirmCode: () => void;
  unconfirmCode: () => void;
  addVote: (id: string) => void;
  removeVote: (id: string) => void;
  resetVote: () => void;
  goBack: () => void;
};

const defaultCodeDigits = Array(codeDigitCount).fill('');

export const useStore = create<State & Actions>((set, get) => ({
  phoneDigits: Array(phoneDigitCount).fill(''),
  codeDigits: defaultCodeDigits,
  phoneNumber: '',
  confirmedCode: false,
  votes: [],
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
      codeDigits: defaultCodeDigits,
    })),
  resetPhoneNumber: () => set({ phoneNumber: '' }),
  confirmCode: () => set({ confirmedCode: true }),
  unconfirmCode: () => set({ confirmedCode: false }),
  addVote: (id: string) =>
    set((state) => ({
      votes: state.votes.length < 6 ? [...state.votes, id] : state.votes,
    })),
  removeVote: (id: string) =>
    set((state) => ({ votes: state.votes.filter((cid) => cid !== id) })),
  resetVote: () => set({ votes: [] }),
  goBack: () => {
    const state = get();
    if (state.confirmedCode) {
      set({ confirmedCode: false, codeDigits: defaultCodeDigits });
    } else if (state.phoneNumber) {
      set({ phoneNumber: '' });
    }
  },
}));

export const useStep = () =>
  useStore((state) => (!state.phoneNumber ? 1 : !state.confirmedCode ? 2 : 3));
