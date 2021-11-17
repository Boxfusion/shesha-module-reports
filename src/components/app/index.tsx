import React, { FC, PropsWithChildren } from 'react';
import { ShaApplicationProvider, SidebarMenuDefaultsProvider } from '@shesha/reactjs';
import AuthContainer from 'components/authedContainer';

const DEFAULT_ROUTER = {
  route: '',
  pathname: '',
  query: {},
  asPath: '',
  basePath: '',
  components: {},
  sde: {},
  clc: null,
  pageLoader: undefined,
  push(url: string) {
    return new Promise((resolve) => {
      if (url) {
        resolve(true);
      }
    });
  },
};

export const StoryApp: FC<PropsWithChildren<any>> = ({ children }) => {
  return (
    <ShaApplicationProvider backendUrl={process.env.STORYBOOK_BASE_URL || ''} router={DEFAULT_ROUTER as any}>
      <AuthContainer layout>
        <SidebarMenuDefaultsProvider items={[]}>{children}</SidebarMenuDefaultsProvider>
      </AuthContainer>
    </ShaApplicationProvider>
  );
};

export default StoryApp;
