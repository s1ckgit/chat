import { useNavigate } from "react-router-dom";
import CredentialsForm from "../components/CredentialsForm/CredentialsForm.component";
import { CircularProgress } from "@mui/material";
import { useUserMeQuery } from "../api/hooks/users";
import { useEffect } from "react";

const LoginPage = () => {
  const { data: me, isLoading } = useUserMeQuery();

  const navigate = useNavigate();

  useEffect(() => {
    if(me) {
      navigate('/');
    }
  }, [me, navigate]);

  return (
    <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      {
        !me && !isLoading ? <CredentialsForm variant="login" /> : <CircularProgress />
      }
    </div>
  );
};

export default LoginPage;
