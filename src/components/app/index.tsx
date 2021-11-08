import React, { FC, PropsWithChildren } from 'react';
import { ShaApplicationProvider, SidebarMenuDefaultsProvider, MainLayout } from 'shesha-reactjs';
import AuthContainer from 'components/authedContainer';

const backendUrl = process.env.STORYBOOK_BASE_URL || ''; // TODO: Make this configurable

export const StoryApp: FC<PropsWithChildren<any>> = ({ children }) => {
  return (
    <ShaApplicationProvider backendUrl={backendUrl}>
      <AuthContainer layout>
        <SidebarMenuDefaultsProvider items={[]}>
          <MainLayout title="Any title">{children}</MainLayout>
        </SidebarMenuDefaultsProvider>
      </AuthContainer>
    </ShaApplicationProvider>
  );
};

export default StoryApp;
