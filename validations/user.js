const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);

exports.checkId = () => {
    return {
        params: {
            id: Joi.objectId()
        }
    }
};

exports.createUser = () => {
    return {
        body: {
            username: Joi.string().min(3).required(),
            email: Joi.string().min(6).required(),
            password: Joi.string().min(3).required(),
            gender: Joi.string().valid('male', 'female').required()
        }
    }
};

exports.updateUser = () => {
    return {
        body: {
            username: Joi.string().min(3),
            email: Joi.string().min(6),
            password: Joi.string().min(3),
            gender: Joi.string().valid('male', 'female'),
        },
        params: {
            id: Joi.objectId()
        }
    }
};

exports.loginUser = () => {
    return {
        body: {
            username: Joi.string().min(3),
            email: Joi.string().min(6),
            password: Joi.string().min(3),
        }
    }
};

exports.forgotUser = () => {
    return {
        body: {
            email: Joi.string().min(6)
        }
    }
}

exports.resetUser = () => {
    return {
        body: {
            newPassword: Joi.string().min(3),
            confirmPassword:  Joi.string().min(3)
        }
    }
}
