import CredentialsForm from "../components/CredentialsForm/CredentialsForm.component";

const LoginPage = () => {
  return (
    <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <CredentialsForm variant="login" />
    </div>
  );
};

export default LoginPage;
