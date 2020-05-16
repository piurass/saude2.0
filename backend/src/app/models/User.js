import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcryptjs';
import NodeRSA from 'node-rsa';

class User extends Model {
    static init(sequelize) {
        super.init(
            {
                email: Sequelize.STRING,
                password: Sequelize.VIRTUAL,
                password_hash: Sequelize.STRING,
                private_key: Sequelize.TEXT,
                public_key: Sequelize.TEXT,
                id_profile: Sequelize.INTEGER,
                firstname: Sequelize.STRING,
                lastname: Sequelize.STRING,
                isverified: Sequelize.BOOLEAN,
            },
            {
                sequelize,
                tableName: 'users',
            }
        );

        this.addHook('beforeSave', async (user) => {
            if (user.password) {
                user.password_hash = await bcrypt.hash(user.password, 8);

                const key = new NodeRSA({ b: 512 });
                key.setOptions({ environment: 'browser' });
                key.generateKeyPair();

                user.private_key = key.exportKey('private');
                user.public_key = key.exportKey('public');
            }
        });

        return this;
    }

    checkPassword(password) {
        return bcrypt.compare(password, this.password_hash);
    }
}

export default User;
