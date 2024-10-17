export const userKeys = {
  me: ['user', 'me'] as const,
  details: (id: number) => ['user', id] as const,
  contacts: ['contacts'] as const,
};

export const messagesKeys = {
  id: (id: string | undefined) => ['messages', id] as const
};
