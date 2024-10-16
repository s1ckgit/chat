import axios from "axios";
import { getMyInfo } from "../api/services/users";
import { redirect } from "react-router-dom";

export const rootLoader = async () => {
  try {
    const userData = await getMyInfo();
    return { userData };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        return redirect('/login');
      }
    }

    return { error };
  }
};
