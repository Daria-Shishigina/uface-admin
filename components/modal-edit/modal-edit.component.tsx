import { useEffect, useRef, useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// import type { yupResolver } from '@hookform/resolvers/yup';
// import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
import * as Yup from 'yup';
import { Bars } from 'react-loader-spinner';
import { gsap } from 'gsap';
import PictureCropper from 'components/cropper/cropper.component';
import moment from 'moment';
import imageCompression from 'browser-image-compression';

import { useGlobalContext } from '../../context/global';

import { IPhoto } from 'components/clients/clients.components';

import {
  CloseButton,
  Container,
  FormContainer,
  Image,
  Images,
  LoaderContainer,
  Modal,
} from './modal-edit.styles';
import WebCam from "react-webcam";

let test = {};

const ModalEdit = ({func}: any) => {
  test = func;
  const modalRef = useRef(null);
  const containerRef = useRef(null);
  const { editUser, setEditUser } = useGlobalContext();
  const [photo, setPhoto] = useState<string>('');
  const [photoObj, setPhotoObj] = useState<any>(null);
  const [photos, setPhotos] = useState<any>([]);

  //server response
  const [server, setResponse] = useState<any>(null);

  //Растиражирование
  const [copyStatus, setCopyStatus] = useState<boolean>(false);
  const [copyResponse, setCopyResponse] = useState<any>(null);

  //Get DB Data
  const [instituteS, setInstituteS] = useState(editUser?.vuz_kod);
  const [roleS, setRoleS] = useState(editUser?.role_kod);

  //Cropper
  const [cropperPhoto, setCropperPhoto] = useState<string>('');
  const [loadedPhoto, setLoadedPhoto] = useState<boolean>();
  const [cropperActive, setCropperActive] = useState<boolean>(false);

  //Камера и инпут фото
  const [isCamera, setIsCamera] = useState(false);
  const [bufferPhoto, setBufferPhoto] = useState(null);
  const [secondRemaining, setSeconds] = useState(3);

  //Для обновления главной фото
  const [mainPhotoStatus, setMainPhotoStatus] = useState<string>('');
  const [mainPhotoStep, setMainPhotoStep] = useState<boolean>(false);

  const webcamRef = useRef(null);
  const [imgSrc, setImgSrc] = useState(null);
  const [imgHidden, setImgHidden] = useState(1);
  const [onlyPwd, setOnlyPwd] = useState(0);

  let inpFile: any = null;

  //Func
  async function getPhoto() {
    if (editUser) {
      let login = sessionStorage.getItem('login');
      let password = sessionStorage.getItem('password');
      let height = 200;

      const userData = { login, password, height, pid: editUser.personid };
      const resPhoto = await fetch('/api/getPhotoFolk', {
        method: 'POST',
        body: JSON.stringify({ userData }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const photo: any = await resPhoto.json();

      if (photo.status === 'success') {
        setPhotos(photo.photos);
        setPhotoObj(photo);
      }

      return photo.status;
    }
  }
  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email('E-Mail должен быть правильным')
      .required('E-Mail обязателен'),
    activated: Yup.bool(),
    phone_approve: Yup.bool(),
    fio: Yup.string(),
    fname: Yup.string().required('Имя обязательно'),
    lname: Yup.string().required('Фамилия обязательна'),
    sname: Yup.string(),
    phone: Yup.string().required('Телефон обязателен'),
    dateborn: Yup.string().required('Дата рождения обязательна'),
    role_kod: Yup.string().required('Роль обязательна'),
    vuz_kod: Yup.string().required('Институт обязателен'),
  });
  // get functions to build form with useForm() hook
  const formOptions = {
    resolver: yupResolver(validationSchema),
    defaultValues: {
      email: editUser?.email,
      fname: editUser?.fname,
      activated: editUser?.activated,
      phone_approve: parseInt(editUser?.phone_approve),
      lname: editUser?.lname,
      sname: editUser?.sname,
      dateborn: moment(editUser?.dateborn, 'YYYY-MM-DD').format('DD.MM.YYYY'),
      phone: editUser?.phone,
      role_kod: editUser?.role_kod,
      vuz_kod: editUser?.vuz_kod,
    },
  };
  console.log(formOptions)

  const { register, handleSubmit, getValues, reset, formState } =
    useForm(formOptions);

  // console.log({ server, isResponse: !!server });

  //Обновление фотки, если пользователь есть - изменять состояние, при изменении контекста
  useEffect(() => {
    //@ts-ignore
    reset(editUser);
    setResponse(null);
  }, [editUser]);
  const { errors } = formState;

  interface IData {
    login: string | null;
    password: string | null;
    activated: string;
    phone_approve: string;
    photo: string;
    personid: string | undefined;
  }

  const updateCroppedPhoto = (photo: string) => {
    // setPhoto(photo);
    //@ts-ignore
    setPhoto(sessionStorage.getItem('recoverPhoto'));
    setCropperActive(false);
  };

  const onError = (errors: any, e: any) => console.log({ errors, e });

  async function submitHandler(data: any) {
    // const check = await onClickHandler(data);
    setResponse({ start: true });
    let login = sessionStorage.getItem('login');
    let password = sessionStorage.getItem('password');

    let api = editUser?.isCreate ? '/api/createFolk' : '/api/editFolk';

    console.log(
      editUser?.isCreate
        ? 'Создание пользователя'
        : 'Редактирование пользователя'
    );

    data.login = login;
    data.password = password;
    data.activated = `${data.activated}`;
    data.phone_approve = data.phone_approve ? '1' : '0';
    data.photo = photo;
    data.onlyPwd = onlyPwd;

    const res = await fetch(api, {
      method: 'PUT',
      body: JSON.stringify({ data }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    let resData = await res.json();

    // console.log({ resData });
    if (typeof resData === 'string') resData = JSON.parse(resData)
    if ((resData.status === 'success') && (typeof test === 'function')) test()
    setResponse(resData);
    // display form data on success

    // sessionStorage.setItem('user', JSON.stringify(data));
  }

  // CopyAccsToTerminals
  async function copyAccsToTerminals() {
    // const check = await onClickHandler(data);
    setCopyStatus(true);
    setCopyResponse(null);
    let login = sessionStorage.getItem('login');
    let password = sessionStorage.getItem('password');

    let api = '/api/CopyAccsToTerminals';

    console.log('Копирование на терминалы');

    // console.log({ data });

    //@ts-ignore
    let data: IData = {
      login: login,
      password: password,
      personid: editUser?.personid,
    };

    const res = await fetch(api, {
      method: 'POST',
      body: JSON.stringify({ data }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const resData = await res.json();

    console.log({ resData });
    setCopyResponse(resData);
    setCopyStatus(false);
  }

  //CopyAccsFacesToTerminals - тоже самое, что и выше, но с фотографиями
  async function copyAccsFacesToTerminals() {
    // const check = await onClickHandler(data);
    setCopyStatus(true);
    setCopyResponse(null);
    let login = sessionStorage.getItem('login');
    let password = sessionStorage.getItem('password');

    let api = '/api/CopyAccsFacesToTerminals';

    console.log('Копирование на терминалы с фотографиямия ');

    // console.log({ data });

    //@ts-ignore
    let data: IData = {
      login: login,
      password: password,
      personid: editUser?.personid,
    };

    const res = await fetch(api, {
      method: 'POST',
      body: JSON.stringify({ data }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const resData = await res.json();

    console.log({ resData });
    setCopyResponse(resData);
    setCopyStatus(false);
  }

  // EditAccsToTerminals
  async function editAccsToTerminals() {
    // const check = await onClickHandler(data);
    setCopyStatus(true);
    setCopyResponse(null);
    let login = sessionStorage.getItem('login');
    let password = sessionStorage.getItem('password');

    let api = '/api/EditAccsInTerminals';

    console.log('Копирование на терминалы');

    // console.log({ data });

    //@ts-ignore
    let data: IData = {
      login: login,
      password: password,
      personid: editUser?.personid,
    };

    const res = await fetch(api, {
      method: 'POST',
      body: JSON.stringify({ data }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const resData = await res.json();

    console.log({ resData });
    setCopyResponse(resData);
    setCopyStatus(false);
  }

  // EditAccsFacesInTerminals
  async function editAccsFacesToTerminals() {
    // const check = await onClickHandler(data);
    setCopyStatus(true);
    setCopyResponse(null);
    let login = sessionStorage.getItem('login');
    let password = sessionStorage.getItem('password');

    let api = '/api/EditAccsFacesInTerminals';

    console.log('Копирование на терминалы');

    // console.log({ data });

    //@ts-ignore
    let data: IData = {
      login: login,
      password: password,
      personid: editUser?.personid,
    };

    const res = await fetch(api, {
      method: 'POST',
      body: JSON.stringify({ data }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const resData = await res.json();

    console.log({ resData });
    setCopyResponse(resData);
    setCopyStatus(false);
  }

  // DelAccsToTerminals
  async function delAccsToTerminals() {
    // const check = await onClickHandler(data);
    setCopyStatus(true);
    setCopyResponse(null);
    let login = sessionStorage.getItem('login');
    let password = sessionStorage.getItem('password');

    let api = '/api/DelAccsToTerminals';

    console.log('Удалить с терминалов');
    //@ts-ignore
    let data: IData = {
      login: login,
      password: password,
      personid: editUser?.personid,
    };

    const res = await fetch(api, {
      method: 'POST',
      body: JSON.stringify({ data }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const resData = await res.json();

    // console.log({ resData });
    setCopyResponse(resData);
    setCopyStatus(false);
  }

  // DelAccsFacesToTerminals
  async function delAccsFacesToTerminals() {
    // const check = await onClickHandler(data);
    setCopyStatus(true);
    setCopyResponse(null);
    let login = sessionStorage.getItem('login');
    let password = sessionStorage.getItem('password');

    let api = '/api/DelAccsFacesFromTerminals';

    console.log('Удалить с терминалов');
    //@ts-ignore
    let data: IData = {
      login: login,
      password: password,
      personid: editUser?.personid,
    };

    const res = await fetch(api, {
      method: 'POST',
      body: JSON.stringify({ data }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const resData = await res.json();

    // console.log({ resData });
    setCopyResponse(resData);
    setCopyStatus(false);
  }

  // ChangeMainPhoto
  const changeMainPhoto = async (pid: string, fid: string) => {
    // const check = await onClickHandler(data);
    setMainPhotoStep(true);
    setMainPhotoStatus('Подождите...');

    let login = sessionStorage.getItem('login');
    let password = sessionStorage.getItem('password');

    const res = await fetch('/api/makeExtImgAsMain', {
      method: 'POST',
      body: JSON.stringify({ login, password, pid, fid }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await res.json();

    if (data.status === 'success') {
      setMainPhotoStatus('Успешно');
      setMainPhotoStep(false);
    }

    if (data.status === 'error') {
      setMainPhotoStatus(data.errordesc);
    }
  };

  // const onClickHandler = async (user: IData) => {
  //   console.log({ user });
  // };

  //Анимации
  const openFormAnimation = () => {
    gsap
      .timeline()
      .to(modalRef.current, {
        duration: 0.25,
        ease: 'sine',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
      })
      .set(modalRef.current, {
        pointerEvents: 'all',
      });

    gsap.to(containerRef.current, {
      translateX: '0%',
      ease: 'sine',
      duration: 0.25,
    });
  };

  const closeFormAnimation = () => {
    gsap
      .timeline()
      .to(modalRef.current, {
        duration: 0.25,
        ease: 'sine',
        backgroundColor: 'rgba(0, 0, 0, 0.0)',
      })
      .set(modalRef.current, {
        pointerEvents: 'none',
      });

    gsap.to(containerRef.current, {
      translateX: '105%',
      duration: 0.25,
      ease: 'sine',
      onComplete: () => {
        setEditUser(null);
        setPhoto('');
      },
    });
  };
  //Конец анимациям

  useEffect(() => {
    if (editUser !== null) {
      openFormAnimation();
    }

    reset();
    getPhoto();
    setPhotos([]);
    setMainPhotoStep(false);
    // if (editUser && editUser?.isCreate === false) {
    // }
  }, [editUser]);

  const toBase64 = (file: any) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const capture = useCallback(() => {
    const imageSrc = webcamRef?.current.getScreenshot();
    setImgSrc(imageSrc);
    setPhoto(imageSrc);
    setLoadedPhoto(true);
  }, [webcamRef, setImgSrc]);

  //Функции камеры и загрузки изображений
  const uploadFile = async (e: any) => {
    const file = e.currentTarget.files[0];
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1080,
    };
    try {
      const compressedFile = await imageCompression(file, options);

      const result: any = await toBase64(compressedFile).catch((e) => Error(e));
      // .then((result) => console.log(result));

      //Для дебагинга фото исходного
      // await toBase64(file)
      //   .catch((e) => Error(e))
      //   .then((result) => console.log(result));

      // setBufferPhoto(result);
      setPhoto(result);
      setLoadedPhoto(true);
      // await uploadBase64(bufferPhoto, photoNumber);
    } catch (error) {
      console.log(error);
    }
  };

  //Рендер
  return editUser ? (
    <Modal
      ref={modalRef}
      onClick={(event) => {
        //@ts-ignore
        if (!containerRef.current.contains(event.target)) {
          closeFormAnimation();
        }
      }}
    >
      <Container ref={containerRef}>
        <CloseButton
          onClick={() => {
            closeFormAnimation();
          }}
        >
          ✖
        </CloseButton>
        {cropperActive && (
          <div className='upload-photo'>
            <PictureCropper
              img={photo}
              callBackFunc={() => setLoadedPhoto(false)}
              updateCropped={() => updateCroppedPhoto(photo)}
              closeFunc={() => {
                setCropperActive(false);
              }}
            ></PictureCropper>
          </div>
        )}

        {/* Форма */}
        <FormContainer>
          <div className='card w-100'>
            <h3 className='card-header'>
              {editUser.isCreate
                ? 'Создание пользователя'
                : 'Изменение пользователя'}
            </h3>
            <div className='card-body'>
              {editUser?.isCreate && (
                <Image>
                  {photo !== '' ? (
                    <Images>
                      {photo && <img src={photo} height={200} />}
                      <button
                        type='button'
                        className={'delete'}
                        onClick={() => {
                          setPhoto('');
                        }}
                      >
                        Удалить
                      </button>
                    </Images>
                  ) : (
                    <div className='photos-block'>
                      <span>Загрузите фотографии или сфотографируетесь</span>
                      <button
                        type='button'
                        className={'upload'}
                        onClick={() => {
                          inpFile.click();
                        }}
                      >
                        Загрузить фото
                      </button>
                      <button
                          type='button'
                          className={'upload'}
                          onClick={() => {
                            setImgHidden(!imgHidden)
                          }}
                      >
                        Открыть камеру
                      </button>
                      <WebCam
                          audio={false}
                          hidden={imgHidden}
                          ref={webcamRef}
                          style={{height: '200px', width: '260px'}}
                          screenshotFormat="image/jpeg"  />
                      <button hidden={imgHidden} onClick={capture}>Сфотографироваться</button>
                    </div>
                  )}
                </Image>
              )}
              {!editUser?.isCreate && (
                <>
                  {photos.length > 0 ? (
                    <Images>
                      {photos.slice(0, 4).map((photo: IPhoto, i: number) => (
                        <Image key={photo.faceid}>
                          <img
                            className={photo.main ? 'main' : ''}
                            src={photo.base64}
                            width={150}
                          />
                          <input
                            className='select-main'
                            type='radio'
                            name='profile-photo'
                            onClick={
                              () =>
                                changeMainPhoto(editUser.personid, photo.faceid)

                              // Функция по назначению главной фото тут
                              // Цепочка такая:
                              // - дать пользователю анимацию и отключить возможность испольозвать галочки по name 'profile-photo', что работа начата;
                              // - сделать запрос и ждать;
                              // - по получению ответа от сервера отрисовать текст и дать возможность снова выбирать галочки
                              // console.log(`photo ${i + 1}`);
                            }
                            defaultChecked={photo.main}
                          />
                        </Image>
                      ))}
                      {/* {photo && <img src={photo} />} */}
                    </Images>
                  ) : (
                    <LoaderContainer>
                      <Bars color='#2c2c2c' height={100} width={100} />
                    </LoaderContainer>
                  )}
                  {mainPhotoStep && (
                    <span className='main-image-status'>{mainPhotoStatus}</span>
                  )}
                  <div className='buttons-block'>
                    <button
                      onClick={() => {
                        setCropperActive(true);
                      }}
                    >
                      Обрезать фото
                    </button>
                  </div>
                </>
              )}

              {/* Форма */}
              <form onSubmit={handleSubmit(submitHandler, onError)}>
              <div className='form-row'>
                <div className='form-group col'>
                  <label>Изменить пароль</label>
                  <input
                      type='hidden'
                      value={onlyPwd}
                      name='onlyPwd'
                      {...register('onlyPwd')}
                  />
                  <input
                      // @ts-ignore
                      name='pwd'
                      type='text'
                      {...register('pwd')}
                      className={`form-control ${
                          errors.password ? 'is-invalid' : ''
                      }`}
                  />
                  <div className='invalid-feedback'>
                    {errors.password?.message}
                  </div>
                  <button type='submit' className='btn btn-primary btn-sm' style={{marginTop: "10px", float: 'right'}}
                          onClick={() => {
                            setOnlyPwd(1)
                          }}>
                    {'Подтвердить'}
                  </button>
                </div>
              </div>
              </form>
              <hr/>
              <form onSubmit={handleSubmit(submitHandler, onError)}>
                <div className='form-row'>
                  <div className='form-group col'>
                    <input
                        type='hidden'
                        value={onlyPwd}
                        name='onlyPwd'
                        {...register('onlyPwd')}
                    />
                    <label>E-Mail</label>
                    <input
                      // @ts-ignore
                      name='email'
                      type='text'
                      {...register('email')}
                      className={`form-control ${
                        errors.email ? 'is-invalid' : ''
                      }`}
                    />
                    <div className='invalid-feedback'>
                      {errors.email?.message}
                    </div>
                    <div>
                      <span>Email активирован: </span>
                      <input
                        // @ts-ignore
                        name='activated'
                        type='checkbox'
                        checked={parseInt(formOptions.defaultValues.activated)}
                      />
                    </div>
                  </div>
                </div>
                {/*style={{marginTop: '-30px'}}*/}
                <div className='form-row'>
                  <div className='form-group col'>
                    <label>Имя</label>
                    <input
                      // @ts-ignore
                      name='fname'
                      type='text'
                      {...register('fname')}
                      className={`form-control ${
                        errors.fname ? 'is-invalid' : ''
                      }`}
                    />
                    <div className='invalid-feedback'>
                      {errors.fname?.message}
                    </div>
                  </div>
                </div>
                <div className='form-row'>
                  <div className='form-group col'>
                    <label>Фамилия</label>
                    <input
                      // @ts-ignore
                      name='lname'
                      type='text'
                      {...register('lname')}
                      className={`form-control ${
                        errors.lname ? 'is-invalid' : ''
                      }`}
                    />
                    <div className='invalid-feedback'>
                      {errors.lname?.message}
                    </div>
                  </div>
                </div>
                <div className='form-row'>
                  <div className='form-group col'>
                    <label>Отчество</label>
                    <input
                      // @ts-ignore
                      name='sname'
                      type='text'
                      {...register('sname')}
                      className={`form-control ${
                        errors.sname ? 'is-invalid' : ''
                      }`}
                    />
                    <div className='invalid-feedback'>
                      {errors.sname?.message}
                    </div>
                  </div>
                </div>
                <div className='form-row'>
                  <div className='form-group col'>
                    <label>Телефон</label>
                    <input
                      // @ts-ignore
                      name='phone'
                      type='text'
                      {...register('phone')}
                      className={`form-control ${
                        errors.phone ? 'is-invalid' : ''
                      }`}
                    />
                    <div className='invalid-feedback'>
                      {errors.phone?.message}
                    </div>
                    <div>
                      <span>Телефон активирован: </span>
                      <input
                        // @ts-ignore
                        name='phone_approve'
                        type='checkbox'
                        checked={parseInt(formOptions.defaultValues.phone_approve)}
                      />
                    </div>
                  </div>
                </div>
                <div className='form-row'>
                  <div className='form-group col'>
                    <label>Дата рождения</label>
                    <input
                      // @ts-ignore
                      name='dateborn'
                      type='date'
                      {...register('dateborn')}
                      className={`form-control ${
                        errors.dateborn ? 'is-invalid' : ''
                      }`}
                    />
                    <div className='invalid-feedback'>
                      {errors.dateborn?.message}
                    </div>
                  </div>
                </div>
                <div className='form-row'>
                  <div className='form-group col'>
                    <label>Роль</label>
                    <select
                      // @ts-ignore
                      name='role_kod'
                      // onChange={(e) => {
                      // 	setRoleS(e.target.value);
                      // }}
                      {...register('role_kod')}
                      className={`form-control ${
                        errors.role_kod ? 'is-invalid' : ''
                      }`}
                    >
                      <option value='1'>Гость</option>
                      <option value='2'>Студент</option>
                      <option value='3'>Преподаватель</option>
                      <option value='4'>Сотрудник</option>
                    </select>
                    <div className='invalid-feedback'>
                      {errors.role_kod?.message}
                    </div>
                  </div>
                </div>
                <div className='form-row'>
                  <div className='form-group col'>
                    <label>Институт</label>
                    <select
                      // @ts-ignore
                      name='vuz_kod'
                      // onChange={(e) => {
                      // 	setInstituteS(e.target.value);
                      // 	console.log(e.target.value);
                      // }}
                      {...register('vuz_kod')}
                      className={`form-control ${
                        errors.vuz_kod ? 'is-invalid' : ''
                      }`}
                    >
                      <option value='1'>Кампус НИ ТГУ</option>
                      <option value='2'>ТПУ</option>
                      <option value='3'>ТУСУР</option>
                      <option value='4'>ГМПИ (Ипполитовка)</option>
                      <option value='6'>НовГУ</option>
                    </select>
                    <div className='invalid-feedback'>
                      {errors.vuz_kod?.message}
                    </div>
                  </div>
                </div>

                {!editUser.isCreate && (
                  <div
                    style={{
                      margin: '20px 0',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 10,
                    }}
                  >
                    <h5>Тиражирование</h5>
                    {!!copyResponse &&
                      copyResponse?.status === 'success' &&
                      'Операция выполнена успешно'}
                    <div
                      style={{
                        margin: '20px 0',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 10,
                      }}
                    >
                      <span>Без фото</span>
                      <button
                        type='button'
                        onClick={() => {
                          copyAccsToTerminals();
                        }}
                        className='btn btn-primary mr-1'
                      >
                        {copyStatus
                          ? 'Подождите'
                          : 'Растиражироваить на терминалы без фото'}
                      </button>

                      <button
                        type='button'
                        onClick={() => {
                          editAccsToTerminals();
                        }}
                        className='btn btn-primary mr-1'
                      >
                        {copyStatus
                          ? 'Подождите'
                          : 'Тиражирование изменений данных'}
                      </button>
                    </div>
                    <div
                      style={{
                        margin: '20px 0',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 10,
                      }}
                    >
                      <span>С фото</span>
                      {/* editAccsFacesToTerminals */}
                      <button
                        type='button'
                        onClick={() => {
                          copyAccsFacesToTerminals();
                        }}
                        className='btn btn-primary mr-1'
                      >
                        {copyStatus
                          ? 'Подождите'
                          : 'Растиражироваить на терминалы с фото'}
                      </button>
                      <button
                        type='button'
                        onClick={() => {
                          editAccsFacesToTerminals();
                        }}
                        className='btn btn-primary mr-1'
                      >
                        {copyStatus
                          ? 'Подождите'
                          : 'Тиражирование изменений данных'}
                      </button>
                    </div>
                    <div
                      style={{
                        margin: '20px 0',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 10,
                      }}
                    >
                      <span>Удаление</span>
                      <button
                        type='button'
                        onClick={() => {
                          delAccsFacesToTerminals();
                        }}
                        className='btn btn-primary mr-1'
                      >
                        {copyStatus ? 'Подождите' : 'Удалить фото с терминалов'}
                      </button>
                      <button
                        type='button'
                        onClick={() => {
                          delAccsToTerminals();
                        }}
                        className='btn btn-primary mr-1'
                      >
                        {copyStatus
                          ? 'Подождите'
                          : 'Удалить с терминалов полностью'}
                      </button>
                    </div>
                  </div>
                )}

                <div className='form-group'>
                  <h5>
                    {editUser?.isCreate
                      ? 'Создать пользователя'
                      : 'Обновить пользователя'}
                  </h5>

                  {!!server && server.status === 'error' && (
                    <div style={{ margin: '10px 0' }}>{server?.errordesc}</div>
                  )}
                  {!!server && server.status === 'success' && (
                    <div style={{ margin: '10px 0' }}>{server?.statusdesc}</div>
                  )}

                  <button type='submit' className='btn btn-primary mr-1'
                          onClick={() => {
                            setOnlyPwd(0)
                          }}
                  >
                    {!!server && server?.status !== 'success'
                      ? 'Подождите...'
                      : 'Подтвердить'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </FormContainer>
        <input
          onChange={uploadFile}
          style={{ display: 'none' }}
          type='file'
          ref={(inp) => (inpFile = inp)}
          accept='image/x-png,image/gif,image/jpeg'
        />
      </Container>
    </Modal>
  ) : (
    <></>
  );
};

export default ModalEdit;
