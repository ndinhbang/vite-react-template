import Sidebar from '@/components/app/Sidebar.jsx';
import Header from '@/components/app/Header.jsx';
import { Outlet } from 'react-router-dom';

const DefaultLayout = () => {
  return (
    <div>
      <Sidebar />
      <div className='wrapper d-flex flex-column min-vh-100 bg-light'>
        <Header />
        <div className='body flex-grow-1 px-3'>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DefaultLayout;
