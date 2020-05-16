import Sequelize, { Model } from 'sequelize';

class VerificationToken extends Model {
    static init(sequelize) {
        super.init(
            {
                userId: Sequelize.INTEGER,
                token: Sequelize.STRING,
            },
            { sequelize, tableName: 'verificationtokens' }
        );

        return this;
    }
}

export default VerificationToken;
