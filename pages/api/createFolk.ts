// https://uface.su/persident/getfolkimages

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import https from 'https';
import moment from 'moment';

type IReqOption = {
  method: string | undefined;
  redirect: RequestRedirect | undefined;
  headers: any;
  body: any;
  agent: any;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    login,
    password,
    fname,
    lname,
    sname,
    phone,
    email,
    dateborn,
    role_kod,
    vuz_kod,
    photo,
  } = req.body.data;

  console.log(req.body.data);

  //Headers
  let loginHeaders = new Headers();
  loginHeaders.append('Content-Type', 'application/x-www-form-urlencoded');
  loginHeaders.append(
    'Authorization',
    'Basic ' + Buffer.from(login + ':' + password, 'binary').toString('base64')
  );

  //Это сделано для локального хоста, вообще внутри сети или внутри одного сервера это будет лишним
  const httpsAgent = new https.Agent({
    rejectUnauthorized: false,
  });

  //Body
  var urlencoded = new URLSearchParams();
  urlencoded.append('fio', 'Дав Ал Лео');
  urlencoded.append('lname', lname);
  urlencoded.append('fname', fname);
  urlencoded.append('sname', sname);
  urlencoded.append('pwd', password);
  urlencoded.append('phone', phone);
  urlencoded.append('email', email);
  urlencoded.append(
    'dateborn',
    moment(dateborn, 'YYYY-MM-DD').format('DD.MM.YYYY')
  );
  urlencoded.append('folkrole', role_kod);
  urlencoded.append('institute', vuz_kod);
  urlencoded.append('img64', photo);

  var requestOptions: IReqOption = {
    method: 'POST',
    headers: loginHeaders,
    body: urlencoded,
    redirect: 'follow',
    agent: httpsAgent,
  };

  //   let urlencoded = new URLSearchParams();

  //   urlencoded.append('pid', pid);
  //   urlencoded.append('folk', JSON.stringify(folk));

  // let requestOptions: IReqOption = {
  //   method: 'PUT',
  //   headers: loginHeaders,
  //   body: urlencoded,
  //   redirect: 'follow',
  //   agent: httpsAgent,
  // };

  // console.log('activated: ' + folk.activated);
  await fetch('https://uface.su/persident/processfolk', requestOptions)
    .then((response) => response.text())
    .then((result) => {
      res.status(200).json(result);
      console.log(result);
    })
    .catch((error) => console.log('error', error));
}
