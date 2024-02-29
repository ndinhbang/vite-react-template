import {
  CCol,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CLoadingButton,
  CRow,
} from '@coreui/react-pro';
import CIcon from '@coreui/icons-react';
import { cilLockLocked, cilUser } from '@coreui/icons';

const LoginForm = () => {
  return (
    <CForm>
      <h1>施設ログイン</h1>
      <p className='text-medium-emphasis'>あなたのアカウントでログインしてください</p>
      <CInputGroup className='mb-3'>
        <CInputGroupText>
          <CIcon icon={cilUser} />
        </CInputGroupText>
        <CFormInput
          placeholder='Username'
          autoComplete='username'
          onChange={(e) => {}}
        />
      </CInputGroup>
      <CInputGroup className='mb-4'>
        <CInputGroupText>
          <CIcon icon={cilLockLocked} />
        </CInputGroupText>
        <CFormInput
          type='password'
          placeholder='Password'
          autoComplete='current-password'
          onChange={(e) => {}}
        />
      </CInputGroup>
      <CRow>
        <CCol className='d-grid gap-2 col-8 mx-auto mt-3'>
          <CLoadingButton>ログイン</CLoadingButton>
        </CCol>
      </CRow>
    </CForm>
  );
};

export default LoginForm;
