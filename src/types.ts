export interface Candidate {
  owner: string;
  version: number;
  created: number;
  modified: number;
  type: string;
  form: string;
  Name: string;
  First: string;
  Last: string;
  Party: string;
  Website: string;
  active: number;
  balance: number;
  token: string;
  address: string;
  choice: number;
  reference: string;
  // Added
  percentage: number;
}
