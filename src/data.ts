export interface Candidate {
  name: string;
  party: 'DEMOCRAT' | 'REPUBLICAN';
  thumbnail: string;
}

export const candidates: Candidate[] = [
  {
    name: 'Jane Smith',
    party: 'DEMOCRAT',
    thumbnail: '/candidates/pollOptionAnswerImageRectangle@2x.jpg',
  },
  {
    name: 'Bob Smith',
    party: 'REPUBLICAN',
    thumbnail: '/candidates/pollOptionAnswerImageRectangle_2@2x.jpg',
  },
  {
    name: 'Jake Jones',
    party: 'DEMOCRAT',
    thumbnail: '/candidates/pollOptionAnswerImageRectangle_3@2x.jpg',
  },
  {
    name: 'Samie Kills',
    party: 'REPUBLICAN',
    thumbnail: '/candidates/pollOptionAnswerImageRectangle_4@2x.jpg',
  },
  {
    name: 'Bob House',
    party: 'DEMOCRAT',
    thumbnail: '/candidates/pollOptionAnswerImageRectangle_5@2x.jpg',
  },
  {
    name: 'Sam Noniks',
    party: 'DEMOCRAT',
    thumbnail: '/candidates/pollOptionAnswerImageRectangle_6@2x.jpg',
  },
  {
    name: 'Erin Hives',
    party: 'DEMOCRAT',
    thumbnail: '/candidates/pollOptionAnswerImageRectangle_7@2x.jpg',
  },
  {
    name: 'Herry Jannis',
    party: 'DEMOCRAT',
    thumbnail: '/candidates/pollOptionAnswerImageRectangle_8@2x.jpg',
  },
  {
    name: 'Timmith Gorn',
    party: 'DEMOCRAT',
    thumbnail: '/candidates/pollOptionAnswerImageRectangle_9@2x.jpg',
  },
];
