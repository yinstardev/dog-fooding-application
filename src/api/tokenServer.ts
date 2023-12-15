const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();

app.use(bodyParser.json());

const username = process.env.REACT_APP_USERNAME;
const ts_url = process.env.REACT_APP_TS_URL;
const secret_key = process.env.REACT_APP_SECRET_KEY;

// saml - function to for callback

app.get('/api/getdata', async (req: any, res: any) => {
  res.status(200).json({
    name: 'primo',
    email: 'getdata@gmail.com',
  });
});

app.post('/api/get-token', async (req: any, res: any) => {
  const { username } = req.body; // Extract only the 'username' from the request body

  const validity_time_in_sec = 300;
  const org_id = 0;
  const auto_create = false;

  try {
    const response = await axios.post(
      'https://champagne.thoughtspotstaging.cloud/api/rest/2.0/auth/token/full',
      {
        username,
        validity_time_in_sec,
        org_id,
        auto_create,
        secret_key,
      },
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      },
    );

    res.json(response.data);
  } catch (error: any) {
    console.error('Error fetching authentication token:', error);

    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
});

module.exports = app;
