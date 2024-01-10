import CIcon from '@coreui/icons-react';
import { cilMenu } from '@coreui/icons';
import { CHeaderToggler } from '@coreui/react-pro';
import { useAtom } from 'jotai/index.js';
import { sidebarVisibleAtom } from '@/store/app.js';
import { useCallback } from 'react';

const HeaderToggler = () => {
  const [sidebarVisible, setSidebarVisisble] = useAtom(sidebarVisibleAtom);
  const onSidebarToggle = useCallback(() => {
    setSidebarVisisble(!sidebarVisible);
  }, [sidebarVisible]);

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

export default HeaderToggler;
