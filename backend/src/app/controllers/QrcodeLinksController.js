import axios from 'axios';
import NodeRSA from 'node-rsa';
import qr from 'qr-image';
import bcrypt from 'bcryptjs';

import QrCodeLinks from '../models/QrcodeLinks';
import User from '../models/User';
import Blockchain from '../models/Blockchain';

import ChainApi from '../../services/ChainApi';

class QrCodeLinksController {
    async qrcode(req, res) {
        const { userId } = req;
        const { protocol, host } = req;
        const key = `${userId}healthchain`;

        const urlCryto = await bcrypt.hash(key, 12);

        const qrcodelinks = await QrCodeLinks.create({
            id_user: userId,
            linkCrypto: urlCryto,
            isValid: true,
        });

        if (!qrcodelinks) {
            return res
                .status(400)
                .json({ error: 'Qrcode write error, try again' });
        }

        const urlValid = `${protocol}://${host}/qrcodevalid?token=${urlCryto}`;

        const code = qr.image(urlValid, {
            type: 'svg',
        });

        res.type('svg');
        return code.pipe(res);
    }

    async qrcodeId(req, res) {
        const { token } = req.query;
        const id_type = 'patients';

        const qrcodelinks = await QrCodeLinks.findOne({
            where: { linkCrypto: token, isValid: true },
        });

        if (!qrcodelinks) {
            return res.status(400).json({ error: 'Token not found' });
        }

        await qrcodelinks.update({ isValid: false });

        const { private_key, public_key } = await User.findByPk(
            qrcodelinks.id_user
        );

        const blockchain = await Blockchain.findOne({
            where: { id_user: qrcodelinks.id_user, id_type },
            attributes: ['id_block'],
        });

        if (!blockchain) {
            return res.status(400).json({ error: 'Id block not found' });
        }

        const { baseUrl } = ChainApi.init();

        try {
            const { data } = await axios.get(
                `${baseUrl}/get_block/${blockchain.id_block}`
            );

            if (data) {
                const objArr = data.block.transactions;
                const key = new NodeRSA(private_key);
                // const key = new NodeRSA(private_key, 'pkcs1-private-pem');
                // const key = new NodeRSA({ b: 512 });
                key.setOptions({ environment: 'browser' });
                key.importKey(public_key);
                // key.importKey(private_key);

                // const a = key.sign(objArr[0].data);
                // console.log(key.verify(objArr[0].data, a, '', 'base64'));

                const decrypted = key.decrypt(objArr[0].data, 'json');
                return res.status(200).json(decrypted);
            }
        } catch (error) {
            console.log('Err get_block');
            console.log(error);
        }

        return res.status(200).json({ status: 'Blockchain not found' });
    }
}

export default new QrCodeLinksController();
