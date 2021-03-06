## @shesha/module-reports

[![GPL License](https://img.shields.io/npm/l/shesha-module-reports.svg?style=flat-square)](https://github.com/Boxfusion/shesha-module-reports/blob/main/LICENCE.md) [![docs](https://readthedocs.org/projects/pip/badge/?version=latest&style=plastic)](https://shesha-docs.readthedocs.io/en/latest/) [![shesha-module-reports-0.x.x](https://github.com/Boxfusion/shesha-module-reports/actions/workflows/shesha-module-reports-0.x.x.yml/badge.svg)](https://github.com/Boxfusion/shesha-module-reports/actions/workflows/shesha-module-reports-0.x.x.yml) [![Styled with Prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg?style=flat-square)](https://prettier.io/) [![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg?style=flat-square)](http://commitizen.github.io/cz-cli/) [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com) [![current version](https://img.shields.io/npm/dm/@shesha/module-reports.svg)](https://www.npmjs.com/package/commitizen) [![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release) [![GitHub contributors](https://badgen.net/github/contributors/Boxfusion/shesha-module-reports)](https://github.com/Boxfusion/shesha-module-reports/graphs/contributors) [![Npm package version](https://badgen.net/npm/v/@shesha/module-reports)](https://www.npmjs.com/package/@shesha/module-reports)

[![Star on GitHub](https://img.shields.io/github/stars/blackxored/generator-bxd-oss.svg?style=social)](https://github.com/Boxfusion/shesha-module-reports/stargazers) [![Watch on GitHub](https://img.shields.io/github/watchers/Boxfusion/shesha-module-reports.svg?style=social)](https://github.com/Boxfusion/shesha-module-reports/watchers)

# Getting started

#### Familiar with Git?

```
git clone https://github.com/Boxfusion/shesha-module-reports.git
cd shesha-module-reports
npm install
```

```
npm install
```

## Developing

To start the developing run :

```
npm run Storybook
```

This will build a version of your library, run the watcher and also run the Storybook.
To open the Storybook manually open your Browser and navigate to [http://localhost:6060](http://localhost:6060).
Start developing your components in `src/components` folder and update the `src/index.js` file accordingly.
Always provide an `YourComponent.stories.tsx` file, so your component will show up in the Storybook.
You can refer to example `Button` component, but i think you'll get the idea.

### Proposals (Babel)

For smoother development some Babel plugin are included

- [class-properties](https://github.com/babel/babel/tree/master/packages/babel-plugin-proposal-class-properties)
- [object-rest-spread](https://github.com/babel/babel/tree/master/packages/babel-plugin-proposal-object-rest-spread)
- [optional-chaining](https://github.com/babel/babel/tree/master/packages/babel-plugin-proposal-optional-chaining)

## Styling your components

`SCSS` and `CSS` are supported out of the box just import your styles into your component like you normaly would do.
For the use of `CSS Modules` refere to [rollup-plugin-postcss](https://github.com/egoist/rollup-plugin-postcss)

## Testing

Testing is done with [Jest](https://facebook.github.io/jest/), [Enzyme](http://airbnb.io/enzyme/) and [Jasmine Matchers](https://github.com/JamieMason/Jasmine-Matchers)
You can refer to `Button.test.js` as an example.

```
npm run test
```

or (for getting coverage)

```
npm run test:coverage
```

## Linting

Linting is set up through [ESLint](https://eslint.org/) and configured with [eslint-config-airbnb](https://www.npmjs.com/package/eslint-config-airbnb)
You can modify linting rules by overriding them in the `.eslintrc.json` file.

```
npm run lint
```

or (for for automatic fixing if possible)

```
npm run lint:fix
```

## Publishing your library to NPM

To release your library to NPM or your private Registry, make sure you have an active account at [NPM](https://www.npmjs.com/), your `.npmrc` file is correctly setup and the repository url in `package.json` file is set to your repository url, then:

```
npm publish
```

## Storybook

For custom layouts, styling and more information about the Styleguide please refer to [React Storybook](https://storybook.js.org/docs/react/get-started/introduction) documentation.

## Scripts

- `yarn start` : Only serves the Styleguide.
- `yarn build` : Builds your library (build can be faound in `dist` folder).
- `yarn styleguide:build` : Builds the static Styleguide in case you want to deploy it.
- `yarn test` : Runs the tests.
- `yarn test:coverage`: Runs the test and shows the coverage.
- `yarn lint` : Runs the linter, typescipt typecheck and stylelint.
- `yarn lint:fix` : Runs the linter, typescipt typecheck and stylelint and fixes automatic fixable issues.
- `yarn eslint`: Runs only the javascipt linter.
- `yarn eslint:fix`: Runs only the javascipt linter and fixes automatic fixable issues.
- `yarn stylelint`: Runs only the sytle linter.
- `yarn stylelint:fix`: Runs only the sytle linter and fixes automatic fixable issues.
- `yarn check-types`: Runs typescript type checker.
- `yarn release` : Publishes your Library on NPM or your private Registry (depending on your config in your `.npmrc` file).
- `yarn deploy`: Deploys the Styleguide to GitHub Pages.

## Resources

### Bundler

- [Rollup.js](https://rollupjs.org/guide/en)

### Code Formatter

- [Prettier](https://prettier.io/)

### Styleguide

- [React Storybook](https://storybook.js.org/docs/react/get-started/introduction)

### Styleguide

- [React Styleguidist](https://react-styleguidist.js.org/)

### Testing

- [Enzyme](http://airbnb.io/enzyme/)
- [Jest](https://facebook.github.io/jest/)

### Linting

- [ESLint](https://eslint.org/)
- [eslint-config-airbnb](https://www.npmjs.com/package/eslint-config-airbnb)
- [eslint-config-prettier](https://github.com/prettier/eslint-config-prettier)
- [stylelint-prettier](https://github.com/prettier/stylelint-prettier)
- [stylelint-scss](https://github.com/kristerkari/stylelint-scss)

### Compiler

- [Babel 7](https://babeljs.io/)
- [Typescript](https://www.typescriptlang.org/)
