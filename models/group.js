const { mongoose } = require('./index.js');

const group = mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    members: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }
    ],
    lastMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    type: {
        type: String,
        enum: ['individual', 'group'],
        required: true
    },
    name: {
        type: String,
    },
    deleteAt: {
        type: Date,
        default: null
    }
},{
    timestamps: true
  });

const Group = mongoose.model('Group', group);

module.exports = Group;