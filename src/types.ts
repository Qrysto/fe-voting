export interface Candidate {
  owner: string;
  version: number;
  created: number;
  modified: number;
  type: string;
  form: string;
  Name: string;
  Party: string;
  Website: string;
  active: number;
  balance: number;
  token: string;
  address: string;
  // Added
  percentage: number;
}
