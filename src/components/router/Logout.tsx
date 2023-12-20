import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@app/hooks/reduxHooks';
import { Navigate } from 'react-router-dom';
import { doLogout } from '@app/store/slices/authSlice';
import { startTseInitialization } from '@app/store/slices/tseSlice';

const Logout: React.FC = () => {
  const tseState = useAppSelector((state) => state.tse);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!tseState.tseInitialized) {
      dispatch(startTseInitialization());
    } else {
      dispatch(doLogout());
    }
  }, [dispatch, tseState.tseInitialized]);

  if (!tseState.tseInitialized) {
    return <div>Tse not initialized yet</div>;
  }

  return <Navigate to="/auth/login" replace />;
};

export default Logout;
