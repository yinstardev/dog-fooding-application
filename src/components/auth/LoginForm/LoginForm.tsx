import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { doLogin } from '@app/store/slices/authSlice';
import { notificationController } from '@app/controllers/notificationController';
import './LoginForm.styles';
import * as Auth from '@app/components/layouts/AuthLayout/AuthLayout.styles';
import { useAppDispatch, useAppSelector } from '@app/hooks/reduxHooks';
import Cookies from 'js-cookie';

import { startTseInitialization, tseSlice } from '@app/store/slices/tseSlice';
import { fetchUserAndToken } from '@app/api/getUserAndToken';
import { setTseInitialized } from '@app/store/slices/tseSlice';

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

export const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const [isLoading, setLoading] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [token, setToken] = useState<string>('');
  const [formInitialValues, setFormInitialValues] = useState<LoginFormData>({
    email: 'prinostaged@gmail.com',
    password: 'egfe',
  });
  const tseState = useAppSelector((state) => state.tse);
  useEffect(() => {
    const initialize = async () => {
      const userData = await fetchUserAndToken();
      await setEmail(userData.email);
      setToken(userData.token);
      if (email) {
        setFormInitialValues({ email: email, password: 'random' });
      }
      if (!tseState.tseInitialized) {
        dispatch(startTseInitialization());
      }
      if (userData.token) {
        await dispatch(setTseInitialized(true));
      }
      console.log('init recorded');
    };

    initialize();
  }, [dispatch]);

  const handleSubmit = (values: LoginFormData) => {
    setLoading(true);
    // navigate('/dfg/dashboard');
    dispatch(doLogin(values))
      .unwrap()
      .then(() => {
        const allCookies = Cookies.get();
        for (const cookie in allCookies) {
          Cookies.remove(cookie);
        }
        navigate('/dashboard');
      })
      .catch((err: any) => {
        notificationController.error({ message: err.message });
        setLoading(false);
      });
  };

  return (
    <Auth.FormWrapper>
      <BaseForm
        key={JSON.stringify(formInitialValues)}
        layout="vertical"
        onFinish={handleSubmit}
        requiredMark="optional"
        initialValues={formInitialValues}
      >
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
          <Auth.FormInput placeholder={email} />
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
