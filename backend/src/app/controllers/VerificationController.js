import User from '../models/User';
import VerificationToken from '../models/VerificationToken';

class VerificationController {
    async validation(req, res) {
        const userExists = await User.findOne({
            where: { email: req.query.email },
        });

        if (!userExists) {
            return res.status(400).json({ error: 'User not found.' });
        }

        if (userExists.isverified) {
            return res.status(202).json({ error: 'Email already verified' });
        }

        const userVerification = await VerificationToken.findOne({
            where: { token: req.query.token },
        });

        if (!userVerification) {
            return res.status(400).json({ error: 'Token not found.' });
        }

        const isVerified = await userExists.update({ isverified: true });

        if (!isVerified) {
            return res.status(400).json({ error: 'Error' });
        }

        return res
            .status(201)
            .json(`User with ${userExists.email} has been verified`);
    }
}

export default new VerificationController();
