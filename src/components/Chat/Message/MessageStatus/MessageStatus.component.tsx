import { CircularProgress } from "@mui/material";
import CheckIcon from '@mui/icons-material/Check';
import DoneAllIcon from '@mui/icons-material/DoneAll';


interface IMessageStatusProps {
  status: 'pending' | 'delivered' | 'read'
}

const MesageStatus = ({ status }: IMessageStatusProps) => {

  if(status === 'pending') {
    return (
      <CircularProgress 
        sx={{
          color: 'inherit'
        }}
        size={20}
      />
    );
  }
  else if (status === 'delivered') {
    return (
      <CheckIcon
        sx={{
          fontSize: '18px'
        }}
      />
    );
  } 
  else {
    return (
      <DoneAllIcon 
        sx={{
          fontSize: '18px'
        }}
      />
    );
  }


};

export default MesageStatus;
