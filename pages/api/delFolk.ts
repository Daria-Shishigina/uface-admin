// https://uface.su/persident/processfolk?pid=fdf19da5b89242688f01a077f1d26373

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
  const { login, password, pid } = req.body.data;

  let loginHeaders = new Headers();
  loginHeaders.append('Content-Length', '10000');
  loginHeaders.append('Content-Type', 'application/x-www-form-urlencoded');
  loginHeaders.append(
    'Authorization',
    'Basic ' + Buffer.from(login + ':' + password, 'binary').toString('base64')
  );

  //Это сделано для локального хоста, вообще внутри сети или внутри одного сервера это будет лишним
  const httpsAgent = new https.Agent({
    rejectUnauthorized: false,
  });

  let requestOptions: IReqOption = {
    method: 'DELETE',
    headers: loginHeaders,
    body: '',
    redirect: 'follow',
    agent: httpsAgent,
  };

  console.log(requestOptions)

  await fetch(
    `https://uface.su/persident/processfolk?pid=${pid}`,
    requestOptions
  )
    .then((response) => response.text())
    .then((result) => {
      res.status(200).json(result);
      console.log(result);
    })
    .catch((error) => console.log('error', error));
}
