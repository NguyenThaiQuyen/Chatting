const BaseRepositories = require('./base-repositories.js');
const Group = require('../models/group.js');

module.exports = class GroupRepositories extends BaseRepositories {
    constructor() {
        super(Group);
    }
}