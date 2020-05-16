module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('blockchain', {
            // auto
            id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },

            // fk users
            id_user: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'users',
                    key: 'id',
                },
                onUpdate: 'cascade',
                onDelete: 'cascade',
            },

            // index na blockchain
            id_block: {
                type: Sequelize.INTEGER,
            },

            // id do tipo de busca
            id_type: {
                type: Sequelize.STRING,
            },

            // auto
            createdAt: {
                type: Sequelize.DATE,
                allowNull: false,
            },

            // auto
            updatedAt: {
                type: Sequelize.DATE,
                allowNull: false,
            },
        });
    },

    down: (queryInterface) => {
        return queryInterface.dropTable('blockchain');
    },
};
