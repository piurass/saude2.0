import jwt from 'jsonwebtoken';
import { promisify } from 'util';

import User from '../models/User';

import authConfig from '../../config/auth';

export default async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ error: 'Token not provided' });
    }

    const [, token] = authHeader.split(' ');

    try {
        const decoded = await promisify(jwt.verify)(token, authConfig.secret);

        req.userId = decoded.id;

        const { id } = decoded;
        const user = await User.findByPk(id);

        if (!user.isverified) {
            return res
                .status(401)
                .json({ erro: 'User not confirmed his email yet' });
        }

        return next();
    } catch (error) {
        return res.status(401).json({ error: 'Token invalid' });
    }
};
