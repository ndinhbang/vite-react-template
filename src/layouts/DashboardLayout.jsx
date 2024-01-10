import Header from '@/components/app/Header.jsx';
import { Outlet } from 'react-router-dom';

const DashboardLayout = () => {
  return (
    <div>
      <div className='wrapper d-flex flex-column min-vh-100 bg-light'>
        <Header sidebarShow={false} />
        <div className='body flex-grow-1 px-3'>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
