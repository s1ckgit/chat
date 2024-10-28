import axios from 'axios';

const client = axios.create({
  baseURL: 'http://localhost:3000/api/',
  withCredentials: true,
  timeout: 5000,
});

client.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && error.response?.data.reason !== "token_expired") {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && error.response?.data.reason === "token_expired" && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await refreshTokens();
        return client(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError); 
      }
    }

    return Promise.reject(error);
  }
);

async function refreshTokens() {
  try {
    const response = await client.post('/refresh-token');

    if (response.status === 200) {
      console.log('Tokens successfully refreshed');
    }
  } catch (error) {
    console.error('Failed to refresh tokens:', error);
    throw error;
  }
}


export default client;
