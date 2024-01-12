export interface CandidateOld {
  id: string;
  name: string;
  party: 'DEMOCRAT' | 'REPUBLICAN';
  thumbnail: string;
}

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

export const candidates: CandidateOld[] = [
  {
    id: '1',
    name: 'Jane Smith',
    party: 'DEMOCRAT',
    thumbnail: '/candidates/pollOptionAnswerImageRectangle@2x.jpg',
  },
  {
    id: '2',
    name: 'Bob Smith',
    party: 'REPUBLICAN',
    thumbnail: '/candidates/pollOptionAnswerImageRectangle_2@2x.jpg',
  },
  {
    id: '3',
    name: 'Jake Jones',
    party: 'DEMOCRAT',
    thumbnail: '/candidates/pollOptionAnswerImageRectangle_3@2x.jpg',
  },
  {
    id: '4',
    name: 'Samie Kills',
    party: 'REPUBLICAN',
    thumbnail: '/candidates/pollOptionAnswerImageRectangle_4@2x.jpg',
  },
  {
    id: '5',
    name: 'Bob House',
    party: 'DEMOCRAT',
    thumbnail: '/candidates/pollOptionAnswerImageRectangle_5@2x.jpg',
  },
  {
    id: '6',
    name: 'Sam Noniks',
    party: 'DEMOCRAT',
    thumbnail: '/candidates/pollOptionAnswerImageRectangle_6@2x.jpg',
  },
  {
    id: '7',
    name: 'Erin Hives',
    party: 'DEMOCRAT',
    thumbnail: '/candidates/pollOptionAnswerImageRectangle_7@2x.jpg',
  },
  {
    id: '8',
    name: 'Herry Jannis',
    party: 'DEMOCRAT',
    thumbnail: '/candidates/pollOptionAnswerImageRectangle_8@2x.jpg',
  },
  {
    id: '9',
    name: 'Timmith Gorn',
    party: 'DEMOCRAT',
    thumbnail: '/candidates/pollOptionAnswerImageRectangle_9@2x.jpg',
  },
];
