import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// import type { yupResolver } from '@hookform/resolvers/yup';
// import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
import * as Yup from 'yup';

function RegisterForm() {
  // form validation rules
  const validationSchema = Yup.object().shape({
    title: Yup.string().required('Необходимо выбрать пол'),
    firstName: Yup.string().required('First Name is required'),
    lastName: Yup.string().required('Last name is required'),
    dob: Yup.string()
      .required('Date of Birth is required')
      .matches(
        /^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/,
        'Date of Birth must be a valid date in the format YYYY-MM-DD'
      ),
    email: Yup.string().required('Email is required').email('Email is invalid'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Confirm Password is required'),
    acceptTerms: Yup.bool().oneOf([true], 'Accept Ts & Cs is required'),
  });
  const formOptions = { resolver: yupResolver(validationSchema) };

  // get functions to build form with useForm() hook
  const { register, handleSubmit, reset, formState } = useForm(formOptions);
  const { errors } = formState;

  interface IData {
    acceptTerms: boolean;
    confirmPassword: string;
    dob: string;
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    title: string;
  }

  function onSubmit(data: IData) {
    // console.log({ data });
    // display form data on success
    alert('SUCCESS!! :-)\n\n' + JSON.stringify(data, null, 4));
    return false;
  }

  return (
    <div className='card m-3'>
      <h3 className='card-header'>Регистрация</h3>
      <div className='card-body'>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className='form-row'>
            <div className='form-group col'>
              <label>Пол</label>
              <select
                // @ts-ignore
                name='title'
                {...register('title')}
                className={`form-control ${errors.title ? 'is-invalid' : ''}`}
              >
                <option value=''></option>
                <option value='Муж.'>Муж.</option>
                <option value='Жен.'>Жен.</option>
              </select>
              <div className='invalid-feedback'>{errors.title?.message}</div>
            </div>
            <div className='form-group col-5'>
              <label>First Name</label>
              <input
                // @ts-ignore
                name='firstName'
                type='text'
                {...register('firstName')}
                className={`form-control ${
                  errors.firstName ? 'is-invalid' : ''
                }`}
              />
              <div className='invalid-feedback'>
                {errors.firstName?.message}
              </div>
            </div>
            <div className='form-group col-5'>
              <label>Last Name</label>
              <input
                // @ts-ignore
                name='lastName'
                type='text'
                {...register('lastName')}
                className={`form-control ${
                  errors.lastName ? 'is-invalid' : ''
                }`}
              />
              <div className='invalid-feedback'>{errors.lastName?.message}</div>
            </div>
          </div>
          <div className='form-row'>
            <div className='form-group col'>
              <label>Date of Birth</label>
              <input
                // @ts-ignore
                name='dob'
                type='date'
                {...register('dob')}
                className={`form-control ${errors.dob ? 'is-invalid' : ''}`}
              />
              <div className='invalid-feedback'>{errors.dob?.message}</div>
            </div>
            <div className='form-group col'>
              <label>Email</label>
              <input
                // @ts-ignore
                name='email'
                type='text'
                {...register('email')}
                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
              />
              <div className='invalid-feedback'>{errors.email?.message}</div>
            </div>
          </div>
          <div className='form-row'>
            <div className='form-group col'>
              <label>Password</label>
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
            <div className='form-group col'>
              <label>Confirm Password</label>
              <input
                // @ts-ignore
                name='confirmPassword'
                type='password'
                {...register('confirmPassword')}
                className={`form-control ${
                  errors.confirmPassword ? 'is-invalid' : ''
                }`}
              />
              <div className='invalid-feedback'>
                {errors.confirmPassword?.message}
              </div>
            </div>
          </div>
          <div className='form-group form-check'>
            <input
              // @ts-ignore
              name='acceptTerms'
              type='checkbox'
              {...register('acceptTerms')}
              id='acceptTerms'
              className={`form-check-input ${
                errors.acceptTerms ? 'is-invalid' : ''
              }`}
            />
            <label htmlFor='acceptTerms' className='form-check-label'>
              Согласиться с Правилами & Условиями
            </label>
            <div className='invalid-feedback'>
              {errors.acceptTerms?.message}
            </div>
          </div>
          <div className='form-group'>
            <button type='submit' className='btn btn-primary mr-1'>
              Зарегистрироваться
            </button>
            <button
              type='button'
              onClick={() => reset()}
              className='btn btn-secondary'
            >
              Сбросить
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RegisterForm;
