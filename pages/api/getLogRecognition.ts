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
  const { login, password, limit, offset, getimg } = req.body;

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
  urlencoded.append('limit', limit);
  urlencoded.append('offset', offset);
  urlencoded.append('getimg', getimg);

  var requestOptions: IReqOption = {
    method: 'POST',
    headers: loginHeaders,
    body: urlencoded,
    redirect: 'follow',
    agent: httpsAgent,
  };

  await fetch('https://uface.su/persident/getlogrecognition', requestOptions)
    .then((response) => response.text())
    .then((result) => {
      res.status(200).json(JSON.parse(result));
      // console.log(result);
    })
    .catch((error) => console.log('error', error));
}
