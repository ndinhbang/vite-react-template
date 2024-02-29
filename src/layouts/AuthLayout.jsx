import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <div className={`auth-layout bg-light min-vh-100 d-flex flex-row align-items-center`}>
      <Outlet />
    </div>
  );
};

export default AuthLayout;
