module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('verificationtokens', {
            // auto
            id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },

            userId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                onUpdate: 'cascade',
                onDelete: 'cascade',
                references: { model: 'users', key: 'id' },
            },

            token: {
                type: Sequelize.STRING,
                allowNull: false,
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
        return queryInterface.dropTable('verificationtokens');
    },
};
