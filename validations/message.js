const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);

exports.checkId = () => {
    return {
        params: {
            id: Joi.objectId()
        }
    }
};

exports.createMessage= () => {
    return {
        body: {
            author: Joi.objectId(),
            content: Joi.string().required(),
            group: Joi.objectId()
        }
    }
};

exports.updateMessage = () => {
    return {
        body: {
            author: Joi.objectId(),
            content: Joi.string().required(),
            group: Joi.objectId()
        },
        params: {
            id: Joi.objectId()
        }
    }
};
