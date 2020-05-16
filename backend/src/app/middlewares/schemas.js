import Joi from 'joi';

// accepts name only as letters
const name = Joi.string().regex(/[A-Z]/);
const email = Joi.string().email();
const password = Joi.string();

const createUser = Joi.object().keys({
    name: name.required(),
    email: email.required(),
    password: password.required().min(6),
});

module.exports = {
    '/users': createUser,
};
