import Profile from '../models/Profile';

class ProfileController {
    async store(req, res) {
        const { id, title } = await Profile.create(req.body);

        return res.json({
            id,
            title,
        });
    }

    async list(req, res) {
        const profile = await Profile.findAll();

        return res.json(profile);
    }
}

export default new ProfileController();
