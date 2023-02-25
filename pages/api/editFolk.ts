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
    if (req.body.data.onlyPwd === 0) {
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
            personid,
            phone_approve,
            vuz_kod,
            activated,
        } = req.body.data;

        console.log(req.body.data);

        const pid = personid;
        const folk = {
            institute: vuz_kod,
            folkrole: role_kod,
            fname: fname,
            lname: lname,
            sname: sname,
            fio: lname + ' ' + fname + ' ' + sname,
            dateborn: moment(dateborn, 'YYYY-MM-DD').format('DD.MM.YYYY'),
            phone: phone,
            email: email,
            phone_approve: phone_approve,
            activated: activated,
        };

        let loginHeaders = new Headers();
        loginHeaders.append('Content-Type', 'application/x-www-form-urlencoded');
        loginHeaders.append(
            'Authorization',
            'Basic ' + Buffer.from(login + ':' + password, 'binary').toString('base64')
        );
        let urlencoded = new URLSearchParams();

        urlencoded.append('pid', pid);
        urlencoded.append('folk', JSON.stringify(folk));

        //Это сделано для локального хоста, вообще внутри сети или внутри одного сервера это будет лишним
        const httpsAgent = new https.Agent({
            rejectUnauthorized: false,
        });

        let requestOptions: IReqOption = {
            method: 'PUT',
            headers: loginHeaders,
            body: urlencoded,
            redirect: 'follow',
            agent: httpsAgent,
        };

        // console.log('activated: ' + folk.activated);
        console.log(requestOptions.body)
        await fetch('https://uface.su/persident/processfolk', requestOptions)
            .then((response) => response.text())
            .then((result) => {
                console.log(123)
                res.status(200).json(result);
                console.log(result);
            })
            .catch((error) => console.log('error', error));
    } else {
        const {
            login,
            password,
            personid,
            pwd
        } = req.body.data;

        console.log(req.body.data);
        const pid = personid;
        let loginHeaders = new Headers();
        loginHeaders.append('Content-Type', 'application/x-www-form-urlencoded');
        loginHeaders.append(
            'Authorization',
            'Basic ' + Buffer.from(login + ':' + password, 'binary').toString('base64')
        );
        let urlencoded = new URLSearchParams();

        urlencoded.append('pid', pid);
        urlencoded.append('folk', JSON.stringify({pwd}));
        urlencoded.append('pwd', pwd);

        //Это сделано для локального хоста, вообще внутри сети или внутри одного сервера это будет лишним
        const httpsAgent = new https.Agent({
            rejectUnauthorized: false,
        });

        let requestOptions: IReqOption = {
            method: 'PUT',
            headers: loginHeaders,
            body: urlencoded,
            redirect: 'follow',
            agent: httpsAgent,
        };

        // console.log('activated: ' + folk.activated);
        await fetch('https://uface.su/persident/processfolk', requestOptions)
            .then((response) => response.text())
            .then((result) => {
                console.log(123)
                res.status(200).json(result);
                console.log(result);
            })
            .catch((error) => console.log('error', error));
    }
}
