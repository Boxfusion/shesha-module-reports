import React, { FC, PropsWithChildren } from 'react';
import { MetadataDispatcherProvider, ShaApplicationProvider, SidebarMenuDefaultsProvider } from '@shesha/reactjs';
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
  const renderChildren = () => {
    try {
      const getLayout = (children as Array<any>)[0]?.type?.getLayout;

      return typeof getLayout === 'function' ? getLayout(children) : children;
    } catch (error) {
      return children;
    }
  };

  return (
    <ShaApplicationProvider backendUrl={process.env.STORYBOOK_BASE_URL || ''} router={DEFAULT_ROUTER as any}>
      <MetadataDispatcherProvider>
        <AuthContainer layout>
          <SidebarMenuDefaultsProvider items={[]}>{renderChildren()}</SidebarMenuDefaultsProvider>
        </AuthContainer>
      </MetadataDispatcherProvider>
    </ShaApplicationProvider>
  );
};

export default StoryApp;
