module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('qrcodelinks', {
            // auto
            id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },

            id_user: {
                type: Sequelize.INTEGER,
                allowNull: false,
                onUpdate: 'cascade',
                onDelete: 'cascade',
                references: { model: 'users', key: 'id' },
            },

            linkCrypto: {
                type: Sequelize.STRING,
            },

            isValid: {
                type: Sequelize.BOOLEAN,
            },

            // auto
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },

            // auto
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
        });
    },

    down: (queryInterface) => {
        return queryInterface.dropTable('qrcodelinks');
    },
};
