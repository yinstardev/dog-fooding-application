import axios from 'axios';

// export const fetchUserAndToken = async () => {
//   try {
//     const userResponse = await axios.get('http://localhost:1337/whoami', { withCredentials: true });
//     if (userResponse.data && userResponse.data.user && userResponse.data.user.nameID) {
//       const tokenResponse = await axios.post('http://localhost:1337/getAuthToken', {}, {
//         headers: { 'Content-Type': 'application/json' }
//       });
//       return { email: userResponse.data.user.nameID, token: tokenResponse.data };
//     } else {
//       window.location.replace('http://localhost:1337/login');
//       return { email: '', token: '' };
//     }
//   } catch (error) {
//     console.error('Error fetching data:', error);
//     window.location.replace('http://localhost:1337/login');
//     return { email: '', token: '' };
//   }
// };

const be_url = process.env.REACT_APP_BE_URL || '';

const getJwtTokenFromLocalStorage = () => {
  // Retrieve the JWT token from localStorage
  const token = localStorage.getItem('token');
  return token;
};

export const fetchUserAndToken = async () => {
  try {
    // Retrieve the JWT token from a secure place, e.g., HttpOnly cookie
    const jwtToken = getJwtTokenFromLocalStorage(); // Replace with your JWT token retrieval logic

    // if (!jwtToken && window.location.pathname !== '/login') {
    //   // If no JWT token is available, redirect to the login page
    //   window.location.replace(`${be_url}/login`);
    //   return { email: '', token: '' };
    // }

    // Use the JWT token to authenticate the request to the /whoami endpoint
    const userResponse = await axios.get(`${be_url}/whoami`, {
      withCredentials: true,
    });
    console.log('inside fetch user token');

    if (userResponse.data && userResponse.data.user && userResponse.data.user.nameID) {
      // Now fetch the different token that you need for global state
      const tokenResponse = await axios.post(
        `${be_url}/getauthtoken`,
        {},
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        },
      );
      console.log('Token retrieved ig. ', tokenResponse.data);
      // Return both the user details and the different token
      return { email: userResponse.data.user.nameID, token: tokenResponse.data };
    } else {
      window.location.replace(`${be_url}/login`);
      console.log('not able to fetch ');
      return { email: '', token: '' };
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    window.location.replace(`${be_url}/login`);
    return { email: '', token: '' };
  }
};
