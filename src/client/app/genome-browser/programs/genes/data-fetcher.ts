import type { RequestPayload } from '../../../../../shared/types/data-request';


/**
 * This is a very naive implementation of a fetcher.
 */

export const fetchData = async (payload: RequestPayload) => {
  const url = 'http://localhost:3000/data';
  const data = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(payload)
  }).then(response => response.json());

  return data;
};
