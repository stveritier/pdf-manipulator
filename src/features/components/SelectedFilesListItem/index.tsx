import React from 'react';
import path from 'path';
import pdfIcon from '../../../resources/img/PDF_file_icon.svg';
import imgIcon from '../../../resources/img/Photos-new-icon.png';
import { SelectedFilesListItemProps } from './models';

const SelectedFilesListItem = ({
  fileName,
}: SelectedFilesListItemProps): JSX.Element => (
  <div className="list-item">
    <img
      alt="file icon"
      src={path.extname(fileName) === '.pdf' ? pdfIcon : imgIcon}
    />
    <p>{fileName}</p>
  </div>
);

export { SelectedFilesListItem };
