import React from 'react';
import path from 'path';
import { v4 as uuid } from 'uuid';
import { SelectedFilesListItem } from '../SelectedFilesListItem';
import { SelectedFileListProps } from './models';

const SelectedFilesList = ({
  selectedFiles,
}: SelectedFileListProps): JSX.Element => (
  <>
    <p className="list-header">Archivos seleccionados:</p>
    <div className="list-body">
      {selectedFiles.length > 0 ? (
        selectedFiles.map((file) => (
          <SelectedFilesListItem key={uuid()} fileName={path.basename(file)} />
        ))
      ) : (
        <p className="list-body__error">No has seleccionado ningún archivo</p>
      )}
    </div>
  </>
);

export { SelectedFilesList };
