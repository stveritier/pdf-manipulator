import React from 'react';
import { Grid } from '@material-ui/core';
import { Header } from '../../features/components/Header';
import { FileSelectionForm } from '../../features/components/FileSelectionForm';

const MainPage = (): JSX.Element => {
  return (
    <>
      <Header />
      <Grid
        container
        justify="center"
        alignItems="center"
        style={{ paddingTop: '1rem', maxWidth: '80rem' }}>
        <Grid item>
          <FileSelectionForm />
        </Grid>
      </Grid>
    </>
  );
};

export default MainPage;
