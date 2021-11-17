import { Alert, Button, Form, Input, Modal } from 'antd';
import React, { FC, useState } from 'react';
import classNames from 'classnames';
import { ShaRoutingProvider, SidebarMenuProvider, useAuth, SectionSeparator } from '@shesha/reactjs';

import './index.less';

export const ACCESS_TOKEN_NAME = 'xDFcxiooPQxazdndDsdRSerWQPlincytLDCarcxVxv';

const { Item } = Form;

interface ILoginForm {
  baseUrl: string;
  userNameOrEmailAddress: string;
  password: string;
}

interface IAuthContainerProps {
  layout?: boolean;
}

const AuthContainer: FC<IAuthContainerProps> = ({ children, layout = false }) => {
  const [isSignInModalVisible, setSignInModalVisibility] = useState(false);

  const { loginUser, logoutUser, isInProgress, loginInfo } = useAuth();
  const isLoggedIn = Boolean(loginInfo?.userName);

  const [loginForm] = Form.useForm();

  const showSignInModal = () => setSignInModalVisibility(true);
  const hideSignInModal = () => setSignInModalVisibility(false);

  const login = ({ baseUrl, ...payload }: ILoginForm) => {
    if (loginUser) {
      loginUser({
        password: payload.password,
        userNameOrEmailAddress: payload.userNameOrEmailAddress,
      });
    }
  };

  const logout = () => {
    if (logoutUser) {
      logoutUser();
    }
  };

  return (
    <div className="sha-storybook-authenticated-container">
      {layout ||
        (!isLoggedIn && (
          <>
            <div className="sha-storybook-authenticated-action-btn">
              {isLoggedIn ? (
                <Button type="primary" onClick={logout} danger>
                  Logout
                </Button>
              ) : (
                <Button type="primary" onClick={showSignInModal}>
                  Authorize
                </Button>
              )}
            </div>

            <SectionSeparator sectionName="" />
          </>
        ))}

      {isLoggedIn ? (
        <ShaRoutingProvider>
          <SidebarMenuProvider items={[]}>
            <div className={classNames({ 'sha-storybook-authenticated-container-layout': layout })}>{children}</div>
          </SidebarMenuProvider>
        </ShaRoutingProvider>
      ) : (
        <>
          <div className="sha-storybook-authenticated-action-btn">
            <Button type="primary" onClick={showSignInModal}>
              Authorize
            </Button>
          </div>
          <Alert
            message="Not authorized"
            description="Please make sure you are authorized before accessing this content"
            showIcon
            type="warning"
          />
        </>
      )}

      <Modal
        title="Login"
        visible={isSignInModalVisible}
        onCancel={hideSignInModal}
        onOk={() => loginForm?.submit()}
        okButtonProps={{ loading: isInProgress?.loginUser || false }}
      >
        <Form form={loginForm} onFinish={login}>
          <Item name="userNameOrEmailAddress" rules={[{ required: true }]}>
            <Input placeholder="username" />
          </Item>

          <Item name="password" rules={[{ required: true }]}>
            <Input.Password placeholder="password" />
          </Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AuthContainer;
