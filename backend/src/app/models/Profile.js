import Sequelize, { Model } from 'sequelize';

class Profile extends Model {
    static init(sequelize) {
        super.init(
            {
                title: Sequelize.STRING,
            },
            {
                sequelize,
                tableName: 'profiles',
            }
        );

        return this;
    }
}

export default Profile;
