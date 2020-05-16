require('dotenv').config();

module.exports = {
    dialect: 'postgres',
    host: process.env.HOST,
    username: process.env.USERNAME,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    define: {
        timestamps: true,
        underscore: true,
        underscoreAll: true,
    },
};
