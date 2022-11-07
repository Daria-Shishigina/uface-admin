//@ts-ignore
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
// import type { yupResolver } from '@hookform/resolvers/yup';
// import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
import styled from 'styled-components';
import 'yup-phone';
import * as Yup from 'yup';

//Сontext
import { useGlobalContext } from 'context/global';
import { FormContainer } from './styles/personal.styles';

//Interfaces
interface IForm {
  name: string;
  login: string;
  phone: string;
  password: string;
  newPassword: string;
}

function PersonalInfo() {
  const { user } = useGlobalContext();

  const [eyePass, setEyePass] = useState(true);
  const [confirmEyePass, setConfirmEyePass] = useState(true);
  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Имя обязательно'),
    login: Yup.string()
      .required('E-Mail обязателен')
      .email('Неправильный E-Mail'),
    phone: Yup.string().phone('RU', true).required('Телефон обязателен'),
    password: Yup.string()
      .min(6, 'Пароль должен состоять минимум из 6 символов')
      .required('Пароль обязателен'),
    newPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Пароли должны совпадать')
      .min(6, 'Пароль должен состоять минимум из 6 символов')
      .required('Пароль обязателен'),
  });
  // console.log(user);
  const formOptions = {
    resolver: yupResolver(validationSchema),
    defaultValues: { name: user?.login },
  };
  const { register, handleSubmit, reset, formState } =
    useForm<any>(formOptions);
  const { errors } = formState;

  interface IData {
    name: string;
    login: string;
    phone: string;
    password: string;
    newPassword: string;
  }
  interface IEyeProps {
    error: string | undefined;
  }
  const EyeStyles = styled.i<IEyeProps>`
    position: absolute;
    right: ${(props) => (props.error ? '34px' : '15px')};
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
  `;
  const PassInputContainer = styled.div`
    position: relative;
  `;
  function onSubmit(data: IData) {
    // display form data on success
    alert('SUCCESS!! :-)\n\n' + JSON.stringify(data, null, 4));
    return false;
  }
  return (
    <FormContainer className='card m-1'>
      <h3 className='card-header'>Изменение личных данных</h3>{' '}
      <div className='card-body'>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className='form-row'>
            <div className='form-group col-3'>
              <label>Имя</label>
              <input
                // @ts-ignore
                name='name'
                type='text'
                {...register('name')}
                className={`form-control ${errors.name ? 'is-invalid' : ''}`}
              />
              <div className='invalid-feedback'>{errors.name?.message}</div>
            </div>
          </div>
          <div className='form-row'>
            <div className='form-group col-3'>
              <label>E-Mail</label>
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
            <div className='form-group col-3'>
              <label>Телефон</label>
              <input
                // @ts-ignore
                name='phone'
                type='text'
                {...register('phone')}
                className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
              />{' '}
              <div className='invalid-feedback'>{errors.phone?.message}</div>
            </div>{' '}
          </div>{' '}
          <div className='form-row'>
            <div className='form-group col-3'>
              <label>Новый пароль</label>
              <PassInputContainer>
                <input
                  // @ts-ignore
                  name='password'
                  type={eyePass ? 'password' : 'text'}
                  {...register('password')}
                  className={`form-control ${
                    errors.password ? 'is-invalid' : ''
                  }`}
                />{' '}
                <EyeStyles
                  error={errors?.password?.message}
                  className={
                    eyePass ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'
                  }
                  onClick={() => setEyePass(!eyePass)}
                ></EyeStyles>
              </PassInputContainer>

              <div className='invalid-feedback'>{errors.password?.message}</div>
            </div>
          </div>{' '}
          <div className='form-row'>
            <div className='form-group col-3'>
              <label>Подтвердите новый пароль</label>
              <PassInputContainer>
                <input
                  // @ts-ignore
                  name='newPassword'
                  type={confirmEyePass ? 'password' : 'text'}
                  {...register('newPassword')}
                  className={`form-control ${
                    errors.newPassword ? 'is-invalid' : ''
                  }`}
                />
                <EyeStyles
                  error={errors?.newPassword?.message}
                  className={
                    confirmEyePass ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'
                  }
                  onClick={() => setConfirmEyePass(!confirmEyePass)}
                ></EyeStyles>
              </PassInputContainer>

              <div className='invalid-feedback'>
                {errors.newPassword?.message}
              </div>
            </div>{' '}
          </div>
          <div className='form-group'>
            <button type='submit' className='btn btn-primary mr-1'>
              Сохранить
            </button>
          </div>
        </form>
      </div>
    </FormContainer>
  );
}
export default PersonalInfo;
