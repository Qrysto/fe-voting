import { rcvTable, rcvKey } from '@/constants';

export async function GET() {
  const body = JSON.stringify({
    table: rcvTable,
  });
  const res = await fetch(
    `http://node5.nexus.io:7080/local/list/records?table=${rcvTable}`,
    {
      cache: 'no-store',
      headers: {
        Authorization: `Basic ${process.env.API_BASIC_AUTH}`,
        'Content-Type': 'application/json',
      },
      body,
    }
  );
  if (!res.ok) {
    const err = await res.json();
    console.error('Failed to get RCV result', res.status, err);
    throw err;
  }

  const json = await res.json();
  const resultJson = json?.result?.[rcvKey];
  const result = (resultJson && JSON.parse(resultJson)) || null;

  return Response.json({ result });
}
