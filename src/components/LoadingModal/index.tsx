import React from 'react';
import loaderGif from '../img/three-dots.svg';

interface LoadingModalProps {
  showLoadingModal: boolean;
}

const LoadingModal = ({ showLoadingModal }: LoadingModalProps): JSX.Element => {
  if (showLoadingModal === true) {
    return (
      <div className="loader">
        <img
          alt="loading animation"
          className="loader__image"
          src={loaderGif}
        />
      </div>
    );
  }
  return null;
};

export { LoadingModal };
