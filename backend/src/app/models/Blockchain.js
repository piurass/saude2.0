import Sequelize, { Model } from 'sequelize';

class Blockchain extends Model {
    static init(sequelize) {
        super.init(
            {
                id_user: Sequelize.INTEGER,
                id_block: Sequelize.INTEGER,
                id_type: Sequelize.STRING,
            },
            { sequelize, tableName: 'blockchain' }
        );

        return this;
    }
}

export default Blockchain;
