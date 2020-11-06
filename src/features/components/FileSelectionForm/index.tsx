import React, { useState, FormEvent } from 'react';
import path from 'path';
import {
  Box,
  Button,
  ButtonGroup,
  Typography,
  TextField,
} from '@material-ui/core';
import { toast } from 'react-toastify';
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

  const notifyResult = (success: boolean) => {
    if (success) {
      return toast.success('El archivo fue creado correctamente.');
    }

    return toast.error('Hubo un problema creando el archivo.');
  };

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
        notifyResult(true);
      } else {
        throw mergedPDFBytes;
      }
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
      }
      setLoading(false);

      notifyResult(false);
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
        <Box marginBottom="15px">
          <Typography variant="subtitle1">Carpeta destino: </Typography>
          <Box display="flex" paddingTop=".3rem">
            <TextField
              value={outputPath}
              disabled
              size="small"
              fullWidth
              variant="outlined"
            />
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

        <Box display="flex" justifyContent="center">
          <Button
            variant="contained"
            onClick={handleFileMerge}
            disabled={!(selectedFiles.length > 0 || loading)}>
            Unir Archivos
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export { FileSelectionForm };
