import React, { useState } from 'react';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import css from './cropper.module.css';

const PictureCropper = ({
  img,
  callBackFunc,
  updateCropped,
  closeFunc,
}: {
  img: string;
  callBackFunc: () => void;
  updateCropped: () => void;
  closeFunc: () => void;
}) => {
  const [cropper, setCropper] = useState<any>();
  const [cropData, setCropData] = useState<any>();

  const rotateCropData = (direction: number) => {
    if (typeof cropper !== 'undefined') {
      cropper.rotate(90 * direction);
    }
  };
  const getCropData = () => {
    if (typeof cropper !== 'undefined') {
      setCropData(cropper.getCroppedCanvas().toDataURL('image/jpeg'));
    }
  };
  const submitCropData = () => {
    if (typeof cropper !== 'undefined') {
      sessionStorage.setItem('recoverPhoto', cropData);
    }
    // @ts-ignore
    updateCropped(cropData);
    callBackFunc();
  };
  const closeCrop = () => {
    callBackFunc();
  };

  return (
    <div className={css.CropperContainer}>
      {!cropData ? (
        <Cropper
          zoomTo={0}
          initialAspectRatio={1}
          aspectRatio={1}
          preview='.img-preview'
          src={img}
          viewMode={1}
          minCropBoxHeight={100}
          minCropBoxWidth={100}
          background={false}
          responsive={true}
          autoCropArea={1}
          checkOrientation={false} // https://github.com/fengyuanchen/cropperjs/issues/671
          onInitialized={(instance: any) => {
            setCropper(instance);
          }}
          className={css.imageCropper}
          guides={true}
        />
      ) : (
        <img
          className={css.croppedImage}
          alt={'cropped-data'}
          src={cropData}
        ></img>
      )}
      {!cropData ? (
        <div>
          <button className={css.buttonClass} onClick={closeFunc}>
            Отмена
          </button>
          <button className={css.buttonClass} onClick={getCropData}>
            Обрезать
          </button>
          <button
            className={css.buttonClass}
            onClick={() => {
              rotateCropData(-1);
            }}
          >
            Повернуть налево
          </button>
          <button
            className={css.buttonClass}
            onClick={() => {
              rotateCropData(1);
            }}
          >
            Повернуть направо
          </button>
        </div>
      ) : (
        <div>
          <button
            className={css.buttonClass}
            onClick={() => {
              setCropData(null);
              sessionStorage.removeItem('recoverPhoto');
            }}
          >
            Изменить
          </button>
          <button className={css.buttonClass} onClick={submitCropData}>
            Подтвердить
          </button>
        </div>
      )}
    </div>
  );
};

export default PictureCropper;
