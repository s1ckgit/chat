import { KeyboardDoubleArrowDown as KeyboardDoubleArrowDownIcon } from '@mui/icons-material';
import { useColors, useTransitions } from "@/theme/hooks";
import { Badge, ButtonBase } from '@mui/material';
import { ButtonHTMLAttributes } from 'react';
import { useUnreadCount } from '@/hooks/helpers';

interface IScrollButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  chatId: string;
}

const ScrollButtonComponent = ({ chatId, ...props }: IScrollButtonProps) => {
  
  const colors = useColors();
  const transitions = useTransitions();

  const unreadCount = useUnreadCount(chatId);

  return (
    <Badge
      sx={{
        position: 'absolute',
        right: '30px',
        bottom: '30%',
      }}
      badgeContent={unreadCount} 
      color='primary' 
      max={99}
      anchorOrigin={{
        'horizontal': 'right'
      }}
    >
      <ButtonBase
        {...props}
        sx={{
          position: 'relative',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '10px',

          backgroundColor: 'white',
          borderRadius: '100%',

          color: colors['primary-main'],
          transition: `background-color ${transitions['standard']}`,

          '&:hover': {
            backgroundColor: colors['ghost-light'],
          },
          
        }}
      >
        <KeyboardDoubleArrowDownIcon 
          color="inherit"
        />
      </ButtonBase>
    </Badge>
    
  );
};
export default ScrollButtonComponent;
