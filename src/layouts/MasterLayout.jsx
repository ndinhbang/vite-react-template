import { Outlet } from 'react-router-dom';

const MasterLayout = () => {
    return (
        <div
            className={`master-layout`}
            style={{ minHeight: '100vh' }}
        >
            <Outlet />
        </div>
    );
};

export default MasterLayout;
