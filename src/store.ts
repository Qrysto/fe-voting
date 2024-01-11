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
  jwtToken: string | null;
  votes: string[];
};

type Actions = {
  setPhoneDigits: (index: number, digit: string) => number;
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
  jwtToken: null,
  votes: [],
  setPhoneDigits: (index: number, digits: string) => {
    const trimmedDigits =
      index + digits.length > phoneDigitCount
        ? digits.substring(0, phoneDigitCount - index)
        : digits;
    set((state) => {
      const newDigits = [...state.phoneDigits];
      if (!digits) {
        newDigits.splice(index, 1, '');
      } else {
        newDigits.splice(
          index,
          trimmedDigits.length,
          ...trimmedDigits.split('')
        );
      }
      return { phoneDigits: newDigits, phoneError: null };
    });
    return index + trimmedDigits.length;
  },
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
      console.log('data', data);
      set({
        phoneNumber,
        phoneError: null,
        codeDigits: defaultCodeDigits,
        codeError: null,
      });
    } catch (err: any) {
      set({
        phoneError: err?.message || err?.error?.message || 'Unknown error',
      });
    }
  },
  resetPhoneNumber: () => set({ phoneNumber: '', phoneError: null }),
  confirmCode: async () => {
    const code = get().codeDigits.join('');
    try {
      const { data } = await axios.post('/api/verify-code', {
        phoneNumber: get().phoneNumber,
        code,
      });
      console.log('data', data);
      set({
        jwtToken: data.token,
        codeError: null,
      });
    } catch (err: any) {
      set({
        codeError: err?.message || err?.error?.message || 'Unknown error',
      });
    }
  },
  unconfirmCode: () => set({ jwtToken: null }),
  addVote: (id: string) =>
    set((state) => ({
      votes: state.votes.length < 6 ? [...state.votes, id] : state.votes,
    })),
  removeVote: (id: string) =>
    set((state) => ({ votes: state.votes.filter((cid) => cid !== id) })),
  resetVote: () => set({ votes: [] }),
  goBack: () => {
    const state = get();
    if (state.jwtToken) {
      set({
        jwtToken: null,
        codeDigits: defaultCodeDigits,
        codeError: null,
      });
    } else if (state.phoneNumber) {
      set({ phoneNumber: '', phoneError: null });
    }
  },
}));

export const useStep = () =>
  useStore((state) => (!state.phoneNumber ? 1 : !state.jwtToken ? 2 : 3));
