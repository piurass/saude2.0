module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('profiles', {
            // auto
            id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },

            title: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true,
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
        return queryInterface.dropTable('profiles');
    },
};
