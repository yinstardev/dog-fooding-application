import { createSlice } from '@reduxjs/toolkit';
import { AuthType, init } from '@thoughtspot/visual-embed-sdk';
import { LIVEBOARD_ID, THOUGHTSPOT_HOST } from '../../environment';
import { fetchUserAndToken } from '@app/api/getUserAndToken';

export interface TseState {
  tseInitialized: boolean;
}

const initialState = {
  tseInitializationStarted: false,
  tseInitialized: false,
  host: THOUGHTSPOT_HOST,
  supportCentralLiveboard: LIVEBOARD_ID || '',
};

export const tseSlice = createSlice({
  name: 'tse',
  initialState,
  reducers: {
    setTseInitialized: (state, action) => {
      state.tseInitialized = action.payload;
    },
    startTseInitialization: (state) => {
      if (state.tseInitialized || state.tseInitializationStarted) {
        return;
      }
      console.log('here init', initialState.host);
      init({
        thoughtSpotHost: initialState.host,
        authType: AuthType.TrustedAuthTokenCookieless,
        getAuthToken: async () => {
          const { token } = await fetchUserAndToken();
          if (!token) return '';
          return token;
        },
      });

      state.tseInitialized = true;
    },
    logoutState: (state) => {
      if (!state.tseInitialized && !state.tseInitializationStarted) {
        return;
      }
    },
  },
});

export const { startTseInitialization, setTseInitialized, logoutState } = tseSlice.actions;

export default tseSlice.reducer;
