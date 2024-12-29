import { Box, CircularProgress, Typography } from "@mui/material";
import { useCallback, useEffect, useMemo } from "react";

import { useContactsQuery } from "@/api/hooks/users";
import { useColors } from "@/theme/hooks";
import { useSocket } from "@/store/socket";
import Contact from './Contact/Contact.component';


interface IContactProps {
  searchValue: string;
}

const Contacts = ({ searchValue }: IContactProps) => {
  const colors = useColors();

  const { data: contacts, isFetching, refetch, isFetched } = useContactsQuery();
  const { messagesSocket: socket } = useSocket();

  const filteredContacts = useMemo(() => {
    if(!contacts || !searchValue.length) return null;

    return contacts.filter((c) => c.contact.login.includes(searchValue));

  }, [searchValue, contacts]);

  const NoContacts = useMemo(() => {
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
          Нет контактов
        </Typography>
      </Box>
    );
  }, [colors]);

  const ContactsComponents = useMemo(() => {
    if (searchValue.length) {
      return filteredContacts?.length
        ? filteredContacts.map((c) => (
            <Contact searchValue={searchValue} key={c.id} contactData={c} />
          ))
        : NoContacts;
    }
  
    if (contacts?.length) {
      return contacts.map((c) => (
        <Contact key={c.id} contactData={c} />
      ));
    }
  
    return isFetched ? NoContacts : null;
  }, [NoContacts, contacts, filteredContacts, isFetched, searchValue]);

  const handleNewConversation = useCallback(() => {
    refetch();
  }, [refetch]);

  useEffect(() => {
    if(socket) {
      socket.on('new_conversation', handleNewConversation);

      return () => {
        socket.off('new_conversation', handleNewConversation);
      };
    }
  }, [socket, handleNewConversation]);

  return (
    isFetching ? (
      <Box 
        sx={{
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <CircularProgress />
      </Box>
    ) : (
      ContactsComponents
    )
  );
};
export default Contacts;
