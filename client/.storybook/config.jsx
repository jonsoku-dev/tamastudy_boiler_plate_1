import React from 'react';
import { configure, addDecorator } from '@storybook/react';
import { ThemeProvider } from 'emotion-theming';
import theme from '../src/styles/theme';
import GlobalStyles from '../src/styles/GlobalStyles';

addDecorator(storyFn => (
  <ThemeProvider theme={theme}>
    <GlobalStyles />
    {storyFn()}
  </ThemeProvider>
));

// automatically import all files ending in *.stories.js
configure(require.context('../src', true, /\.stories\.(js|tsx)$/), module);
