// https://uface.su/persident/copyaccstoterminals

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import https from 'https';
import { url } from 'inspector';

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
  const { login, password, personid, terminal } = req.body.data;

  // console.log(req.body.data);

  let loginHeaders = new Headers();
  loginHeaders.append('Content-Type', 'application/x-www-form-urlencoded');
  loginHeaders.append(
    'Authorization',
    'Basic ' + Buffer.from(login + ':' + password, 'binary').toString('base64')
  );
  let urlencoded = new URLSearchParams();

  console.log({ personid });

  urlencoded.append('personId', personid);
  if (terminal !== undefined) {
    urlencoded.append('terminal', terminal);
  }

  //Это сделано для локального хоста, вообще внутри сети или внутри одного сервера это будет лишним
  const httpsAgent = new https.Agent({
    rejectUnauthorized: false,
  });

  let requestOptions: IReqOption = {
    method: 'POST',
    headers: loginHeaders,
    body: urlencoded,
    redirect: 'follow',
    agent: httpsAgent,
  };

  // console.log('activated: ' + folk.activated);
  await fetch(
    'https://uface.su/persident/copyaccsfacestoterminals',
    requestOptions
  )
    .then((response) => response.text())
    .then((result) => {
      res.status(200).json(JSON.parse(result));
    })
    .catch((error) => console.log('error', error));
}
