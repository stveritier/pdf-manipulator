import React from 'react';
import { Box, Typography } from '@material-ui/core';

const Header = (): JSX.Element => (
  <Box
    bgcolor="primary.main"
    alignItems="center"
    style={{ width: '100%', height: 'auto' }}
    display="flex">
    <Typography>PDF Manipulator</Typography>
  </Box>
);

export { Header };
