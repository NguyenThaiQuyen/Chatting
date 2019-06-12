const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user.js');
const { groupRepositories } = require('../repositories');

getOneGroup = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const nameGroup = req.params.name;

        const result = await groupRepositories.getOne({ name: nameGroup, deleteAt: null }).select('-_id -password -deleteAt -createdAt -updatedAt -__v');;
        if (!result) {
            return next(new Error('GROUP_NOT_FOUND'));
        };
        const isMembers = result.members.map(item => {
            return item === userId;
        });

        if (!isMembers) {
            return next(new Error('NOT_FOUND'));
        }
        return res.json({
            message: 'Information of one group',
            data: result
        });
    } catch(err) {
        return next(err);
    }
};


getAllGroups = async (req, res, next) => {
    try {
        const perPage = 5
        const  page = req.params.page || 1;
        const userId = req.user._id;

        const result = await Group
        .find({
            $and: [
                { deleteAt: null }, 
                {
                    members: { $contains : userId }
                }
            ]
        })
        .populate('user')
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .select('-_id')
        .lean();
        if (!result) {
            return next(new Error('LIST_EMPTY'));
        }
        return res.json({
            message: 'List group',
            data: result
        });
    } catch(err) {
        return next(err);
    }
}
// create group
createGroup = async (req, res, next) => {
    try {
        const authorId = req.user._id;
        const body = req.body;
        body.authorId = authorId;
        body.deleteAt = null;
        const type = body.type;
        // filter members
        body.members = body.members.filter( (item, index) => {
            return body.members.indexOf(item) >= index;
        })
        // [partnerId]
        if (type === 'individual') {
            if (body.members.length > 1) {
                return next(new Error('Individual group must be provied 1 member'));
            }
            body.members.push(authorId);
            const existIndividualGroup = await groupRepositories.getOne({
                members: {
                    $all: body.members
                },
                type: 'individual'
            });
            if (existIndividualGroup) {
                return res.json({
                    message: 'group exist!',
                    data: existIndividualGroup
                });
            }
        }
        
        const countExitsMember = await User.count({
            _id: {
                $in: body.members
            }
        });
        if (countExitsMember !== body.members.length) { 
            return next(new Error('Members hihi invalid!'));
        }
        if (!body.members.includes(authorId)) {
            body.members.push(authorId);
        };
        const newGroup = await groupRepositories.create(body);
        return res.json({
            message: 'Create new group successfully!',
            data: newGroup
        });
    } catch(err) {
        return next(err);
    }
}

// delete user
removeGroup = async (req, res, next) => {
    try {
        const groupId = req.params.id;
    
        const deletingGroupById = await Group.findOne({ _id: groupId, deleteAt: null }).lean().select('-_id -password -deleteAt -createdAt -updatedAt -__v');;
        if (!deletingGroupById) {
            return next(new Error('GROUP_NOT_FOUND'));
        };
        deletingGroupById.deleteAt = Date.now();
        return res.json({
            message: 'Delete user successfully!',
            data: deletinguserById
        });
    } catch(err) {
        return next(err);
    }
}

// update user username

updateGroup = async (req, res, next) => {
    try {
        const groupId = req.params.id;
        const body = req.body;
        
        const findingGroup = await Group.findOne({ _id: groupId, deleteAt: null }).lean();
        if (!findingGroup) {
            return next(new Error('GROUP_NOT_FOUND!'));
        };
        const updateGroup = await Group.findByIdAndUpdate(userId, body, {new: true});
        return res.json({
            message: 'Update user successfully!',
            data: updateGroup
        });
    } catch(err) {
        return next(err);
    }
}

module.exports = {
    getOneGroup: getOneGroup,
    getAllGroups: getAllGroups,
    createGroup: createGroup,
    removeGroup: removeGroup,
    updateGroup: updateGroup,
};