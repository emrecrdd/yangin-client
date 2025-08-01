import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1a365d',
      light: '#274c7d',
      dark: '#122841',
      contrastText: '#fff',
    },
    secondary: {
      main: '#e53e3e',
      light: '#ff6f6f',
      dark: '#a72626',
      contrastText: '#fff',
    },
    background: {
      default: '#f7f9fc',
      paper: '#fff',
    },
    text: {
      primary: '#1a1a1a',
      secondary: '#555',
    },
  },
  typography: {
    fontFamily: `"Segoe UI", Tahoma, Geneva, Verdana, sans-serif`,
    fontWeightMedium: 600,
  },
  shape: {
    borderRadius: 10,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 8,
        },
      },
    },
  },
});

export default theme;
