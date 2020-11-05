import React, { useState, FormEvent } from 'react';
import path from 'path';
import {
  Box,
  Button,
  ButtonGroup,
  Typography,
  TextField,
} from '@material-ui/core';
import { homedir } from 'os';
import { readdirSync } from 'fs';
import { remote } from 'electron';
import { SelectedFilesList } from '../SelectedFileList';
import { LoadingScreen } from '../LoadingScreen';
import PDFController from '../../../utils/pdf-controller';
import DataController from '../../../utils/data-controller';

const FileSelectionForm = (): JSX.Element => {
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [outputPath, setOutputPath] = useState<string>(homedir());
  const [fileName] = useState<string>('archivo-final.pdf');
  const [loading, setLoading] = useState<boolean>(false);

  const filters = [
    { name: 'Archivos', extensions: ['jpg', 'jpeg', 'png', 'pdf'] },
  ];

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
    setLoading(true);
    try {
      const pdfController = PDFController.Instance;
      const mergedPDFBytes = await pdfController.mergePDF(selectedFiles);
      if (!(mergedPDFBytes instanceof Error)) {
        await DataController.saveFileToDisk(
          outputPath,
          fileName,
          mergedPDFBytes
        );
        setSelectedFiles([]);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
    }
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <Box width="100%" height="auto">
      <LoadingScreen loading={loading} />

      <form onSubmit={onSubmit} noValidate autoComplete="off">
        <ButtonGroup aria-label="outlined primary button group">
          <Button onClick={handleFileSelect}>Seleccionar Archivo/s</Button>
          <Button onClick={handleFolderSelect}>Seleccionar Carpeta</Button>
        </ButtonGroup>

        <SelectedFilesList
          selectedFiles={selectedFiles}
          handleClearSelection={handleClearSelection}
        />
        <Box>
          <Typography variant="subtitle1">Carpeta destino: </Typography>
          <Box display="flex" paddingTop=".3rem">
            <TextField value={outputPath} disabled size="small" fullWidth />
            <Button
              onClick={handleSelectOutputFolder}
              variant="outlined"
              style={{
                paddingLeft: '1.2rem',
                paddingRight: '1.2rem',
              }}
              size="small">
              Seleccionar
            </Button>
          </Box>
        </Box>

        <div className="content-container">
          <button
            disabled={!(selectedFiles.length > 0) || loading}
            className="button"
            type="submit"
            onClick={handleFileMerge}>
            Unir archivos
          </button>
        </div>
      </form>
    </Box>
  );
};

export { FileSelectionForm };
