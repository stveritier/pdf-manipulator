import React from 'react';
import path from 'path';
import { v4 as uuid } from 'uuid';
import { Grid, Typography, List, Button, Box } from '@material-ui/core';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { SelectedFilesListItem } from '../SelectedFilesListItem';
import { SelectedFileListProps } from './models';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      maxWidth: 752,
      marginBottom: '.5rem',
    },
    demo: {
      backgroundColor: theme.palette.background.paper,
    },
    title: {
      margin: theme.spacing(4, 0, 1),
    },
  })
);

const SelectedFilesList = ({
  selectedFiles,
  handleClearSelection,
}: SelectedFileListProps): JSX.Element => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Box display="flex" justifyContent="space-between">
            <Typography variant="subtitle1" className={classes.title}>
              Archivos Seleccionados:
            </Typography>
            <Button
              onClick={handleClearSelection}
              style={{
                height: '2.5rem',
                marginBottom: '.2rem',
                alignSelf: 'flex-end',
              }}
              size="medium">
              {' '}
              Limpiar Selección
            </Button>
          </Box>

          <div className={classes.demo}>
            <List dense={false} style={{ height: '18rem', overflow: 'auto' }}>
              {selectedFiles.length > 0 ? (
                selectedFiles.map((file) => (
                  <SelectedFilesListItem
                    key={uuid()}
                    fileName={path.basename(file)}
                  />
                ))
              ) : (
                <Typography
                  variant="body2"
                  style={{
                    textAlign: 'center',
                    fontStyle: 'italic',
                  }}>
                  No has seleccionado ningún archivo
                </Typography>
              )}
            </List>
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export { SelectedFilesList };
