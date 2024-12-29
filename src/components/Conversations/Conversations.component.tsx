import { useConversationsQuery } from "@/api/hooks/messages";
import { useSocket } from "@/store/socket";
import { useColors } from "@/theme/hooks";
import { Box, CircularProgress, Typography } from "@mui/material";
import { useCallback, useEffect, useMemo } from "react";
import Conversation from "./Conversation/Conversation.component";
import { enableSocketEventListeners } from "@/utils";

const Conversations = ({ searchValue }: { searchValue: string; }) => {
  const colors = useColors();

  const { messagesSocket: socket } = useSocket();
  const { data: conversations, isLoading, isPlaceholderData, refetch, isFetched } = useConversationsQuery();

  const filteredConvesations = useMemo(() => {
    if(!conversations || !searchValue.length) return null;

    return conversations.filter((c) => c.participants[0].login.includes(searchValue));

  }, [searchValue, conversations]);

  const handleGetConversations = useCallback(() => {
    refetch();
  }
  , [refetch]);

  const handleNewConversation = useCallback(({ id }: { id: string }) => {
    socket?.emit('new_conversation', {
      id
    });
    refetch();
  }, [refetch, socket]);

  useEffect(() => {
    if(!socket) return;
    const cleanup = enableSocketEventListeners(socket, [
      {
        eventName: 'conversations',
        eventCallback: handleGetConversations
      },
      {
        eventName: 'new_conversation',
        eventCallback: handleNewConversation
      }
    ]);
    return cleanup;
  }, [socket, handleNewConversation, handleGetConversations]);

  const NoConversations = useMemo(() => {
    return (
      <Box
        sx={{
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Typography
          sx={{
            color: colors['ghost-main'],
          }}
        >
          Нет диалогов
        </Typography>
      </Box>
    );
  }, [colors]);

  const ConversationComponents = useMemo(() => {
    if (searchValue.length) {
      return filteredConvesations?.length
        ? filteredConvesations.map((c) => (
            <Conversation searchValue={searchValue} key={c.id} conversation={c} />
          ))
        : NoConversations;
    }
  
    if (conversations?.length) {
      return conversations.map((c) => (
        <Conversation key={c.id} conversation={c} />
      ));
    }
  
    return isFetched ? NoConversations : null;
  }, [NoConversations, conversations, filteredConvesations, isFetched, searchValue]);

  return (
      isLoading && !isPlaceholderData ? (
      <Box className='loading-container'>
        <CircularProgress />
      </Box>
      ) : 
      <Box
        sx={{
          height: '100%',
          overflowY: 'auto'
        }}
      >
        {ConversationComponents}
      </Box>
  );
};
export default Conversations;
