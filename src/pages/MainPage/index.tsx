import React from 'react';
import { Header } from '../../features/components/Header';
import { FileSelectionForm } from '../../features/components/FileSelectionForm';

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
