/**
 * @param {object} [nextCache] Next.js cache config to pass into fetch's `options.next`.
 * If empty, caching will be disabled and GET method will be used instead of POST.
 */
export async function callNexus(
  endpoint: string,
  params?: object,
  nextCache?: object
) {
  const body = JSON.stringify(params);
  const res = await fetch(`http://node5.nexus.io:7080/${endpoint}`, {
    cache: nextCache ? undefined : 'no-store',
    next: nextCache || undefined,
    method: nextCache ? 'GET' : 'POST',
    headers: {
      Authorization: `Basic ${process.env.API_BASIC_AUTH}`,
      'Content-Type': 'application/json',
    },
    body: body,
  });
  const json = await res.json();

  if (res.ok) {
    return json?.result;
  } else {
    throw json?.error || new Error('Unknown error');
  }
}
