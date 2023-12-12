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


const ts_url = process.env.TS_URL || '';


interface LoginFormData {
  email: string;
  password: string;
}

export const initValues: LoginFormData = {
  email: '',
  password: '',
};

/* 
  Init Function for the Login in SDK
  Using Cookieless Auth Token
*/
const do_init = (email: any, password: any) => {
  init({
    thoughtSpotHost: "https://champagne.thoughtspotstaging.cloud/",
    authType: AuthType.Basic,
    username: email,
    password: password,
    getAuthToken: async () => {
      const config = createConfiguration({
        baseServer: new ServerConfiguration("https://champagne.thoughtspotstaging.cloud/", {}),
      });
      const tsRestApiClient = new ThoughtSpotRestApi(config);
      const data = await tsRestApiClient.getFullAccessToken({
        username: email,
        password,
        validity_time_in_sec: 40,
      });

      return data.token;
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
    do_init(email, password); /* Init Function Called */

    // navigate('/dfg/dashboard');
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
