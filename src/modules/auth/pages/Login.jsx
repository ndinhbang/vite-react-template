import { CCard, CCardBody, CCardGroup, CCol, CContainer, CRow } from '@coreui/react-pro';
import LoginForm from '@/modules/auth/form/LoginForm.jsx';

const Login = () => {
  return (
    <CContainer>
      <CRow className={'justify-content-center'}>
        <CCol
          md={5}
          sm={6}
        >
          <CCardGroup>
            <CCard className='p-4'>
              <CCardBody className='login_content'>
                <LoginForm />
              </CCardBody>
            </CCard>
          </CCardGroup>
        </CCol>
      </CRow>
    </CContainer>
  );
};

export default Login;
