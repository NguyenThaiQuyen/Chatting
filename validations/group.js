const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);

exports.checkId = () => {
    return {
        params: {
            id: Joi.objectId()
        }
    }
};

exports.createGroup= () => {
    return {
        body: {
            author: Joi.objectId(),
            members: Joi.array().items(Joi.string().required()),
            lastMessage: Joi.objectId(),
            type: Joi.string().valid('individual', 'group').required(),
            name: Joi.string()
        }
    }
};

exports.updateGroup = () => {
    return {
        body: {
            author: Joi.objectId(),
            members: Joi.array().items(Joi.string().required()),
            lastMessage: Joi.objectId(),
            type: Joi.string().valid('individual', 'group').required(),
            name: Joi.string()
        },
        params: {
            id: Joi.objectId()
        }
    }
};
