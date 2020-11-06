import React from 'react';
import { Backdrop, CircularProgress } from '@material-ui/core';

interface LoadingModalProps {
  loading: boolean;
}

const LoadingScreen = ({ loading }: LoadingModalProps): JSX.Element => {
  return loading ? (
    <>
      <Backdrop
        open
        style={{
          position: 'fixed',
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          zIndex: 1201,
          opacity: 2,
        }}>
        <CircularProgress color="primary" />
      </Backdrop>
    </>
  ) : null;
};

export { LoadingScreen };
