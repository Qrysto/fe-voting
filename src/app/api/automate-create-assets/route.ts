import { maxChoices } from '@/constants';

const tokenAddress = '8DkBdZWSRuaLHtNxaxxm5AU8jTL9Mm5hDJw9LvrLnP1zrKC62bZ';
const candidates = [
  {
    First: 'Chase',
    Last: 'Oliver',
    Party: 'Libertarian',
    Website: 'http://votechaseoliver.com',
    active: 1,
    balance: 0,
    choice: 1,
    token: tokenAddress,
  },
  {
    First: 'Lars',
    Last: 'Mapstead',
    Party: 'Libertarian',
    Website: 'http://lars24.com',
    active: 1,
    balance: 0,
    choice: 1,
    token: tokenAddress,
  },
  {
    First: 'Jasmine',
    Last: 'Sherman',
    Party: 'Green',
    Website: 'https://linktr.ee/fat_socialist',
    active: 1,
    balance: 0,
    choice: 1,
    token: tokenAddress,
  },
  {
    First: 'Jill',
    Last: 'Stein',
    Party: 'Green',
    Website: 'http://illstein2024.com',
    active: 1,
    balance: 0,
    choice: 1,
    token: tokenAddress,
  },
  {
    First: 'Claudia',
    Last: 'De La Cruz',
    Party: 'Socialist',
    Website: 'http://votesocialist2024.com',
    active: 1,
    balance: 0,
    choice: 1,
    token: tokenAddress,
  },
];

const choice1AssetsParams = {
  format: 'json',
  pin: process.env.SIGCHAIN_PIN,
  json: [
    {
      name: 'First',
      type: 'string',
      mutable: 'true',
    },
    {
      name: 'Last',
      type: 'string',
      mutable: 'true',
    },
    {
      name: 'Party',
      type: 'string',
      maxlength: 11,
      mutable: 'true',
    },
    {
      name: 'Website',
      type: 'string',
      maxlength: 50,
      mutable: 'true',
    },
    {
      name: 'active',
      type: 'uint8',
      mutable: 'true',
    },
    {
      name: 'balance',
      type: 'uint64',
      mutable: 'true',
    },
    {
      name: 'token',
      type: 'uint256',
      mutable: 'false',
    },
    {
      name: 'choice',
      type: 'uint8',
      mutable: 'false',
    },
  ],
};

const otherAssetsParams = {
  format: 'json',
  pin: process.env.SIGCHAIN_PIN,
  json: [
    {
      name: 'active',
      type: 'uint8',
      value: 1,
      mutable: 'true',
    },
    {
      name: 'balance',
      type: 'uint64',
      value: 0,
      mutable: 'true',
    },
    {
      name: 'token',
      type: 'uint256',
      value: tokenAddress,
      mutable: 'false',
    },
    {
      name: 'choice',
      type: 'uint8',
      mutable: 'false',
    },
    {
      name: 'reference',
      type: 'string',
      mutable: 'false',
    },
  ],
};

async function createChoice1Asset(candidate: any) {
  const params = { ...choice1AssetsParams };
  params.json = choice1AssetsParams.json.map((field) => ({
    ...field,
    value: candidate[field.name],
  }));
  const body = JSON.stringify(params);
  const res = await fetch('http://node5.nexus.io:7080/assets/create/account', {
    cache: 'no-store',
    method: 'POST',
    headers: {
      Authorization: `Basic ${process.env.API_BASIC_AUTH}`,
      'Content-Type': 'application/json',
    },
    body,
  });
  if (!res.ok) {
    const err = await res.json();
    console.error('assets/list/accounts', res.status, err);
    throw err;
  }
  const json = await res.json();
  console.log('Created choice 1');
  return json.result.address;
}

async function createOtherAsset(mainAddress: string, choice: number) {
  const params = { ...otherAssetsParams };
  params.json = otherAssetsParams.json.map((field) => ({
    ...field,
    value:
      field.name === 'choice'
        ? choice
        : field.name === 'reference'
          ? mainAddress
          : field.value,
  }));
  const body = JSON.stringify(params);
  const res = await fetch('http://node5.nexus.io:7080/assets/create/account', {
    cache: 'no-store',
    method: 'POST',
    headers: {
      Authorization: `Basic ${process.env.API_BASIC_AUTH}`,
      'Content-Type': 'application/json',
    },
    body,
  });
  if (!res.ok) {
    const err = await res.json();
    console.error('assets/list/accounts', res.status, err);
    throw err;
  }
  console.log('Created choice', choice);
}

async function createCandidate(candidate: any) {
  console.log('Creating assets for ', candidate.First, candidate.Last);
  const mainAddress = await createChoice1Asset(candidate);
  for (let choice = 2; choice <= maxChoices; choice++) {
    await createOtherAsset(mainAddress, choice);
  }
}

export async function GET() {
  for (let candidate of candidates) {
    await createCandidate(candidate);
  }
  return Response.json({ ok: true });
}
