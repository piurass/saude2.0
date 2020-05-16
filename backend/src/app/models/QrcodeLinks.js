import Sequelize, { Model } from 'sequelize';

class QrCodeLinks extends Model {
    static init(sequelize) {
        super.init(
            {
                id_user: Sequelize.INTEGER,
                linkCrypto: Sequelize.STRING,
                isValid: Sequelize.BOOLEAN,
            },
            { sequelize, tableName: 'qrcodelinks' }
        );

        return this;
    }
}

export default QrCodeLinks;
