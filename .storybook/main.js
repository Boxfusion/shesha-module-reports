// import babel from '../.babelrc';

module.exports = {
  'stories': ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  'addons': ['@storybook/addon-links', '@storybook/addon-essentials'],
  'core': {
    'builder': 'webpack5',
  },
  babel: async (options) => ({
    ...options,
    // any extra options you want to set
    plugins: [
      [
        'module-resolver',
        {
          'root': ['../src/'],
          'alias': {
            'apis': './src/apis',
            'components': './src/components',
            'styles': './src/styles',
            'hooks': './src/hooks',
          },
        },
      ],
    ],
  }),
  webpackFinal: async (config, { configType }) => {
    // `configType` has a value of 'DEVELOPMENT' or 'PRODUCTION'
    // You can change the configuration based on that.
    // 'PRODUCTION' is used when building the static version of storybook.

    config.resolve.fallback = { ...config.resolve.fallback, 'stream': false };

    // Make whatever fine-grained changes you need
    config.module.rules.push({
      test: /\.scss$/,
      use: ['style-loader', 'css-loader', 'sass-loader'],
    });

    config.module.rules.push({
      test: /\.less$/,
      use: [
        'style-loader',
        'css-loader',
        {
          loader: 'less-loader',
          options: {
            lessOptions: {
              javascriptEnabled: true,
              strictMath: false,
              noIeCompat: true,
              modifyVars: {
                '@primary-color': '#00ad5f',
                '@box-shadow': '0 1px 1px 0 rgba(0, 0, 0, 0.2)',
                '@background-color': '#f0f2f5',
                '@card-shadow': '0 2px 8px rgba(@primary-color, 0.09)',
                '@layout-body-background': 'white',
                '@padding-sm': '4px',
                '@padding-md': '8px',
                '@padding-lg': '12px',
                '@sha-transition-time': '0.3s',
                '@sha-transition-all': 'all @sha-transition-time ease-out',
                '@font-size-sm': '12px',
                '@border-style': '1px solid #e8e8e8',
                '@label-font-weight': '600',
                '@header-height': '37.5px',
                '@content-heading-height': '35px',
                '@sha-left-sidebar-width': '350px',
                '@sha-right-sidebar-width': '@sha-left-sidebar-width',
                '@sha-ant-transition': 'all 0.3s cubic-bezier(0.2, 0, 0, 1) 0s',
                '@layout-header-antd-background': '#001529',
                '@sha-border': '1px solid lightgrey',
                '@sha-column-filter-height': '550px',
                '@sha-collapsible-sidebar-btn-height': '35px',
                '@sider-collapsed-width': '60px',
                '@sider-expanded-width': '250px',
                '@layout-header-background': '#fff',
                '@layout-header-height': '55px',
                '@sha-page-heading-height': '45px',
                '@sha-page-toolbar-height': '33px',
                '@layout-header-padding': '0 50px',
                '@layout-footer-padding': '24px 50px',
                '@layout-footer-background': '@layout-body-background',
                '@layout-sider-background': '@layout-header-antd-background',
                '@layout-trigger-height': '@layout-header-height',
                '@layout-trigger-background': '#002140',
                '@layout-trigger-color': '#fff',
                '@layout-zero-trigger-width': '36px',
                '@layout-zero-trigger-height': '42px',
                '@layout-sider-background-light': '#fff',
                '@layout-trigger-background-light': '#fff',
                '@menu-dark-bg': '@layout-header-antd-background',
                '@menu-collapsed-width': '60px',
              },
            },
          },
        },
      ],
    });

    return config;
  },
};
