import React from 'react';
import { ThemeProvider } from '@material-ui/core';
import { appTheme } from '../core/plugins/material-ui/material-ui-theme/material-ui.theme';
import MainPage from '../pages/MainPage';

const App = (): JSX.Element => {
  return (
    <>
      <ThemeProvider theme={appTheme}>
        <MainPage />
      </ThemeProvider>
    </>
  );
};

export default App;
