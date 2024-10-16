export const userKeys = {
  me: ['user', 'me'] as const,
  details: (id: number) => ['user', id] as const,
};
