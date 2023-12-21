import React from 'react';

export interface SidebarNavigationItem {
  title: string;
  key: string;
  url?: string;
  children?: SidebarNavigationItem[];
  icon?: React.ReactNode;
}

export const sidebarNavigation: SidebarNavigationItem[] = [
  {
    title: 'common.home',
    key: 'home',
    url: '/dashboard',
  },
  // {
  //   title: 'Support-Central',
  //   key: 'liveboard',
  //   url: '/liveboard',
  // },
  // {
  //   title: 'home-2',
  //   key: 'home-2',
  //   url: '/dfg/home',
  // },
  {
    title: 'Support Central',
    key: 'support-central',
    url: '/support-central',
  },
  {
    title: 'Champagne',
    key: 'champagne',
    url: '/champagne',
  },
];
