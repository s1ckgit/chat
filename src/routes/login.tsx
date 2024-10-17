import { useNavigate } from "react-router-dom";
import CredentialsForm from "../components/CredentialsForm/CredentialsForm.component";
import { useEffect } from "react";
import { CircularProgress } from "@mui/material";

const LoginPage = () => {
  const id = localStorage.getItem('id');

  const navigate = useNavigate();

  useEffect(() => {
    if(id) {
      navigate('/');
    }
  }, [id, navigate]);

  return (
    <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      {
        !id ? <CredentialsForm variant="login" /> : <CircularProgress />
      }
    </div>
  );
};

export default LoginPage;
