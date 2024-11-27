import * as z from 'zod';

export const loginSchema = z.object({
  login: z.string().min(1, { message: 'Логин обязателен' }),
  password: z.string().min(8, { message: 'Пароль должен содержать минимум 8 символов' }),
});

export const registrationSchema = z.object({
  login: z.string().min(1, { message: 'Логин обязателен' }),
  password: z.string().min(8, { message: 'Пароль должен содержать минимум 8 символов' }),
  confirmPassword: z.string().min(8, { message: 'Пароль подтверждения обязателен' }),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Пароли не совпадают',
  path: ['confirmPassword'],
});
