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
import { getPageSetting, route } from '@/utils/_base.js';
import { useForm, useFormActions, useFormState } from 'form-atoms';
import { loginFormAtom } from '@/modules/auth/form/login.atom.js';

const setting = getPageSetting('auth.login');

const LoginForm = () => {
  const { fieldAtoms, submit } = useForm(loginFormAtom);
  const state = useFormActions(loginFormAtom);

  console.log(state);

  const handleSubmit = () => {
    submit((values) => {
      console.log(values);
    });
  };
  return (
    <CForm>
      <h1>{setting.title}</h1>
      <p className='text-medium-emphasis'>{route('auth.login')}</p>
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
          <CLoadingButton onClick={handleSubmit}>Login</CLoadingButton>
        </CCol>
      </CRow>
    </CForm>
  );
};

export default LoginForm;
