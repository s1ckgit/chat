import { useColors } from "@/theme/hooks";
import { Typography, TypographyProps } from "@mui/material";

interface IHighlightProps extends TypographyProps {
  text: string;
  highlight: string;
}

const HighlightText = ({ text, highlight, sx }: IHighlightProps) => {
  const colors = useColors();
  
  if (!highlight.trim()) {
    return (
      <Typography
        component='span'
        sx={{
          ...sx
        }}
      >
        {text}
      </Typography>
    );
  }

  const regex = new RegExp(`(${highlight})`, 'gi');
  const parts = text.split(regex);

  return (
    <Typography
      component='div'
      sx={{
        display: 'flex'
      }}
    >
      {parts.map((part, index) =>
        regex.test(part) ? (
          <Typography 
            component='span' 
            key={index} 
            sx={{ 
              ...sx,
              backgroundColor: colors['primary-main'],
              color: 'white',
              fontWeight: 'bold' 
            }}
          >
            {part}
          </Typography>
        ) : (
          <Typography
            key={index}
            component='span'
            sx={{
              ...sx
            }}
          >
            {part}
          </Typography>
        )
      )}
    </Typography>
  );
};

export default HighlightText;
