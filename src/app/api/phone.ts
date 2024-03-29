import { phoneNumbersTable } from '@/constants';

const regex = /^\d{10}$/;

export function isValidPhoneNumber(phoneNo: string) {
  return regex.test(phoneNo);
}

export const toE164US = (phoneNo: string) => '+1' + phoneNo;

export const addVoted = async (phoneNo: string, txid: string) => {
  const body = JSON.stringify({
    table: phoneNumbersTable,
    key: phoneNo,
    value: txid,
  });
  const res = await fetch('http://node5.nexus.io:7080/local/push/record', {
    cache: 'no-store',
    method: 'POST',
    headers: {
      Authorization: `Basic ${process.env.API_BASIC_AUTH}`,
      'Content-Type': 'application/json',
    },
    body,
  });
  if (res.ok) {
    const json = await res.json();
    if (json?.result?.success) {
      return;
    }
  }

  const json = await res.json();
  console.error('push/record error', json);
  throw json?.error || new Error('Unknown error');
};

export const isVoted = async (phoneNo: string) => {
  try {
    const body = JSON.stringify({
      table: phoneNumbersTable,
      key: phoneNo,
    });
    const res = await fetch('http://node5.nexus.io:7080/local/has/record', {
      cache: 'no-store',
      method: 'POST',
      headers: {
        Authorization: `Basic ${process.env.API_BASIC_AUTH}`,
        'Content-Type': 'application/json',
      },
      body,
    });
    if (res.ok) {
      const json = await res.json();
      if (json?.result?.exists) {
        return true;
      }
    }
    console.error('has/record error', await res.json());
    return false;
  } catch (err) {
    return false;
  }
};
