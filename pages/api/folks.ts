// https://uface.su/persident/getfolkslist

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import https from 'https';

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
  const { login, password, limit, offset, pid } = req.body.user;

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

  let urlencoded = new URLSearchParams();
  urlencoded.append('limit', limit);
  urlencoded.append('offset', offset);
  if (pid !== undefined) urlencoded.append('pid', pid);

  let requestOptions: IReqOption = {
    method: 'POST',
    headers: loginHeaders,
    body: urlencoded,
    redirect: 'follow',
    agent: httpsAgent,
  };

  await fetch('https://uface.su/persident/getfolkslist', requestOptions)
    .then((response) => response.text())
    .then((result) => {
      res.status(200).json(JSON.parse(result));
    })
    .catch((error) => console.log('error', error));
}
