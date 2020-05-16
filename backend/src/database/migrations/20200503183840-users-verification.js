module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.sequelize.transaction((t) => {
            return Promise.all([
                queryInterface.addColumn(
                    'users',
                    'firstname',
                    {
                        type: Sequelize.STRING,
                    },
                    { transaction: t }
                ),
                queryInterface.addColumn(
                    'users',
                    'lastname',
                    {
                        type: Sequelize.STRING,
                    },
                    { transaction: t }
                ),
                queryInterface.addColumn(
                    'users',
                    'isverified',
                    {
                        type: Sequelize.BOOLEAN,
                    },
                    { transaction: t }
                ),
            ]);
        });
    },
    down: (queryInterface) => {
        return queryInterface.sequelize.transaction((t) => {
            return Promise.all([
                queryInterface.removeColumn('users', 'firstname', {
                    transaction: t,
                }),
                queryInterface.removeColumn('users', 'lastname', {
                    transaction: t,
                }),
                queryInterface.removeColumn('users', 'isverified', {
                    transaction: t,
                }),
            ]);
        });
    },
};
