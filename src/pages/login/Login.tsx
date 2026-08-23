import { Suspense } from "react";
import LoginForm from "../../features/auth/LoginForm";

const Login = () => {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
};

export default Login;
