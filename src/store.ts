import { create } from 'zustand';
import { digitCount } from '@/constants';

type State = {
  phoneNumber: string;
  phoneDigits: string[];
};

type Actions = {
  setPhoneDigit: (index: number, digit: string) => void;
  confirmPhoneNumber: () => void;
  resetPhoneNumber: () => void;
};

export const useStore = create<State & Actions>((set) => ({
  phoneNumber: '',
  phoneDigits: Array(digitCount).fill(''),
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
