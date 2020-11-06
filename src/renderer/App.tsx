import React from 'react';
import { CssBaseline, ThemeProvider } from '@material-ui/core';
import { appTheme } from '../core/plugins/material-ui.theme';
import MainPage from '../pages/MainPage';

const App = (): JSX.Element => {
  return (
    <>
      <ThemeProvider theme={appTheme}>
        <CssBaseline />
        <MainPage />
      </ThemeProvider>
    </>
  );
};

export default App;
