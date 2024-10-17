import Grid from '@mui/material/Grid2';
import { Chat } from "../components/index";
import { useTheme } from '@mui/material/styles';
import Sidebar from '../components/Sidebar/Sidebar.component';
import { useLoaderData } from 'react-router-dom';
import type { IUser } from '../types';
import { Socket } from 'socket.io-client';
import { setSocket } from '../store/chat';

const Root = () => {
  const theme = useTheme();
  const { socket } = useLoaderData() as { userData: IUser; socket: Socket};
  setSocket(socket);

  return (
    <Grid sx={{ minHeight:'100vh' }} container>
      <Grid size={2} sx={{ border: '1px solid', width: 450, borderColor: theme.palette.ghost.light }}>
        <Sidebar />
      </Grid>
      <Grid size="grow">
        <Chat />
      </Grid>
    </Grid>
  );
};

export default Root;
