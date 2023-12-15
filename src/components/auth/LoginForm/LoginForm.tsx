import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { useAppDispatch } from '@app/hooks/reduxHooks';
import { doLogin } from '@app/store/slices/authSlice';
import { notificationController } from '@app/controllers/notificationController';
import { ReactComponent as FacebookIcon } from '@app/assets/icons/facebook.svg';
import { ReactComponent as GoogleIcon } from '@app/assets/icons/google.svg';
import * as S from './LoginForm.styles';
import * as Auth from '@app/components/layouts/AuthLayout/AuthLayout.styles';

import { ServerConfiguration, ThoughtSpotRestApi, createConfiguration } from '@thoughtspot/rest-api-sdk';
import { AuthEventEmitter, AuthStatus, AuthType, init } from '@thoughtspot/visual-embed-sdk';
import axios from 'axios';

const ts_url = process.env.REACT_APP_TS_URL || '';
const username = process.env.REACT_APP_USERNAME || '';
const password = process.env.REACT_APP_PASSWORD || '';

interface LoginFormData {
  email: string;
  password: string;
}

export const initValues: LoginFormData = {
  email: username,
  password: password,
};

/* 
  Init Function for the Login in SDK
  Using Cookieless Auth Token
*/
const do_init = (email: any, password: any) => {
  init({
    thoughtSpotHost: ts_url,
    authType: AuthType.TrustedAuthTokenCookieless,
    // username: email,
    // password: password,
    getAuthToken: async () => {
      // const config = createConfiguration({
      //   baseServer: new ServerConfiguration(ts_url, {}),
      // });
      // const tsRestApiClient = new ThoughtSpotRestApi(config);
      // const data = await tsRestApiClient.getFullAccessToken({
      //   username: email,
      //   password,
      //   validity_time_in_sec: 40,
      // });
      try {
        const response = await axios.post(
          'https://localhost:3000/api/get-token',
          {
            validity_time_in_sec: 300,
            org_id: 0,
            auto_create: false,
            secret_key: 'Some',
          },
          {
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
          },
        );

        return response.data.token;
      } catch (error) {
        console.error('Error fetching authentication token:', error);
        // Handle error or return a default value
        return '';
      }
    },
    autoLogin: true,
  });
};

export const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const [isLoading, setLoading] = useState(false);

  const handleSubmit = (values: LoginFormData) => {
    console.log(values);
    console.log('handling submit');
    const { email, password } = values;
    console.log('Haha Email : ', email);
    setLoading(true);
    console.log('before just axios post ');

    do_init(email, password); /* Init Function Called */
    // navigate('https://dev-01842717.okta.com/app/dev-01842717_test1_1/exkdrboycze4bMJ9E5d7/sso/saml');
    // window.location.replace('https://dev-01842717.okta.com/app/dev-01842717_dogfoodingtest_1/exkdtyg9reZvzT3Vj5d7/sso/saml');

    // navigate('/dfg/dashboard');
    console.log('after navigating');
    dispatch(doLogin(values))
      .unwrap()
      .then(() => navigate('/dfg/dashboard'))
      .catch((err) => {
        notificationController.error({ message: err.message });
        setLoading(false);
      });
  };

  return (
    <Auth.FormWrapper>
      <BaseForm layout="vertical" onFinish={handleSubmit} requiredMark="optional" initialValues={initValues}>
        <Auth.FormTitle>{t('common.login')}</Auth.FormTitle>
        <Auth.FormItem
          name="email"
          label={t('common.email')}
          rules={[
            { required: true, message: t('common.requiredField') },
            {
              type: 'email',
              message: t('common.notValidEmail'),
            },
          ]}
        >
          <Auth.FormInput placeholder={t('common.email')} />
        </Auth.FormItem>
        <Auth.FormItem
          label={t('common.password')}
          name="password"
          rules={[{ required: true, message: t('common.requiredField') }]}
        >
          <Auth.FormInputPassword placeholder={t('common.password')} />
        </Auth.FormItem>
        <Auth.FormItem
          label={t('common.authtype')}
          name="authtype"
          rules={[{ required: true, message: t('common.requiredField') }]}
        >
          <Auth.StyledSelect
            popupClassName="popup-styles"
            dropdownStyle={{ background: 'white' }}
            className="select-bg"
            bordered
            options={[
              {
                label: 'CookieBasedAuth',
                options: [
                  { label: 'Basic', value: 'basicauth' },
                  { label: 'TokenBased', value: 'tokenbasedauth' },
                ],
              },
              {
                label: 'CookieLess',
                options: [{ label: 'cookieless', value: 'cookieless' }],
              },
            ]}
          />
        </Auth.FormItem>
        <BaseForm.Item noStyle>
          <Auth.SubmitButton type="primary" htmlType="submit" loading={isLoading}>
            {t('common.login')}
          </Auth.SubmitButton>
        </BaseForm.Item>
      </BaseForm>
    </Auth.FormWrapper>
  );
};
