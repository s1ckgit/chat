/* eslint-disable @typescript-eslint/no-explicit-any */
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { TextField, Button, Container, Typography, Box } from '@mui/material';
import { LoginButton as TelegramLoginButton } from '@telegram-auth/react';
import { CredentialResponse, GoogleLogin as GoogleLoginButton } from '@react-oauth/google';
import { toast } from 'sonner';

import { loginSchema, registrationSchema } from '../../utils/schemas';
import { useAuthorizeUserMutation, useGoogleAuthMutation, useNewUserMutation, useTelegramAuthMutation } from '../../api/hooks/auth';
import { ITelegramProfileData, IUserCredentials } from '@/types';
import { defaultToastConfig, onAuthSuccess } from '@/utils';

const AuthForm = ({
  title,
  fields,
  schema,
  redirectText,
  redirectLink,
  redirectLinkText,
  onSubmit,
}: {
  title: string;
  fields: Array<{ name: string; label: string; type?: string }>;
  schema: any;
  onSubmit: (data: any) => void;
  redirectText: string;
  redirectLink: string;
  redirectLinkText: string;
}) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  const telegramAuthMutation = useTelegramAuthMutation({
    onSuccess: onAuthSuccess,
    onError: () => {
      toast.error('Неизвестная ошибка. Повторите попытку.', defaultToastConfig);
    }
  });

  const googleAuthMutation = useGoogleAuthMutation({
    onSuccess: onAuthSuccess,
    onError: () => {
      toast.error('Неизвестная ошибка. Повторите попытку.', defaultToastConfig);
    }
  });

  const onTelegramAuth = (data: ITelegramProfileData) => {
    telegramAuthMutation.mutate(data);
  };

  const onGoogleAuth = (credentialResponse: CredentialResponse) => {
    googleAuthMutation.mutate(credentialResponse);
  };

  return (
    <Container
      sx={{ maxWidth: '640px' }}
      maxWidth={false}
    >
      <Typography variant="h4">{title}</Typography>
      <form
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          rowGap: '24px',
        }}
        onSubmit={handleSubmit(onSubmit)}
      >
        {fields.map(({ name, label, type }) => (
          <TextField
            key={name}
            label={label}
            type={type || 'text'}
            {...register(name)}
            error={!!errors[name]}
            helperText={errors[name]?.message as string}
            fullWidth
          />
        ))}
        <Button
          type="submit"
          variant="contained"
          color="primary"
        >
          {title}
        </Button>
        <Box sx={{ display: 'flex', columnGap: '8px' }}>
          <TelegramLoginButton
            requestAccess={null}
            showAvatar={false}
            lang="ru"
            botUsername="messenger_tg_bot"
            onAuthCallback={onTelegramAuth}
          />
          <GoogleLoginButton
            type="icon"
            locale="ru"
            onSuccess={onGoogleAuth}
            onError={() => console.error('Ошибка авторизации через Google')}
          />
        </Box>
        <Box sx={{ textAlign: 'center' }}>
          <Typography component="p">{redirectText}</Typography>
          <Link to={redirectLink}>{redirectLinkText}</Link>
        </Box>
      </form>
    </Container>
  );
};

const CredentialsForm = ({ variant }: { variant: 'login' | 'register' }) => {

  const authorizeUserMutation = useAuthorizeUserMutation({
    onSuccess: onAuthSuccess,
    onError: () => {
      toast.error('Неизвестная ошибка. Повторите попытку.', defaultToastConfig);
    }
  });

  const newUserMutation = useNewUserMutation({
    onSuccess: onAuthSuccess,
    onError: (axiosError) => {
      if(axiosError.response.data.details.message === 'duplicate') {
        toast.error('Пользователь с таким логином уже существует.', defaultToastConfig);
      } else {
        toast.error('Неизвестная ошибка. Повторите попытку.', defaultToastConfig);
      }
    }
  });

  const onLogin = (data: IUserCredentials) => authorizeUserMutation.mutate(data);

  const onRegister = (data: any) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { confirmPassword, ...userData } = data;
    newUserMutation.mutate(userData);
  };

  if (variant === 'login') {

    return (
      <AuthForm
        title="Логин"
        fields={[
          { name: 'login', label: 'Логин' },
          { name: 'password', label: 'Пароль', type: 'password' },
        ]}
        schema={loginSchema}
        onSubmit={onLogin}
        redirectText="Ещё нет аккаунта?"
        redirectLink="/registration"
        redirectLinkText="Зарегистрироваться"
      />
    );
  }

  if (variant === 'register') {

    return (
      <AuthForm
        title="Регистрация"
        fields={[
          { name: 'login', label: 'Логин' },
          { name: 'password', label: 'Пароль', type: 'password' },
          { name: 'confirmPassword', label: 'Подтверждение пароля', type: 'password' },
        ]}
        schema={registrationSchema}
        onSubmit={onRegister}
        redirectText="Есть аккаунт?"
        redirectLink="/login"
        redirectLinkText="Войти"
      />
    );
  }

  return null;
};

export default CredentialsForm;
