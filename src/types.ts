export interface Choice {
  owner: string;
  version: number;
  created: number;
  modified: number;
  type: string;
  form: string;
  active: number;
  balance: number;
  token: string;
  ticker?: string;
  address: string;
  choice: number;
  reference: string;
}

export interface Candidate extends Choice {
  Name: string;
  First: string;
  Last: string;
  Party: string;
  Website: string;
  // Added
  percentage: number;
}

export interface Round {
  voteCount: { [address: string]: number };
  eliminated?: string;
  winner?: string;
}

export interface RCVResult {
  roundNo: number;
  rounds: {
    [roundNo: number]: Round;
  };
  timeStamp: number;
  final: boolean;
}

export type { CallNexus } from '@/app/lib/api';
