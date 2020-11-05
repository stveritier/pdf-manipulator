import React, { useState, FormEvent } from 'react';
import path from 'path';
import { homedir } from 'os';
import { readdirSync } from 'fs';
import { remote } from 'electron';
import { SelectedFilesList } from '../SelectedFileList';
import { LoadingModal } from '../LoadingModal';
import mergePDF from '../../utils/PDFProcessor';
import { saveDocToDisk } from '../../utils/saveDocToDisk';

const filters = [
  { name: 'Archivos', extensions: ['jpg', 'jpeg', 'png', 'pdf'] },
];

const FileSelectionForm = (): JSX.Element => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [outputPath, setOutputPath] = useState(homedir());
  const [fileName, setFileName] = useState('archivo-final.pdf');
  const [showLoadingModal, setShowLoadingModal] = useState(false);

  const handleClearSelection = () => {
    setSelectedFiles([]);
  };

  const handleFileSelect = () => {
    const userSelection = remote.dialog.showOpenDialogSync(
      remote.getCurrentWindow(),
      {
        properties: ['openFile', 'multiSelections'],
        filters,
      }
    );
    if (userSelection) {
      setSelectedFiles(selectedFiles.concat(userSelection));
    }
  };

  const handleFolderSelect = () => {
    const userSelection = remote.dialog.showOpenDialogSync(
      remote.getCurrentWindow(),
      {
        properties: ['openDirectory'],
        filters,
      }
    );

    if (userSelection) {
      const selectedDirectory = userSelection[0];
      const filesInFolder = readdirSync(selectedDirectory)
        .filter((file) => {
          const fileExtension = path.extname(file).replace('.', '');
          const isAllowed = filters[0].extensions.includes(fileExtension);
          return isAllowed;
        })
        .map((file) => {
          return path.join(selectedDirectory, file);
        });

      setSelectedFiles(filesInFolder);
    }
  };

  const handleSelectOutputFolder = () => {
    const userSelection = remote.dialog.showOpenDialogSync(
      remote.getCurrentWindow(),
      {
        properties: ['openDirectory'],
        filters,
      }
    );

    if (userSelection) {
      const selectedDirectory = userSelection[0];
      setOutputPath(selectedDirectory);
    }
  };

  const handleFileMerge = async () => {
    setShowLoadingModal(true);
    try {
      const mergedPDFBytes = await mergePDF(selectedFiles);
      await saveDocToDisk(outputPath, fileName, mergedPDFBytes);
      setSelectedFiles([]);
      setShowLoadingModal(false);
    } catch (error) {
      setShowLoadingModal(false);
    }
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <div>
      <LoadingModal showLoadingModal={showLoadingModal} />

      <form className="form" onSubmit={onSubmit}>
        <div className="button-group">
          <button className="button" type="button" onClick={handleFileSelect}>
            Seleccionar Archivo/s
          </button>
          <button className="button" type="button" onClick={handleFolderSelect}>
            Seleccionar Carpeta
          </button>
        </div>
        <div className="content-container">
          <button
            className="button"
            type="button"
            onClick={handleClearSelection}>
            Limpiar Selección
          </button>
        </div>

        <SelectedFilesList selectedFiles={selectedFiles} />

        <div className="output-select">
          <input id="inpt-selected-folder" value={outputPath} disabled />
          <button
            className="button"
            type="button"
            onClick={handleSelectOutputFolder}>
            Seleccionar Carpeta Destino
          </button>
        </div>
        <div className="content-container">
          <button
            disabled={!(selectedFiles.length > 0) || showLoadingModal}
            className="button"
            type="submit"
            onClick={handleFileMerge}>
            Unir archivos
          </button>
        </div>
      </form>
    </div>
  );
};

export { FileSelectionForm };
