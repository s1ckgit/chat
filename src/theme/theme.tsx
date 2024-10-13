import { createTheme, ThemeProvider as Provider } from '@mui/material/styles';
import { grey, indigo } from '@mui/material/colors';

const theme = createTheme({
  palette: {
    ghost: {
      main: grey['500'],
      light: grey['300'],
      dark: grey['800']
    },
    primary: {
      main: indigo['500']
    }
  },
  transitions: {
    duration: {
      standard: 300,
      shortest: 100
    }
  }
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <Provider theme={theme}>
      {children}
    </Provider>
  );
};
