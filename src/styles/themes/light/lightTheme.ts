import { shadeColor } from '@app/utils/utils';
import { graphic } from 'echarts';
import { BASE_COLORS } from '../constants';
import { ITheme } from '../types';

const chartColors = {
  chartTooltipLabel: '#6a7985',
  chartColor1: '#ffffff',
  chartColor1Tint: '#ffffff', // update
  chartColor2: '#ffffff',
  chartColor2Tint: '#ffffff', // update
  chartColor3: '#ffffff',
  chartColor3Tint: '#ffffff', // update
  chartColor4: '#ffffff',
  chartColor4Tint: '#ffffff', // update
  chartColor5: '#ffffff',
  chartColor5Tint: '#ffffff', // update
  chartPrimaryGradient: new graphic.LinearGradient(0, 0, 0, 1, [
    {
      offset: 0,
      color: '#ffffff',
    },
    {
      offset: 1,
      color: 'ffffff',
    },
  ]),
  chartSecondaryGradient: new graphic.LinearGradient(0, 0, 0, 1, [
    {
      offset: 0,
      color: 'ffffff',
    },
    {
      offset: 1,
      color: 'rgba(255, 82, 82, 0)',
    },
  ]),
  chartSecondaryGradientSpecular: new graphic.LinearGradient(0, 0, 0, 1, [
    {
      offset: 0,
      color: 'rgba(255, 255, 255, 0)',
    },
    {
      offset: 1,
      color: 'rgba(255, 82, 82, 0.5)',
    },
  ]),
};

export const lightColorsTheme: ITheme = {
  primary: '#ffffff',
  primary1: '#000000',
  primaryGradient: 'linear-gradient(211.49deg, #dc88f5 15.89%, #339CFD 48.97%)',
  light: '#696969',
  secondary: '#0072DD',
  error: '#FF5252',
  warning: '#FFB765',
  success: '#57D682',
  background: '#6a6a6b',
  secondaryBackground: '#1c2137',
  secondaryBackgroundSelected: shadeColor('#1c2137', -5),
  additionalBackground: '#1D203E',
  collapseBackground: '#1D203E',
  timelineBackground: '#f5f5f5',
  siderBackground: '#ffffff',
  spinnerBase: '#339CFD',
  scroll: '#797C9A',
  border: '#1f2021',
  borderNft: '#797C9A',
  textMain: '#000000',
  textLight: '#9A9B9F',
  textSuperLight: '#444',
  textSecondary: '#ffffff',
  textDark: '#404040',
  textNftLight: '#797C9A',
  textSiderPrimary: '#339CFD',
  textSiderSecondary: '#797C9A',
  subText: '#a9a9a9',
  shadow: 'rgba(0, 0, 0, 0.07)',
  boxShadow: 'none',
  boxShadowHover: 'none',
  boxShadowNft: '0px 16px 24px rgba(0, 0, 0, 0.06), 0px 2px 6px rgba(0, 0, 0, 0.04), 0px 0px 1px rgba(0, 0, 0, 0.04)',
  boxShadowNftSecondary:
    '0px 10px 20px rgba(0, 0, 0, 0.04), 0px 2px 6px rgba(0, 0, 0, 0.04), 0px 0px 1px rgba(0, 0, 0, 0.04)',
  dashboardMapBackground: '#25284b',
  dashboardMapCircleColor: '#ACAEC1',
  dashboardMapControlDisabledBackground: '#7e7e7e',
  notificationSuccess: '#EFFFF4',
  notificationPrimary: '#D7EBFF',
  notificationWarning: '#FFF4E7',
  notificationError: '#FFE2E2',
  heading: BASE_COLORS.white,
  borderBase: '#080707',
  disable: '#080707',
  disabledBg: '#1c2137',
  layoutBodyBg: 'white',
  layoutHeaderBg: 'white',
  layoutSiderBg: 'white',
  inputPlaceholder: 'rgba(255, 255, 255, 0.5)',
  itemHoverBg: '#1c2137',
  backgroundColorBase: '#e4e5ed',
  avatarBg: '#1c2137',
  alertTextColor: '#000',
  breadcrumb: '#a9a9a9',
  icon: '#a9a9a9',
  iconHover: '#ffffff',
  ...chartColors,
};
