/* eslint-disable @typescript-eslint/no-explicit-any */
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { TextField, Button, Container, Typography, Box } from '@mui/material';

import { loginSchema, registrationSchema } from '../../utils/schemas';
import { useAuthorizeUserMutation, useNewUserMutation } from '../../api/hooks/auth';

const CredentialsForm = ({ variant }: { variant : 'login' | 'register' }) => {
  const LoginForm = () => {
    const authorizeUserMutation = useAuthorizeUserMutation({
      onSuccess: (data) => {
        localStorage.setItem('id', data.id);
        window.location.reload();
      },
    });

    const { register, handleSubmit, formState: { errors } } = useForm({
      resolver: zodResolver(loginSchema),
    });
  
    const onSubmit = (data: any) => {
      authorizeUserMutation.mutate(data);
    };
  
    return (
      <Container 
        sx={{
          maxWidth: '640px'
        }}
        maxWidth={false} 
      >
        <Typography variant="h4">Логин</Typography>
        <form
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            rowGap: '24px'
          }} 
          onSubmit={handleSubmit(onSubmit)}
        >
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
          <Button 
            type="submit" 
            variant="contained" 
            color="primary"
          >
            Войти
          </Button>
          <Box
            component='div' 
            sx={{
              textAlign: 'center'
            }}
          >
            <Typography
              component='p'
            >
              Ещё нет аккаунта?
            </Typography>
            <Link to='/registration'>Зарегистрироваться</Link>
          </Box>
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
      <Container
        sx={{
          maxWidth: '640px'
        }} 
        maxWidth={false}
      >
        <Typography variant="h4">Регистрация</Typography>
        <form
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            rowGap: '24px'
          }}   
          onSubmit={handleSubmit(onSubmit)}
        >
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
          <Button
            type="submit" 
            variant="contained" 
            color="primary"
          >
            Зарегистрироваться
          </Button>
          <Box 
            sx={{
              textAlign: 'center'
            }}
          >
            <Typography
              component='p'
            >
              Есть аккаунт?
            </Typography>
            <Link to='/login'>Войти</Link>
          </Box>
        </form>
      </Container>
    );
  };

  if(variant === 'login') return <LoginForm />;
  if(variant === 'register') return <RegistrationForm />;
};

export default CredentialsForm;
