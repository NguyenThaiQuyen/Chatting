const { mongoose } = require('./index.js');

const user = mongoose.Schema({
    username: {
        type: String,
        trim: true,
        required: [true, 'Username is requires field!']
    },
    email: {
        type: String,
        trim: true,  
        unique: true,
        required: [true, 'Email is required field!'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    password: {
        type: String,
        trim: true,  
        required: [true, 'Password is required field!']
    },
    resetPasswordToken: {
        type: String,
        default: undefined
    },
    resetPasswordExpires: {
        type: Date,
        default: undefined
    },
    gender: {
        type: String,
        trim: true,
        enum: ['male', 'female']
    },
    deleteAt: {
        type: Date,
        default: null
    }
}, {
    timestamps: true
});

const User = mongoose.model('User', user);

module.exports = User;