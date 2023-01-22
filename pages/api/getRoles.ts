// https://uface.su/persident/getfolkroles

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import https from 'https';

type IReqOption = {
  method: string | undefined;
  redirect: RequestRedirect | undefined;
  body: any;
  agent: any;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  //Это сделано для локального хоста, вообще внутри сети или внутри одного сервера это будет лишним
  const httpsAgent = new https.Agent({
    rejectUnauthorized: false,
  });

  // @ts-ignore
  let requestOptions: IReqOption = {
    method: 'GET',
    redirect: 'follow',
    agent: httpsAgent,
  };

  await fetch('https://uface.su/persident/getfolkroles', requestOptions)
    .then((response) => response.text())
    .then((result) => {
      res.status(200).json(JSON.parse(result));
    })
    .catch((error) => console.log('error', error));
}
