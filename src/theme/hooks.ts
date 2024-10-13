import { useTheme } from "@mui/material/styles";

export const useColors = () => {
  const theme = useTheme();

  const colors = {
    'ghost-dark': theme.palette.ghost.dark,
    'ghost-light': theme.palette.ghost.light,
    'ghost-main': theme.palette.ghost.main,
    'primary-main': theme.palette.primary.main
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
