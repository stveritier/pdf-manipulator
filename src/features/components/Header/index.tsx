import React from 'react';
import { Box, Typography } from '@material-ui/core';

const Header = (): JSX.Element => (
  <Box bgcolor="primary.main" height="auto" width="100%" paddingY="1rem">
    <Typography variant="h3" align="center" color="textPrimary">
      PDF Manipulator
    </Typography>
  </Box>
);

export { Header };
