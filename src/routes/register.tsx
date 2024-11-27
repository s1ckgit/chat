import CredentialsForm from "../components/CredentialsForm/CredentialsForm.component";

const RegistrationPage = () => {

  return (
    <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <CredentialsForm variant="register" />
    </div>
  );
};

export default RegistrationPage;
