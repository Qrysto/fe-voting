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
