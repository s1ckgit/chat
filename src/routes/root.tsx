import Grid from '@mui/material/Grid2';
import { Chat } from "../components/index";
import { useTheme } from '@mui/material/styles';
import Sidebar from '../components/Sidebar/Sidebar.component';
import ImageModal from '../components/ImageModal/ImageModal.component';
import { useEffect } from 'react';
import { useSocket } from '@/store/socket';
import { setupSocketsErrorHandler } from '@/utils';

const Root = () => {
  const theme = useTheme();
  const { messagesSocket, statusSocket, usersSocket } = useSocket();

  useEffect(() => {
    const sockets = [messagesSocket, statusSocket, usersSocket];

    if(sockets.every((socket) => socket !== undefined)) {
      const cleanup = setupSocketsErrorHandler(sockets);

      return cleanup;
    }
  }, [messagesSocket, statusSocket, usersSocket]);

  return (
    <>
      <ImageModal />
      <Grid sx={{ minHeight:'100vh' }} container>
        <Grid size={2} sx={{ border: '1px solid', width: 450, borderColor: theme.palette.ghost.light }}>
          <Sidebar />
        </Grid>
        <Grid size="grow">
          <Chat />
        </Grid>
      </Grid>
    </>
  );
};

export default Root;
