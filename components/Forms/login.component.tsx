//@ts-ignore
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// import type { yupResolver } from '@hookform/resolvers/yup';
// import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
import * as Yup from 'yup';
import { useRouter } from 'next/router';
import { useGlobalContext } from '../../context/global';
import styled from 'styled-components';

function LoginForm() {
  const router = useRouter();
  const { authenticated, user, setUser } = useGlobalContext();

  // form validation rules
  const validationSchema = Yup.object().shape({
    login: Yup.string().required('Login is required'),
    password: Yup.string()
      .min(3, 'Password must be at least 3 characters')
      .required('Password is required'),
  });
  const formOptions = { resolver: yupResolver(validationSchema) };

  // get functions to build form with useForm() hook
  const { register, handleSubmit, reset, formState } = useForm(formOptions);
  const { errors } = formState;

  interface IData {
    login: string;
    password: string;
  }

  async function submitHandler(data: any) {
    if (data !== null) {
      // console.log({ data });
      const check = await onClickHandler(data);
      sessionStorage.setItem('login', data.login);
      sessionStorage.setItem('password', data.password);
      sessionStorage.setItem('user', JSON.stringify(check));
      setUser(check);
      // console.log({ check });
    }
  }

  const onClickHandler = async (user: any) => {
    const res = await fetch('/api/admlogin', {
      method: 'POST',
      body: JSON.stringify({ user }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await res.json();
    if (data.status === 'error') {
      return null;
    }
    return data;
  };


  authenticated && router.push('/dashboard');

  const Card = styled.div`
    width: 100%;
    max-width: 420px;

    h3 {
      text-align: center;
    }

    .image {
      max-width: 120px;
      width: 100%;
      margin: auto;
      margin-bottom: 25px;
      margin-top: 25px;
    }
  `;

  return (
    <Card className='card m-3'>
      <img src='/images/fc-logo.jpg' className='image' alt='Face ELook' />
      <h3 className='card-header'>Добро пожаловать</h3>
      <div className='card-body'>
        <form onSubmit={handleSubmit(submitHandler)}>
          <div className='form-row'>
            <div className='form-group col'>
              <label>Логин</label>
              <input
                // @ts-ignore
                name='login'
                type='text'
                {...register('login')}
                className={`form-control ${errors.login ? 'is-invalid' : ''}`}
              />
              <div className='invalid-feedback'>{errors.login?.message}</div>
            </div>
          </div>
          <div className='form-row'>
            <div className='form-group col'>
              <label>Пароль</label>
              <input
                // @ts-ignore
                name='password'
                type='password'
                {...register('password')}
                className={`form-control ${
                  errors.password ? 'is-invalid' : ''
                }`}
              />
              <div className='invalid-feedback'>{errors.password?.message}</div>
            </div>
          </div>
          <div className='form-group'>
            <button type='submit' className='btn btn-primary mr-1 w-100 mt-3'>
              Логин
            </button>
            {/* <button
              type='button'
              onClick={() => reset()}
              className='btn btn-secondary'
            >
              Сбросить
            </button> */}
          </div>
        </form>
        <p>
          {user?.status === 'success'
            ? `Авторизация успешно выполнена`
            : user?.status === 'error' && `Неверный логин или пароль`}
        </p>
      </div>
    </Card>
  );
}

export default LoginForm;
