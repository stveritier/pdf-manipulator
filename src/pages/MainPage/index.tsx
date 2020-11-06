import React from 'react';
import { Grid } from '@material-ui/core';
import { ToastContainer } from 'react-toastify';
import { Header } from '../../features/components/Header';
import { FileSelectionForm } from '../../features/components/FileSelectionForm';
import 'react-toastify/dist/ReactToastify.css';

const MainPage = (): JSX.Element => {
  return (
    <>
      <ToastContainer
        position="bottom-center"
        autoClose={3000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable={false}
      />
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
