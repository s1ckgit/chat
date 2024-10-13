/* eslint-disable @typescript-eslint/no-unused-vars */
import { PaletteOptions } from '@mui/material/styles';
import { SvgIconPropsColorOverrides } from '@mui/material/SvgIcon';

declare module '@mui/material/styles' {
  interface Palette {
    ghost: Palette['primary'];
  }

  interface PaletteOptions {
    ghost?: PaletteOptions['primary'];
  }
}

declare module '@mui/material/SvgIcon' {
  interface SvgIconPropsColorOverrides {
    ghost: true;
  }
}
