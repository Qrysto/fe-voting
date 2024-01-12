'use client';

import { create } from 'zustand';
import axios from 'axios';
import { phoneDigitCount, codeDigitCount } from '@/constants';
import { Candidate } from './data';

type State = {
  phoneDigits: string[];
  phoneError: string | null;
  codeDigits: string[];
  codeError: string | null;
  phoneNumber: string;
  jwtToken: string | null;
  votes: string[];
  allCandidates: Candidate[];
};

type Actions = {
  setPhoneDigit: (index: number, digit: string) => void;
  setCodeDigit: (index: number, digit: string) => void;
  setPhoneDigits: (startIndex: number, digits: string) => number;
  setCodeDigits: (startIndex: number, digits: string) => number;
  confirmPhoneNumber: () => Promise<void>;
  requestCode: (params: { phoneNumber: string }) => Promise<void>;
  resetPhoneNumber: () => void;
  confirmCode: () => Promise<void>;
  unconfirmCode: () => void;
  addVote: (id: string) => void;
  removeVote: (id: string) => void;
  resetVote: () => void;
  goBack: () => void;
  loadCandidates: (allCandidates: Candidate[]) => void;
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
  allCandidates: [],

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

  setPhoneDigits: (index: number, digits: string) => {
    const trimmedDigits =
      index + digits.length > phoneDigitCount
        ? digits.substring(0, phoneDigitCount - index)
        : digits;
    if (trimmedDigits) {
      const newDigits = [...get().phoneDigits];
      newDigits.splice(index, trimmedDigits.length, ...trimmedDigits.split(''));
      set({ phoneDigits: newDigits, phoneError: null });
    }
    const newIndex = index + trimmedDigits.length;
    return newIndex;
  },

  setCodeDigits: (index: number, digits: string) => {
    const trimmedDigits =
      index + digits.length > codeDigitCount
        ? digits.substring(0, codeDigitCount - index)
        : digits;
    if (trimmedDigits) {
      const newDigits = [...get().codeDigits];
      newDigits.splice(index, trimmedDigits.length, ...trimmedDigits.split(''));
      set({ codeDigits: newDigits, codeError: null });
    }
    const newIndex = index + trimmedDigits.length;
    return newIndex;
  },

  confirmPhoneNumber: async () => {
    const phoneNumber = get().phoneDigits.join('');
    return await get().requestCode({ phoneNumber });
  },

  requestCode: async ({ phoneNumber }: { phoneNumber: string }) => {
    phoneNumber = phoneNumber || get().phoneNumber;
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
      console.error(err);
      set({
        phoneError:
          err?.response?.data?.message || err?.message || 'Unknown error',
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
      console.error(err);
      set({
        codeError:
          err?.response?.data?.message || err?.message || 'Unknown error',
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

  loadCandidates: (allCandidates) => set({ allCandidates }),
}));

export const useStep = () =>
  useStore((state) => (!state.phoneNumber ? 1 : !state.jwtToken ? 2 : 3));
