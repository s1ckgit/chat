import Grid from '@mui/material/Grid2';
import { useTheme } from '@mui/material/styles';
import Sidebar from '../components/Sidebar/Sidebar.component';
import ImageModal from '../components/ImageModal/ImageModal.component';
import { useEffect } from 'react';
import { useSocket } from '@/store/socket';
import { setupSocketsErrorHandler } from '@/utils';
import { setChatWindowElement, useChat } from '@/store/chat';
import useMediaQuery from '@mui/material/useMediaQuery';
import Chat from '@/components/Chat/Chat.component';

const Root = () => {
  const theme = useTheme();
  const { messagesSocket, statusSocket, usersSocket } = useSocket();
  const { receiver, id } = useChat();

  const isChatWindowOpened = (receiver || id) ? true : false;
  const oneColumnMode = useMediaQuery('(max-width:860px)');
  const showChatWindow = !oneColumnMode || isChatWindowOpened;

  useEffect(() => {
    const sockets = [messagesSocket, statusSocket, usersSocket];

    if(sockets.every((socket) => socket !== undefined)) {
      const cleanup = setupSocketsErrorHandler(sockets);

      return cleanup;
    }
  }, [messagesSocket, statusSocket, usersSocket]);

  useEffect(() => {
    if(!showChatWindow) {
      setChatWindowElement(null);
    }
  }, [showChatWindow]);

  return (
    <>
      <ImageModal />
      <Grid sx={{ minHeight:'100vh' }} container>
        {
          (!oneColumnMode || !isChatWindowOpened) && (
            <Grid 
              size={
                oneColumnMode ? 'grow' : 'auto'
              }
              sx={{
                border: '1px solid', 
                borderColor: theme.palette.ghost.light,
                width: 450
              }}
            >
              <Sidebar />
            </Grid>
          )
        }
        {
          showChatWindow && (
            <Grid size="grow">
              <Chat />
            </Grid>
          )
        }
      </Grid>
    </>
  );
};

export default Root;
