const regex = /^\d{10}$/;

export function isValidPhoneNumber(phoneNo: string) {
  return regex.test(phoneNo);
}

export const toE164US = (phoneNo: string) => '+1' + phoneNo;

export const addVoted = async (phoneNo: string) => {
  const body = JSON.stringify({
    name: phoneNo,
    register: '8EVUvzYSmgfqBf2qBHQwVkj1n1qhA9E4Mh6fpBM2EHqey71eFeW',
    pin: process.env.SIGCHAIN_PIN,
  });
  const res = await fetch('http://node5.nexus.io:7080/names/create/name', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${process.env.API_BASIC_AUTH}`,
      'Content-Type': 'application/json',
    },
    body,
  });
  if (!res.ok) {
    const json = await res.json();
    console.error('Add vote error', json);
    if (json?.error?.code === -32) {
      return { message: 'This phone number has already voted' };
    }
    return json?.error;
  }
  return null;
};

export const isVoted = async (phoneNo: string) => {
  try {
    const body = JSON.stringify({
      name: phoneNo,
    });
    const res = await fetch('http://node5.nexus.io:7080/names/get/name', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${process.env.API_BASIC_AUTH}`,
        'Content-Type': 'application/json',
      },
      body,
    });
    if (!res.ok) {
      console.error('Check voted error', await res.json());
      return false;
    }
    const json = await res.json();
    console.log('name list json', json);
    if (json?.result) {
      return true;
    }
    return false;
  } catch (err) {
    return false;
  }
};
