import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

import User from '../models/User';
import VerificationToken from '../models/VerificationToken';

import authConfig from '../../config/auth';

const { sendVerificationEmail } = require('../../helpers/sendgrid');

class UserController {
    async store(req, res) {
        const userExists = await User.findOne({
            where: { email: req.body.email },
        });

        if (userExists) {
            return res.status(400).json({ error: 'User already exists.' });
        }

        try {
            const { id, email, firstname, password } = await User.create(
                req.body
            );

            const verification = await VerificationToken.create({
                userId: id,
                token: await bcrypt.hash(password, 12),
            });

            if (verification) {
                sendVerificationEmail(email, verification.token);
            }

            return res.json({
                user: {
                    id,
                    email,
                    firstname,
                },
                token: jwt.sign({ id }, authConfig.secret, {
                    expiresIn: authConfig.expiresIn,
                }),
            });
        } catch (error) {
            console.log('Error---->');
            console.log(error);
        }

        return res.status(400).json({
            error: 'Could not record user at the moment User already exists.',
        });
    }

    async update(req, res) {
        const { email, oldPassword } = req.body;

        const user = await User.findByPk(req.userId);

        if (email !== user.email) {
            const userExists = await User.findOne({
                where: { email },
            });

            if (userExists) {
                return res.status(400).json({ error: 'User already exists.' });
            }
        }

        if (oldPassword && !(await user.checkPassword(oldPassword))) {
            return res.status(401).json({ error: 'Password does not match' });
        }

        const { id } = await user.update(req.body);

        return res.json({
            id,
            email,
        });
    }

    async detail(req, res) {
        const { id } = req.params;
        const users = await User.findByPk(id, {
            attributes: {
                exclude: ['public_key', 'private_key', 'password_hash'],
            },
        });
        return res.json(users);
    }

    async list(req, res) {
        const users = await User.findAll({
            attributes: ['id', 'email', 'id_profile'],
        });

        return res.json(users);
    }
}

export default new UserController();
