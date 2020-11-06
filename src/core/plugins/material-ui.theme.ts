import { createMuiTheme } from '@material-ui/core/styles';

interface PaletteColor {
  light?: string;
  main: string;
  dark?: string;
  contrastText?: string;
}

const primaryColors: PaletteColor = {
  main: '#CA3E47',
  light: '#525252',
  dark: '#313131',
};

export const appTheme = createMuiTheme({
  palette: {
    primary: primaryColors,
    type: 'dark',
  },
});
