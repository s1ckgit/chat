import { Box, Button, ButtonBase, Container, Modal, TextField, Typography } from "@mui/material";
import { toggleAttchFileModal, useModals } from "../../../store/modals";
import { v4 as uuidv4 } from 'uuid';
import { useSendMessageAttachmentsMutation } from "../../../api/hooks/messages";
import { useChat } from "../../../store";
import { useUserMeQuery } from "../../../api/hooks/users";
import { useSocket } from "../../../store/socket";
import { setChatInput, setPendingMessage, useChatInput } from "../../../store/chat";
import { IPendingMessage } from "../../../types";
import { useEffect, useRef } from "react";
import { buildGridForAttachmentsModal } from "../../../utils";
import AttachFileItem from "./AttachFileList/AttachFileItem/AttachFileItem.component";
import UploadIcon from '@mui/icons-material/Upload';
import { useColors, useTransitions } from "../../../theme/hooks";

const AttachFileModal = () => {
  const colors = useColors();
  const transitions = useTransitions();

  const { id: conversationId, receiverId } = useChat();
  const chatInput = useChatInput();
  const { socket } = useSocket();
  const { data: user } = useUserMeQuery();
  const { isOpened, attachments, fileInputRef } = useModals(state => state.attachFileModal);
  const sendMessageAttachments = useSendMessageAttachmentsMutation({});
  const inputRef = useRef<HTMLInputElement>(null);

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
      attachments
    };
    setPendingMessage(newPendingMessage);
    setChatInput('');
    toggleAttchFileModal();

    const formData = new FormData();
    formData.append('messageId', messageId);
    formData.append('conversationId', conversationId!);
    attachments.forEach((attachment) => {
      formData.append('attachments', attachment.file);
    });

    const attachmentsLinks = await sendMessageAttachments.mutateAsync(formData);

    const newMessage = {
      ...newPendingMessage,
      attachments: attachmentsLinks
    };

    socket?.emit('send_message', newMessage);
  };

  useEffect(() => {
    if (isOpened) {
      requestAnimationFrame(() => {
        inputRef.current?.focus();
      });
    }
  }, [isOpened]);

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
          {
            attachments.length ? (
              <Box 
                sx={{
                  ...buildGridForAttachmentsModal(attachments.length)
                }}
              >
                {
                  attachments.map((attach) => (
                    <AttachFileItem key={attach.id} attachment={attach} />
                  ))
                }
              </Box>
            ) : (
              <ButtonBase
                onClick={() => {
                  fileInputRef?.current?.click();
                }}
                sx={{
                  width: '100%',
                  height: '150px',
                  backgroundColor: colors['ghost-light'],
                  color: colors['ghost-dark'],

                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  rowGap: 1,
                  transition: `background-color ${transitions['standard']}, color ${transitions['standard']}`,


                  '&:hover': {
                    backgroundColor: colors['ghost-dark'],
                    color: 'white'
                  }
                }}
                component="div"
              >
                <UploadIcon 
                  sx={{
                    color: 'inherit'
                  }}
                />
                Загрузить изображения
              </ButtonBase>
            )
          }

          <TextField
            inputRef={inputRef}
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            variant="standard"
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
