import { SECRET_KEY } from '@app/environment';

const ts_url = process.env.REACT_APP_TS_URL || '';
const ts_username = process.env.REACT_APP_USERNAME || '';

const url = `${ts_url}/callosum/v1/tspublic/v1/session/auth/token`;
const secretKey = SECRET_KEY;
const username = `${ts_username}`;
const accessLevel = 'FULL';

const headers = {
  'Content-Type': 'application/x-www-form-urlencoded',
  Accept: 'text/plain',
};

const body = new URLSearchParams({
  secret_key: secretKey,
  username: username,
  access_level: accessLevel,
});

export const getFullAccessToken = async (): Promise<[string | null, any]> => {
  let data: string | null = null;
  let error = null;

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: body,
    });
    data = await res.text();
  } catch (err) {
    error = err;
  }

  return [data, error];
};
