import { createTheme } from '@mui/material';
import { grey, indigo } from '@mui/material/colors';

export const theme = createTheme({
  palette: {
    primary: {
      main: indigo.A400,
    },
    secondary: {
      main: grey.A700,
    },
  },
});
