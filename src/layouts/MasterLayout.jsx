import { Outlet } from 'react-router-dom';

const MasterLayout = () => {
  return (
    <div className={`master-layout min-vh-100`}>
      <Outlet />
    </div>
  );
};

export default MasterLayout;
