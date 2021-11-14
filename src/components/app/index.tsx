import React, { FC, PropsWithChildren } from 'react';
import { ShaApplicationProvider, SidebarMenuDefaultsProvider } from 'shesha-reactjs';
import AuthContainer from 'components/authedContainer';

export const StoryApp: FC<PropsWithChildren<any>> = ({ children }) => {
  return (
    <ShaApplicationProvider backendUrl={process.env.STORYBOOK_BASE_URL || ''}>
      <AuthContainer layout>
        <SidebarMenuDefaultsProvider items={[]}>{children}</SidebarMenuDefaultsProvider>
      </AuthContainer>
    </ShaApplicationProvider>
  );
};

export default StoryApp;
