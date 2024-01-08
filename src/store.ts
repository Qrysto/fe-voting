import { create } from 'zustand';
import { digitCount } from '@/constants';

type State = {
  phoneNumber: string;
  phoneDigits: string[];
};

type Actions = {
  setPhoneNumber: (phoneNumber: State['phoneNumber']) => void;
  setPhoneDigit: (index: number, digit: string) => void;
};

export const useStore = create<State & Actions>((set) => ({
  phoneNumber: '',
  phoneDigits: Array(digitCount).fill(''),
  setPhoneNumber: (phoneNumber: string) => {
    set({ phoneNumber });
  },
  setPhoneDigit: (index: number, digit: string) =>
    set((state) => {
      const newDigits = [...state.phoneDigits];
      newDigits.splice(index, 1, digit);
      return { phoneDigits: newDigits };
    }),
}));
