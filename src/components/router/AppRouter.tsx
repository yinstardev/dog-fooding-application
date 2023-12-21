import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

const AuthLayout = React.lazy(() => import('@app/components/layouts/AuthLayout/AuthLayout'));
import LoginPage from '@app/pages/LoginPage';
import LockPage from '@app/pages/LockPage';

import MainLayout from '@app/components/layouts/main/MainLayout/MainLayout';

import { ProtectedRoute } from '@app/components/router/RequireAuth';
import { withLoading } from '@app/hocs/withLoading.hoc';
// import HomePage from '@app/pages/DashboardPages/HomePage';
import { HomePage } from '../../pages/tse-embed/home-page';
import LiveboardPage from '@app/pages/DashboardPages/LiveboardPage';
import TokenHandler from './TokenHandler';
import { ChampagneFullApp } from '../../pages/tse-embed/full-app-champagne';
import { SupportCentral } from '../../pages/tse-embed/support-central-lib';
import DashboardPage from '@app/pages/DashboardPages/HomePage';

const Logout = React.lazy(() => import('./Logout'));

export const HOME_PATH = '/dfg';
export const LIVEBOARD_PATH = 'liveboard';

const AuthLayoutFallback = withLoading(AuthLayout);
const LogoutFallback = withLoading(Logout);

export const AppRouter: React.FC = () => {
  const protectedLayout = (
    <ProtectedRoute>
      <MainLayout />
    </ProtectedRoute>
  );

  return (
    <BrowserRouter>
      <Routes>
        {/* Need Redirect when user is logged in already. */}
        <Route path="/" element={<Navigate to="/auth/login" />} />
        <Route path="/token-handler" element={<TokenHandler />} />
        <Route path="/auth" element={<AuthLayoutFallback />}>
          <Route index path="login" element={<LoginPage />} />
          <Route
            path="lock"
            element={
              <ProtectedRoute>
                <LockPage />
              </ProtectedRoute>
            }
          />
        </Route>
        <Route path={HOME_PATH} element={protectedLayout}>
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="home" element={<HomePage />} />
          <Route path={LIVEBOARD_PATH} element={<LiveboardPage />} />
          <Route path="champagne" element={<ChampagneFullApp />} />
          <Route path="support-central" element={<SupportCentral />} />
        </Route>

        <Route path="/logout" element={<LogoutFallback />} />
        <Route path="/*" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
};
