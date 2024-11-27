import { IPendingMessage } from "@/types";
import Message from "../Message/Message.component";
import { useMemo } from "react";
import { Box, Chip, Divider } from "@mui/material";
import { useColors } from "@/theme/hooks";

interface IMessagesGroupProps {
  date: string;
  messages: (Message | IPendingMessage)[];
  isLastGroup: boolean;
  onRead: (messageId: string) => void;
}

const MessagesGroup = ({ date, messages, isLastGroup, onRead }: IMessagesGroupProps) => {
  const colors = useColors();

  const messagesComponents = useMemo(() => {
    if(!messages) return null;

    return messages.map((message, i) => {
      if(i === messages.length - 1) {
        return <Message isLastMessage={isLastGroup} renderAvatar={true} onRead={onRead} messageData={message} key={message.id + message.status} />;
      } else {
        const senderId = messages[i].senderId;
        const nextSenderId = messages[i + 1].senderId;
        return <Message renderAvatar={senderId !== nextSenderId} onRead={onRead} messageData={message} key={message.id + message.status} />;
      }
    }
  );
  }, [messages, isLastGroup, onRead]);

  if(!messagesComponents) return null;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        rowGap: '12px'
      }}
    >
      <Divider
        sx={{
          width: '100%'
        }}
        textAlign="center"
      >
        <Chip
          sx={{
            color: 'white',
            backgroundColor: colors['ghost-main']
          }} 
          label={date} 
        />
      </Divider>
      <Box
        sx={{
          display: 'grid',
          height: '100%',
          width: '100%',
          gridTemplateRows: '1fr',
          gridAutoRows: 'auto',
          gridTemplateColumns: '1fr',
          rowGap: '12px',
        }}
      >
        {
          messagesComponents
        }
      </Box>
    </Box>
  );
};
export default MessagesGroup;
