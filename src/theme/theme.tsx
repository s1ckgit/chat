import { createTheme, ThemeProvider as Provider } from '@mui/material/styles';
import { green, grey, indigo } from '@mui/material/colors';

const theme = createTheme({
  palette: {
    ghost: {
      main: grey['500'],
      light: grey['300'],
      dark: grey['800'],
    },
    primary: {
      main: indigo['500']
    },
    messages: {
      initiator: green['100'],
      receiver: '#fff',
      initiatorDate: green['500'],
      receiverDate: grey['500'],
      initiatorBorder: green['100'],
      receiverBorder: grey['300']
    }
  },
  transitions: {
    duration: {
      standard: 300,
      shortest: 100
    }
  },
  typography: {
    messagesText: {
      fontSize: 16,
      lineHeight: 1.4
    },
    messagesDate: {
      fontSize: 12,
      lineHeight: 2
    },
    name: {
      fontSize: 15,
      lineHeight: 1.4,
      fontWeight: 700
    },
    info: {
      fontSize: 14,
      lineHeight: 1.3
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
