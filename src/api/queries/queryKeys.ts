export const userKeys = {
  me: ['user', 'me'] as const,
  details: (id: number) => ['user', id] as const,
  contacts: ['contacts'] as const,
  prop: (id: string | undefined, prop: string) => ['user', id, prop] as const
};

export const messagesKeys = {
  conversations: ['conversations'],
  lastMessagge: (id: string) => ['lastmessage', id] as const,
  id: (id: string | undefined) => ['messages', id] as const
};
