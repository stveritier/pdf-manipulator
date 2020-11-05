import React from 'react';
import { Header } from '../Header';
import { FileSelectionForm } from '../FileSelectionForm';

const MainPage = (): JSX.Element => {
  return (
    <>
      <Header />
      <div className="content-container">
        <FileSelectionForm />
      </div>
    </>
  );
};

export default MainPage;
