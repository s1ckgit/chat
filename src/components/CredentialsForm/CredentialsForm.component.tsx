/* eslint-disable @typescript-eslint/no-explicit-any */
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { TextField, Button, Container, Typography } from '@mui/material';

import styles from './CredentialsForm.module.css';
import { Link, redirect } from 'react-router-dom';
import { useAuthorizeUserMutation, useNewUserMutation } from '../../api/hooks/auth';

// Схема валидации для логина
const loginSchema = z.object({
  login: z.string().min(1, { message: 'Логин обязателен' }),
  password: z.string().min(8, { message: 'Пароль должен содержать минимум 8 символов' }),
});

// Схема валидации для регистрации
const registrationSchema = z.object({
  login: z.string().min(1, { message: 'Логин обязателен' }),
  password: z.string().min(8, { message: 'Пароль должен содержать минимум 8 символов' }),
  confirmPassword: z.string().min(8, { message: 'Пароль подтверждения обязателен' }),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Пароли не совпадают',
  path: ['confirmPassword'],
});

const CredentialsForm = ({ variant }: { variant : 'login' | 'register' }) => {
  const LoginForm = () => {
    const authorizeUserMutation = useAuthorizeUserMutation({
      onSuccess: () => {
        return redirect('/');
      },
    });

    const { register, handleSubmit, formState: { errors } } = useForm({
      resolver: zodResolver(loginSchema),
    });
  
    const onSubmit = (data: any) => {
      authorizeUserMutation.mutate(data);
    };
  
    return (
      <Container maxWidth={false} className={styles.container}>
        <Typography variant="h4">Логин</Typography>
        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
          <TextField
            label="Логин"
            {...register('login')}
            error={!!errors.username}
            helperText={errors.username ? errors.username.message as string : ''}
            fullWidth
          />
          <TextField
            label="Пароль"
            type="password"
            {...register('password')}
            error={!!errors.password}
            helperText={errors.password ? errors.password.message as string : ''}
            fullWidth
          />
          <Button className={styles.button} type="submit" variant="contained" color="primary">Войти</Button>
          <div className={styles.caption}>
            <p>Ещё нет аккаунта?</p>
            <Link to='/registration'>Зарегистрироваться</Link>
          </div>
        </form>
      </Container>
    );
  };
  
  const RegistrationForm = () => {
    const newUserMutation = useNewUserMutation({
      onSuccess: (data) => {
        localStorage.setItem('id', data.id);
        window.location.reload();
      }
    });

    const { register, handleSubmit, formState: { errors } } = useForm({
      resolver: zodResolver(registrationSchema),
    });
  
    const onSubmit = (data: any) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { confirmPassword, ...newUserData } = data;
      newUserMutation.mutate(data);
    };
  
    return (
      <Container maxWidth={false} className={styles.container}>
        <Typography variant="h4">Регистрация</Typography>
        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
          <TextField
            label="Логин"
            {...register('login')}
            error={!!errors.username}
            helperText={errors.username ? errors.username.message as string : ''}
            fullWidth
          />
          <TextField
            label="Пароль"
            type="password"
            {...register('password')}
            helperText={errors.password ? errors.password.message as string : ''}
            error={!!errors.password}
            fullWidth
          />
          <TextField
            label="Подтверждение пароля"
            type="password"
            {...register('confirmPassword')}
            helperText={errors.confirmPassword ? errors.confirmPassword.message as string : ''}
            error={!!errors.confirmPassword}
            fullWidth
          />
          <Button className={styles.button} type="submit" variant="contained" color="primary">Зарегистрироваться</Button>
          <div className={styles.caption}>
            <p>Есть аккаунт?</p>
            <Link to='/login'>Войти</Link>
          </div>
        </form>
      </Container>
    );
  };

  if(variant === 'login') return <LoginForm />;
  if(variant === 'register') return <RegistrationForm />;
};

export default CredentialsForm;
