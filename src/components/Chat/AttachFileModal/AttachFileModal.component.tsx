import { Box, Button, Container, Modal, TextField, Typography } from "@mui/material";
import { toggleAttchFileModal, useModals } from "../../../store/modals";
import { v4 as uuidv4 } from 'uuid';
import { useSendMessageAttachmentsMutation } from "../../../api/hooks/messages";
import { useChat } from "../../../store";
import { useUserMeQuery } from "../../../api/hooks/users";
import { useSocket } from "../../../store/socket";
import { setChatInput, setPendingMessage, useChatInput } from "../../../store/chat";
import { IPendingMessage } from "../../../types";

const AttachFileModal = () => {
  const { id: conversationId, receiverId } = useChat();
  const chatInput = useChatInput();
  const { socket } = useSocket();
  const { data: user } = useUserMeQuery();
  const { isOpened, imagesSrc, filesToSend } = useModals(state => state.attachFileModal);
  const sendMessageAttachments = useSendMessageAttachmentsMutation({});

  const onSend = async () => {
    const messageId = uuidv4();
    const createdAt = new Date();

    const newPendingMessage: IPendingMessage = {
      id: messageId,
      createdAt,
      status: 'pending',
      conversationId: conversationId as string,
      content: chatInput,
      senderId: user?.id as string,
      receiverId: receiverId as string,
      attachments: [
        {
          preview_url: imagesSrc[0],
          secure_url: imagesSrc[0]
        }
      ],
      attachmentProgress: 0
    };
    setPendingMessage(newPendingMessage);
    setChatInput('');
    toggleAttchFileModal();

    const formData = new FormData();
    formData.append('messageId', messageId);
    formData.append('conversationId', conversationId!);
    filesToSend.forEach((file) => {
      formData.append('attachments', file);
    });

    const attachmentLinks = await sendMessageAttachments.mutateAsync(formData);

    const newMessage = {
      ...newPendingMessage,
      attachments: attachmentLinks
    };

    socket?.emit('send_message', newMessage);
  };

  return (
    <Modal
      open={isOpened}
      slotProps={{
        backdrop: {
          onClick: () => {
            toggleAttchFileModal();
          }
        }
      }}
    >
      <Container
        maxWidth={false}
        sx={{
          '&.MuiContainer-root': {
            padding: 0,
          },
          display: 'grid',
          gridTemplate: '1fr / 1fr ',
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          height: 'auto',
          maxWidth: 368,
          backgroundColor: 'white',

        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            rowGap: '24px',
            padding: '24px'
          }}
        >
          <Typography variant='h5'>Отправить файл</Typography>
          <Box 
            sx={{
              width: '100%',
              height: '180px',
              backgroundColor: '#d8d8d8',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <img 
              src={imagesSrc[0]}
              style={{
                objectFit: 'contain',
                objectPosition: 'center',
                maxWidth: '100%',
                maxHeight: '100%'
              }} 
            />
          </Box>

          <TextField
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            variant="standard"
            autoFocus={true}
            label="Описание"
          />

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between'
            }}
          >
            <Button onClick={toggleAttchFileModal} variant="text">
              Отмена
            </Button>
            <Button onClick={onSend} variant="text">
              Отправить
            </Button>
          </Box>
        </Box>
      </Container>
    </Modal>
  );
};
export default AttachFileModal;
