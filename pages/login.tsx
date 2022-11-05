import type { NextPage } from 'next';
import styled from 'styled-components';
import LoginForm from '../components/Forms/login.component';
// import RegisterForm from '../components/Forms/register.component';

const PageContainer = styled.div`
  width: 100%;
  height: 100vh;
  margin: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(90deg, #aea4e3, #d3ffe8);

  .form-container {
    display: flex;
    height: 100%;
    width: 100%;
    align-items: flex-end;
    justify-content: flex-end;
  }

  .left-side {
    flex: 1;

    @media screen and (max-width: 768px) {
      display: none;
    }
  }

  .right-side {
    /* background-color: #fff; */
    height: 100%;

    flex: 1;

    display: flex;
    align-items: center;
    justify-content: center;

    @media screen and (max-width: 768px) {
      background: linear-gradient(90deg, #aea4e3, #d3ffe8);
    }
  }

  .card-header {
    border: none;
    background: none;
  }

  .card {
    border: none;
    border-radius: 20px;
    padding: 20px;
  }
`;

const LoginPage: NextPage = () => {
  return (
    <PageContainer>
      <div className='form-container'>
        <div className='left-side' />
        <div className='right-side'>
          <LoginForm />
        </div>
      </div>
    </PageContainer>
  );
};

export default LoginPage;
