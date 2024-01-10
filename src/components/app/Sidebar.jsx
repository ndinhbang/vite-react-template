import { CSidebar, CSidebarBrand, CSidebarNav } from '@coreui/react-pro';
import { useCallback } from 'react';
import SidebarNav from '@/components/app/SidebarNav.jsx';
import { useAtom } from 'jotai';
import { sidebarVisibleAtom } from '@/store/app.js';

const Sidebar = () => {
  const [visible, setVisible] = useAtom(sidebarVisibleAtom);
  const onVisibleChange = useCallback((visible) => {
    setVisible(visible);
  }, []);

  return (
    <CSidebar
      position='fixed'
      narrow={false}
      unfoldable={true}
      visible={visible}
      onVisibleChange={onVisibleChange}
    >
      <CSidebarBrand
        className='d-none d-md-flex'
        to='/'
      >
        <div className='sidebar-brand-full'>App Name</div>
        <div className='sidebar-brand-narrow'>APP</div>
      </CSidebarBrand>
      <CSidebarNav>
        <SidebarNav />
      </CSidebarNav>
    </CSidebar>
  );
};

export default Sidebar;
