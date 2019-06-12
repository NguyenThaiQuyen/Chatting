const BaseRepositories = require('./base-repositories.js');
const User = require('../models/user.js');

module.exports = class UserRepositories extends BaseRepositories {
    constructor() {
        super(User);
    }
}