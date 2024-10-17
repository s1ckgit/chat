import axios from "axios";
import { getMyInfo } from "../api/services/users";
import { redirect } from "react-router-dom";
import { io } from "socket.io-client";

export const rootLoader = async () => {
  try {
    const userData = await getMyInfo();
    const socket = io('/api/messages', {
      query: {
        userId: userData.id
      }
    });
    return { userData, socket };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        return redirect('/login');
      }
    }

    return { error };
  }
};
