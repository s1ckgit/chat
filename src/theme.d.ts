/* eslint-disable @typescript-eslint/no-unused-vars */
import { PaletteOptions } from '@mui/material/styles';
import { SvgIconPropsColorOverrides } from '@mui/material/SvgIcon';

declare module '@mui/material/styles' {
  interface TypographyVariants {
    messagesText: React.CSSProperties;
    messagesDate: React.CSSProperties;
    name: React.CSSProperties;
    info: React.CSSProperties;
  }

  interface TypographyVariantsOptions {
    messagesText?: React.CSSProperties;
    messagesDate?: React.CSSProperties;
    name?: React.CSSProperties;
    info?: React.CSSProperties;
  }

  interface Palette {
    ghost: Palette['primary'];
    messages: {
      initiator: string;
      receiver: string;
      initiatorDate: string;
      receiverDate: string;
      initiatorBorder: string;
      receiverBorder: string;
    }
  }

  interface PaletteOptions {
    ghost?: PaletteOptions['primary'];
    messages?: {
      initiator?: string;
      receiver?: string;
      initiatorDate?: string;
      receiverDate?: string;
      initiatorBorder?: string;
      receiverBorder?: string;
    }
  }
}

declare module '@mui/material/SvgIcon' {
  interface SvgIconPropsColorOverrides {
    ghost: true;
  }
}

declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    messagesText: true;
    messagesDate: true;
  }
}
