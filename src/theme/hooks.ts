import { useTheme } from "@mui/material/styles";

export const useColors = () => {
  const theme = useTheme();

  const colors = {
    'ghost-dark': theme.palette.ghost.dark,
    'ghost-light': theme.palette.ghost.light,
    'ghost-main': theme.palette.ghost.main,
    'primary-main': theme.palette.primary.main,
    'messages-initiator': theme.palette.messages.initiator,
    'messages-receiver': theme.palette.messages.receiver,
    'messages-initiator-date': theme.palette.messages.initiatorDate,
    'messages-receiver-date': theme.palette.messages.receiverDate,
    'messages-initiator-border': theme.palette.messages.initiatorBorder,
    'messages-receiver-border': theme.palette.messages.receiverBorder
  };

  return colors;
};

export const useTransitions = () => {
  const theme = useTheme();

  const transitions = {
    'standard': `${theme.transitions.duration.standard}ms`,
    'shortest': `${theme.transitions.duration.shortest}ms`
  };

  return transitions;
};

export const useTypography = () => {
  const theme = useTheme();

  const typography = {
    'messages-text': theme.typography.messagesText,
    'messages-date': theme.typography.messagesDate,
    'name': theme.typography.name,
    'info': theme.typography.info
  };

  return typography;
};
