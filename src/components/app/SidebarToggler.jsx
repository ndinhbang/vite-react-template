import CIcon from '@coreui/icons-react';
import { cilMenu } from '@coreui/icons';
import { CHeaderToggler } from '@coreui/react-pro';
import { useSetAtom } from 'jotai';
import { sidebarVisibleAtom } from '@/store/app.js';
import { useCallback } from 'react';

const SidebarToggler = () => {
  const setSidebarVisisble = useSetAtom(sidebarVisibleAtom);
  const onSidebarToggle = useCallback(() => {
    setSidebarVisisble((current) => !current);
  }, []);

  return (
    <CHeaderToggler
      className='ps-1'
      onClick={onSidebarToggle}
    >
      <CIcon
        icon={cilMenu}
        size='lg'
      />
    </CHeaderToggler>
  );
};

export default SidebarToggler;
