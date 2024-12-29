import axios from "axios";

import { getMyInfo } from "../api/services/users";
import { redirect } from "react-router-dom";
import { io } from "socket.io-client";
import { setSocket, setStatusSocket, setUsersSocket } from "../store/socket";


export const rootPageLoader = async () => {
  try {
    const userData = await getMyInfo();
    if (!userData || !userData.id) {
      return redirect('/login');
    }
    
    const socket = io('wss://telegaramm.ru/api/messages', {
      query: {
        userId: userData?.id 
      }
    });
    const statusSocket = io('wss://telegaramm.ru/api/statuses');
    const usersSocket = io('wss://telegaramm.ru/api/users');
    
    setSocket(socket);
    setStatusSocket(statusSocket);
    setUsersSocket(usersSocket);

    return null;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        return redirect('/login');
      }
    }

    return { error };
  }
};

export const authPageLoader = async () => {
  const userData = await getMyInfo();
  if (userData) {
    return redirect('/');
  }
  return null;
};
