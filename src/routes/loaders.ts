import axios from "axios";
import { getMyInfo } from "../api/services/users";
import { redirect } from "react-router-dom";
import { io } from "socket.io-client";
import { setUserId } from "../store/user";
import { setSocket, setStatusSocket } from "../store/chat";

export const rootLoader = async () => {
  try {
    const userData = await getMyInfo();
    const socket = io('http://localhost:3000/api/messages', {
      query: {
        userId: userData.id 
      }
    });
    const statusSocket = io('http://localhost:3000/api/statuses');

    if (!userData || !userData.id) {
      return redirect('/login');
    }

    setUserId(userData.id);
    setSocket(socket);
    setStatusSocket(statusSocket);

    return { userData, socket, statusSocket };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        return redirect('/login');
      }
    }

    return { error };
  }
};
