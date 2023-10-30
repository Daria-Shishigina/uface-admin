// https://uface.su/persident/getfolkimages

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest, NextApiResponse} from 'next';
import https from 'https';

type IReqOption = {
    method: string | undefined;
    redirect: RequestRedirect | undefined;
    headers: any;
    agent: any;
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const {
        password,
        personid,
        terminal,
        login
    } = req.body.data;

    let loginHeaders = new Headers();
    loginHeaders.append('Content-Type', 'application/x-www-form-urlencoded');
    loginHeaders.append(
        'Authorization',
        'Basic ' + Buffer.from(login + ':' + password, 'binary').toString('base64')
    );

    const httpsAgent = new https.Agent({
        rejectUnauthorized: false,
    });

    let requestOptions: IReqOption = {
        method: 'GET',
        headers: loginHeaders,
        redirect: 'follow',
        agent: httpsAgent,
    };
    // console.log(`https://uface.su/persident/personsettings?personid=${personid}&terminal=${terminal}`)
    await fetch(`https://uface.su/persident/personsettings?personid=${personid}&terminal=${terminal}`, requestOptions)
        .then((response) => response.text())
        .then((result) => {
            res.status(200).json(result);
        })
        .catch((error) => console.log('error', error));
}
