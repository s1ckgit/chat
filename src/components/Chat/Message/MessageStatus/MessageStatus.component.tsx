import { CircularProgress, Typography } from "@mui/material";
import CheckIcon from '@mui/icons-material/Check';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import { useColors, useTypography } from "../../../../theme/hooks";


interface IMessageStatusProps {
  status: 'pending' | 'delivered' | 'read';
  date: string;
  isInitiator: boolean;
  variant?: 'default' | 'no-text'
}

const MesageStatus = ({ status, date, isInitiator, variant = 'default' }: IMessageStatusProps) => {
  const colors = useColors();
  const typography = useTypography();

  const StatusContainer = ({ children }: { children: React.ReactNode }) => (
    <Typography 
      component='span'
      sx={{ 
        ...typography['messages-date'], 
        color: isInitiator ? colors['messages-initiator-date'] : colors['messages-receiver-date'],
        paddingLeft: '10px',
        ...(variant === 'no-text' ? {
          position: 'absolute',
          bottom:'8px',
          right:'8px',
          color: 'white',
          backgroundColor: 'rgba(0,0,0,0.3)',
          borderRadius: '12px',
          paddingRight: '10px'
        } : {}),
        display: 'flex',
        alignItems: 'center',
        columnGap: '3px',
        float:'right',
        zIndex: 4,
      }}
    >
      {date}
      {children}
    </Typography>
  );

  if(status === 'pending') {
    return (
      <StatusContainer>
        <CircularProgress 
          sx={{
            order: 1,
            color: 'inherit'
          }}
          size={20}
        />
      </StatusContainer>
    );
  }
  else if (status === 'delivered') {
    return (
      <StatusContainer>
        <CheckIcon
          sx={{
            color: 'inherit',
            order: 1,
            fontSize: '18px'
          }}
        />
      </StatusContainer>
    );
  } 
  else {
    return (
     <StatusContainer>
       <DoneAllIcon 
          sx={{
            color: 'inherit',
            order: 1,
            fontSize: '18px'
          }}
        />
     </StatusContainer>
    );
  }


};

export default MesageStatus;
