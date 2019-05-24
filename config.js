//config.js

module.exports = {
    port: process.env.PORT,
    mongo_db: process.env.MONGO_DB,
    mongo_pwd: process.env.MONGO_PWD,
    mongo_user: process.env.MONGO_USER,
    jwt_key: process.env.JWT_KEY 
};
