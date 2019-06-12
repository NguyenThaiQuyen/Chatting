const UserRepositories = require('./user-repositories.js');
const GroupRepositories = require('./group-repositories.js');
const BaseRepositories = require('./base-repositories.js');
const Message = require('../models/message.js');

module.exports = {
    userRepositories: new UserRepositories(),
    groupRepositories: new GroupRepositories(),
    messageRepositories: new BaseRepositories(Message)
}