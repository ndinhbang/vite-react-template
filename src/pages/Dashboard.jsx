import { Link, Outlet } from 'react-router-dom';
import { CButton } from '@coreui/react-pro';

const Dashboard = () => {
  return (
    <div>
      Dashboard
      <CButton>Button</CButton>
      <nav>
        <ul>
          <li>
            <Link to={`auth/login`}>Login</Link>
          </li>
          <li>
            <Link to={`auth/register`}>Register</Link>
          </li>
        </ul>
      </nav>
      <div>
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;
