import { useQuery } from "@tanstack/react-query";
import { getMessages } from "../services/messages";
import { messagesKeys } from "../queries/queryKeys";


export const useMessagesQuery = (id: string | undefined) => {
  return useQuery({
    queryKey: messagesKeys.id(id),
    queryFn: () => getMessages(id)
  });
};
