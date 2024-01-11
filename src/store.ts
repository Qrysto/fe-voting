'use client';

import { create } from 'zustand';
import axios from 'axios';
import { phoneDigitCount, codeDigitCount } from '@/constants';

type State = {
  phoneDigits: string[];
  phoneError: string | null;
  codeDigits: string[];
  codeError: string | null;
  phoneNumber: string;
  confirmedCode: boolean;
  votes: string[];
};

type Actions = {
  setPhoneDigit: (index: number, digit: string) => void;
  setCodeDigit: (index: number, digit: string) => void;
  confirmPhoneNumber: () => Promise<void>;
  resetPhoneNumber: () => void;
  confirmCode: () => Promise<void>;
  unconfirmCode: () => void;
  addVote: (id: string) => void;
  removeVote: (id: string) => void;
  resetVote: () => void;
  goBack: () => void;
};

const defaultCodeDigits = Array(codeDigitCount).fill('');

export const useStore = create<State & Actions>((set, get) => ({
  phoneDigits: Array(phoneDigitCount).fill(''),
  phoneError: null,
  codeDigits: defaultCodeDigits,
  codeError: null,
  phoneNumber: '',
  confirmedCode: false,
  votes: [],
  setPhoneDigit: (index: number, digit: string) =>
    set((state) => {
      const newDigits = [...state.phoneDigits];
      newDigits.splice(index, 1, digit);
      return { phoneDigits: newDigits, phoneError: null };
    }),
  setCodeDigit: (index: number, digit: string) =>
    set((state) => {
      const newDigits = [...state.codeDigits];
      newDigits.splice(index, 1, digit);
      return { codeDigits: newDigits, codeError: null };
    }),
  confirmPhoneNumber: async () => {
    const phoneNumber = get().phoneDigits.join('');
    try {
      const { data } = await axios.post('/api/verify-phone', { phoneNumber });
      console.log('verfication', data.verfication);
      set({
        phoneNumber,
        phoneError: null,
        codeDigits: defaultCodeDigits,
      });
    } catch (err: any) {
      set({
        phoneError: err?.message || err?.error?.message || 'Unknown error',
      });
    }
  },
  resetPhoneNumber: () => set({ phoneNumber: '', phoneError: null }),
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
      set({
        confirmedCode: false,
        codeDigits: defaultCodeDigits,
        codeError: null,
      });
    } else if (state.phoneNumber) {
      set({ phoneNumber: '', phoneError: null });
    }
  },
}));

export const useStep = () =>
  useStore((state) => (!state.phoneNumber ? 1 : !state.confirmedCode ? 2 : 3));
