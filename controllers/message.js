const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user.js');
const Group = require('../models/group.js');
const { sign } = require('../helpers/jwt-helper.js');
const { messageRepositories } = require('../repositories');

getOneMessage= async (req, res, next) => {
    try {
        const messageId = req.params.id;

        const result = await Group.findOne({ _id: messageId, deleteAt: null }).lean().select('-_id -password -deleteAt -createdAt -updatedAt -__v');;
        if (!result) {
            return next(new Error('MESSAGE_NOT_FOUND'));
        };
        return res.json({
            message: 'Message ',
            data: result
        });
    } catch(err) {
        return next(err);
    }
};


getAllMessages = async (req, res, next) => {
    try {
        const result = await Message
        .find({ deleteAt: null })
        .populate('user')
        .populate('group')
        .select('-_id')
        .lean();

        if (!result) {
            return next(new Error('LIST_EMPTY'));
        }
        return res.json({
            message: 'List message',
            data: result
        });
    } catch(err) {
        return next(err);
    }
}

createMessage = async (req, res, next) => {
    try {
        const authorId = req.user._id;
        const body = req.body;
        body.author = authorId;
        body.deleteAt = Date.now();
        const newMessage = await messageRepositories.create(body);
        return res.json({
            message: 'Create new message successfully!',
            data: newMessage
        });
    } catch(err) {
        return next(err);
    }
}

// delete user
removeMessage= async (req, res, next) => {
    try {
        const messageId = req.params.id;
    
        const deletingMessageById = await Message.findOne({ _id: messageId, deleteAt: null }).lean().select('-_id -password -deleteAt -createdAt -updatedAt -__v');;
        if (!deletingMessageById) {
            return next(new Error('GROUP_NOT_FOUND'));
        };
        deletingMessageById.deleteAt = Date.now();
        return res.json({
            message: 'Delete message successfully!',
            data: deletingMessageById
        });
    } catch(err) {
        return next(err);
    }
}


updateMessage = async (req, res, next) => {
    try {
        const messageId = req.params.id;
        const body = req.body;
        
        const findingMessage = await Message.findOne({ _id: messageId, deleteAt: null }).lean();
        if (!findingMessage) {
            return next(new Error('GROUP_NOT_FOUND!'));
        };
        const updateMessage = await Message.findByIdAndUpdate(messageId, body, {new: true});
        return res.json({
            message: 'Update message successfully!',
            data: updateMessage
        });
    } catch(err) {
        return next(err);
    }
}

module.exports = {
    getOneMessage: getOneMessage,
    getAllMessages: getAllMessages,
    createMessage: createMessage,
    removeMessage: removeMessage,
    updateMessage: updateMessage,
};