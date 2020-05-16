module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('users', {
            // auto
            id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },

            email: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true,
            },

            password_hash: {
                type: Sequelize.STRING,
                allowNull: false,
            },

            // blockchain
            private_key: {
                type: Sequelize.TEXT,
            },

            // blockchain
            public_key: {
                type: Sequelize.TEXT,
            },

            // fk profile
            id_profile: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'profiles',
                    key: 'id',
                },
                onUpdate: 'cascade',
                onDelete: 'cascade',
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
        return queryInterface.dropTable('users');
    },
};
