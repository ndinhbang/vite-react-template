import { useCallback } from 'react';
import {
  CContainer,
  CHeader,
  CHeaderBrand,
  CHeaderDivider,
  CHeaderNav,
  CHeaderToggler,
  CNavItem,
  CNavLink,
} from '@coreui/react-pro';
import CIcon from '@coreui/icons-react';
import { cilBell, cilEnvelopeOpen, cilList, cilMenu } from '@coreui/icons';
import { NavLink } from 'react-router-dom';
import { useAtom, useSetAtom } from 'jotai';
import { sidebarVisibleAtom } from '@/store/app.js';

function AppHeaderDropdown() {
  return null;
}

function AppBreadcrumb() {
  return null;
}

const Header = () => {
  const [sidebarVisible, setSidebarVisisble] = useAtom(sidebarVisibleAtom);
  const onSidebarToggle = useCallback(() => {
    setSidebarVisisble(!sidebarVisible);
  }, [sidebarVisible]);

  return (
    <CHeader
      position='sticky'
      className='mb-4'
    >
      <CContainer fluid>
        <CHeaderToggler
          className='ps-1'
          onClick={onSidebarToggle}
        >
          <CIcon
            icon={cilMenu}
            size='lg'
          />
        </CHeaderToggler>
        <CHeaderBrand
          className='mx-auto d-md-none'
          to='/'
        >
          {/*<CIcon icon={logo} height={48} alt="Logo" />*/}
        </CHeaderBrand>
        <CHeaderNav className='d-none d-md-flex me-auto'>
          <CNavItem>
            <CNavLink
              to='/dashboard'
              component={NavLink}
            >
              Dashboard
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink href='#'>Users</CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink href='#'>Settings</CNavLink>
          </CNavItem>
        </CHeaderNav>
        <CHeaderNav>
          <CNavItem>
            <CNavLink href='#'>
              <CIcon
                icon={cilBell}
                size='lg'
              />
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink href='#'>
              <CIcon
                icon={cilList}
                size='lg'
              />
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink href='#'>
              <CIcon
                icon={cilEnvelopeOpen}
                size='lg'
              />
            </CNavLink>
          </CNavItem>
        </CHeaderNav>
        <CHeaderNav className='ms-3'>
          <AppHeaderDropdown />
        </CHeaderNav>
      </CContainer>
    </CHeader>
  );
};

export default Header;
