/**
 * @param {object} [nextCache] Next.js cache config to pass into fetch's `options.next`.
 * If empty, caching will be disabled and GET method will be used instead of POST.
 */
async function callNexusGeneric(
  baseUrl: string,
  endpoint: string,
  params?: object,
  nextCache?: NextFetchRequestConfig
) {
  const body = JSON.stringify(params);
  const res = await fetch(
    `${baseUrl}/${endpoint}${nextCache ? toQueryString(params) : ''}`,
    {
      cache: nextCache ? undefined : 'no-store',
      next: nextCache || undefined,
      method: nextCache ? 'GET' : 'POST',
      headers: {
        Authorization: `Basic ${process.env.API_BASIC_AUTH}`,
        'Content-Type': 'application/json',
      },
      body: nextCache ? undefined : body,
    }
  );
  const json = await res.json();

  if (res.ok) {
    return json?.result;
  } else {
    throw json?.error || new Error('Unknown error');
  }
}

function toQueryString(params?: object) {
  if (!params) return '';
  const query = Object.entries(params)
    .map(([key, value]) => `${key}=${value}`)
    .join('&');
  if (!query) return '';

  return `?${query}`;
}

export async function callNexusPrivate(
  endpoint: string,
  params?: object,
  nextCache?: NextFetchRequestConfig
) {
  return await callNexusGeneric(
    'http://node5.nexus.io:7080',
    endpoint,
    params,
    nextCache
  );
}

export async function callNexusMain(
  endpoint: string,
  params?: object,
  nextCache?: NextFetchRequestConfig
) {
  return await callNexusGeneric(
    'http://node2.nexus.io:8080',
    endpoint,
    params,
    nextCache
  );
}

export type CallNexus = typeof callNexusMain;
