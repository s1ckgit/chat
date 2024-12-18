import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import QueryClientProvider from './api/queries/QueryClientProvider.tsx';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Toaster } from 'sonner';

import './index.css';
import { RootPage, ErrorPage, LoginPage, RegistrationPage } from './routes/index.tsx';
import { ThemeProvider } from './theme/theme.tsx';
import { authPageLoader, rootPageLoader } from './routes/loaders.ts';


const router = createBrowserRouter([
  {
    path: "/",
    element: <RootPage />,
    errorElement: <ErrorPage />,
    loader: rootPageLoader
  },
  {
    path: '/login',
    element: <LoginPage />,
    loader: authPageLoader
  },
  {
    path: '/registration',
    element: <RegistrationPage />,
    loader: authPageLoader
  }
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <QueryClientProvider>
        <GoogleOAuthProvider clientId='116876690810-sh86eih42n8ng54afv9aq7mjgvbv0pqs.apps.googleusercontent.com'>
          <Toaster />
          <RouterProvider router={router} />
        </GoogleOAuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  </StrictMode>,
);
