/* eslint-disable no-console */
import axios from 'axios';
import NodeRSA from 'node-rsa';

import Blockchain from '../models/Blockchain';
import User from '../models/User';

import ChainApi from '../../services/ChainApi';

class PatientController {
    async store(req, res) {
        const { userId } = req;
        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({ error: 'User ID not found' });
        }

        const key = new NodeRSA(user.private_key);
        key.setOptions({ environment: 'browser' });
        key.importKey(user.public_key);

        const encrypted = key.encrypt(req.body, 'base64');

        const json = {
            user: userId,
            // public_key: user.public_key,
            // data: req.body,
            data: encrypted,
        };

        const { baseUrl } = ChainApi.init();

        try {
            const { data } = await axios.post(
                `${baseUrl}/add_transaction`,
                json
            );

            try {
                await Blockchain.create({
                    id_user: userId,
                    id_block: data.index,
                    id_type: 'patients',
                });
            } catch (error) {
                console.log('Err Blockchain---->');
                console.log(error);
            }

            return res
                .status(201)
                .json({ user: userId, index: data.index, type: 'patients' });
        } catch (error) {
            console.log('Err add_transaction---->');
            console.log(error);
        }

        return res.status(400).json({ error: 'Error add_transaction' });
    }

    async listId(req, res) {
        const { userId } = req;
        const id_type = 'patients';

        const { private_key, public_key } = await User.findOne({
            where: { userId },
        });

        const blockchain = await Blockchain.findOne({
            where: { id_user: userId, id_type },
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

export default new PatientController();
