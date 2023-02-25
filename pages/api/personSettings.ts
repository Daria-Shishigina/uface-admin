// https://uface.su/persident/getfolkimages

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest, NextApiResponse} from 'next';
import https from 'https';
import moment from 'moment';
import {url} from 'inspector';

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
            cardAndPasswordPermission,
            faceAndCardPermission,
            faceAndPasswordPermission,
            facePermission,
            iDNumber,
            role,
            type,
            idCardPermission,
            idcardNum,
            Upassword,
            passwordPermission,
            tag,
            personid,
            terminal,
            password,
            login
        } = req.body.data;

        console.log(req.body.data);

        const settings = {
            cardAndPasswordPermission,
            faceAndCardPermission,
            faceAndPasswordPermission,
            facePermission,
            iDNumber,
            role,
            type,
            idCardPermission,
            idcardNum,
            password: Upassword,
            passwordPermission,
            tag
        };

        let loginHeaders = new Headers();
        loginHeaders.append('Content-Type', 'application/x-www-form-urlencoded');
        loginHeaders.append(
            'Authorization',
            'Basic ' + Buffer.from(login + ':' + password, 'binary').toString('base64')
        );
        let urlencoded = new URLSearchParams();

        urlencoded.append('personid', personid);
        urlencoded.append('settings', JSON.stringify(settings));
        urlencoded.append('terminal', terminal);

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

        await fetch('https://uface.su/persident/personsettings', requestOptions)
            .then((response) => response.text())
            .then((result) => {
                res.status(200).json(result);
                console.log(result);
            })
            .catch((error) => console.log('error', error));
}
