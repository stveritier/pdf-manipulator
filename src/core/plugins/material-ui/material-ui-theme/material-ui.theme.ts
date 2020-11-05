import { createMuiTheme } from '@material-ui/core/styles';

interface PaletteColor {
  light?: string;
  main: string;
  dark?: string;
  contrastText?: string;
}

const primaryColors: PaletteColor = {
  main: '#90caf9',
  light: 'rgb(166, 212, 250)',
  dark: 'rgb(100, 141, 174)',
  contrastText: 'rgba(0, 0, 0, 0.87)',
};

const secondaryColors: PaletteColor = {
  main: '#f48fb1',
  dark: 'rgb(170, 100, 123)',
  light: 'rgb(246, 165, 192)',
  contrastText: 'rgba(0, 0, 0, 0.87)',
};

const errorColors: PaletteColor = {
  main: '#f44336',
  light: '#e57373',
  dark: '#dr2f2f',
  contrastText: '#fff',
};

export const appTheme = createMuiTheme({
  palette: {
    primary: primaryColors,
    secondary: secondaryColors,
    error: errorColors,
    type: 'dark',
  },
});
