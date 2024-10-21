import { kv } from '@vercel/kv';
import { phoneNumbersTable } from '@/constants/activePoll';
import { callNexus } from '@/constants/activePoll';
import { lookupResultsTable, lookupKvKey } from '@/constants';

const regex = /^\d{10}$/;

export function isValidPhoneNumber(phoneNo: string) {
  return regex.test(phoneNo);
}

export const toE164US = (phoneNo: string) => '+1' + phoneNo;

export async function markNumberVoted(
  phoneNo: string,
  { votes, optedIn }: { votes: string[]; optedIn: boolean }
) {
  const params = {
    table: phoneNumbersTable,
    key: phoneNo,
    value: JSON.stringify({ votes, optedIn }),
  };
  const result = await callNexus('local/push/record', params);

  if (typeof result?.success !== 'boolean') {
    console.error('local/push/record', params, result);
    throw new Error('Unexpected response');
  }
  // success === false when there is already a record with the same key
  return result.success;
}

export async function markNumberNotVoted(phoneNo: string) {
  const params = {
    table: phoneNumbersTable,
    key: phoneNo,
  };
  const result = await callNexus('local/erase/record', params);

  return result?.success;
}

export async function isVoted(phoneNo: string) {
  const params = {
    table: phoneNumbersTable,
    key: phoneNo,
  };
  const result = await callNexus('local/has/record', params);

  if (typeof result?.exists !== 'boolean') {
    console.error('local/has/record', params, result);
    throw new Error('Unexpected response');
  }
  return result.exists;
}

export async function getLookup(phoneNo: string) {
  try {
    return await kv.hget(lookupKvKey, phoneNo);
  } catch (err) {
    console.error('kv hget error', err);
  }
  return null;
}

export async function saveLookup(phoneNo: string, lookupResult: unknown) {
  try {
    return await kv.hset(lookupKvKey, { [phoneNo]: lookupResult });
  } catch (err) {
    console.error('kv hget error', err);
  }
}

//   const params = {
//     table: lookupResultsTable,
//     key: phoneNo,
//     value: JSON.stringify(lookupResult),
//   };
//   const result = await callNexus('local/push/record', params);

//   if (typeof result?.success !== 'boolean') {
//     console.error('local/push/record', params, result);
//     throw new Error('Unexpected response');
//   }
//   // success === false when there is already a record with the same key
//   return result.success;
// }
