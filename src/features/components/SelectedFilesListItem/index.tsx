import React from 'react';
import path from 'path';
import { ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import ImageSharpIcon from '@material-ui/icons/ImageSharp';
import DescriptionSharpIcon from '@material-ui/icons/DescriptionSharp';
import { SelectedFilesListItemProps } from './models';

const SelectedFilesListItem = ({
  fileName,
}: SelectedFilesListItemProps): JSX.Element => (
  <ListItem>
    <ListItemIcon>
      {path.extname(fileName) === '.pdf' ? (
        <DescriptionSharpIcon />
      ) : (
        <ImageSharpIcon />
      )}
    </ListItemIcon>
    <ListItemText primary={fileName} />
  </ListItem>
);

export { SelectedFilesListItem };
