const bcrypt = require('bcrypt');
const { sign } = require('../helpers/jwt-helper.js');
const { userRepositories } = require('../repositories');

exports.register = async (req, res, next) => {
    try {
        const body = req.body;
        const user = await userRepositories.getOne({
            $and: [
                    { username: body.username},
                    { deleteAt: null }
            ]
        });
        if (user) {
            return next(new Error('USERNAME_EXISTED!'));
        }
        body.deleteAt = null;
        const salt = bcrypt.genSaltSync(2);
        const hashPassword = bcrypt.hashSync(body.password, salt);
        body.password = hashPassword;
        const newUser = await userRepositories.create(body);
        return res.json({
            message: 'Create new user successfully!',
            data: newUser
        });
    } catch(err) {
        return next(err);
    }
}

exports.login = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const user = await userRepositories.getOne({
            $and: [
                    { username },
                    { deleteAt: null }
            ]
        });
        if (!user) {
            return next(new Error('ACCOUNT_NOT_REGISTER!'));
        }
        const isValidPassword = bcrypt.compareSync(password, user.password);
        if (!isValidPassword) {
            return next(new Error('Password is incorrect!'));
        }
        const token = sign({ _id: user._id });
        return res.json({
            message: 'Login successfully',
            data: user,
            access_token: token
        });
    } catch(err) {
        return next(err);
    }
}

// need check 
exports.forgotPassWord = async (req, res, next) => {
    try {
        const email = req.body.email;
        
        const user = await userRepositories.getOne({
            $and: [
                    { email },
                    { deleteAt: null }
            ]
        });
        if (!user) {
            return next(new Error('NOT_ACCOUNT_WITH_THIS_EMAIL'));
        };

        const tokenReset =  crypto.randomBytes(20).toString('hex');
        
        user.resetPasswordToken = tokenReset;
        user.resetPasswordExpires = Date.now() + 900000;
        const saveUser = await user.save();

        const data = {
            to: user.email,
            from: email,
            template: 'forgot-password-email',
            subject: 'Password help has arrived!',
            context: {
              url: 'http://localhost:3000/apis/v1/resetPassword?tokenReset=' + tokenReset,
              name: user.username.split(' ')[0]
            }
        };
        const smtpTrans = nodemailer.createTransport({
            service: 'Gmail'
         });
        const result = await smtpTrans.sendMail(data);
        return res.json({
            message: 'Check your email for further instructions',
            data: result
        });
    } catch(err) {
        return next(err);
    }
};

// need check
exports.resetPassword = async (req, res, next) => {
    try {
        const tokenReset = req.query.tokenReset;
        const newPassword = req.body.newPassword;
        const confirmPassword = req.body.confirmPassword;
        const salt = bcrypt.genSaltSync(2);

        const user = await this.getOne({
                $and: [
                    { resetPasswordToken: tokenReset },
                    {
                        resetPasswordExpires: {
                            $gt: Date.now()
                        }
                    }
                ]
            });

        if (!user) {
            return next(new Error('NOT_ACCOUNT_RESET_PASSWORD'));
        };
        if (newPassword === confirmPassword) {
            let hashPassword = bcrypt.hashSync(newPassword, salt);
            user.password = hashPassword;
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;
        }
        const saveUser = await user.save();
        const data = {
            to: user.email,
            from: user.email,
            template: 'reset-password-email',
            subject: 'Password Reset Confirmation',
            context: {
              name: user.username.split(' ')[0]
            }
        };

        const smtpTrans = nodemailer.createTransport({
            service: 'Gmail'
        });
        const result = await smtpTrans.sendMail(data);
        return res.json({
            message: 'Password reset',
            data: result
        });
    } catch(err) {
        return next(err);
    }
};

exports.getOneUser = async (req, res, next) => {
    try {
        const userId= req.params.id;
        const user = await userRepositories.getOne({
            $and: [
                { _id: userId },
                { deleteAt: null }
        ]})
        .select('-_id -password -deleteAt -createdAt -updatedAt -__v');;
        if (!user) {
            return next(new Error('USER_NOT_FOUND!'));
        };
        return res.json({
            message: 'User need find',
            data: user
        });
    } catch(err) {
        return next(err);
    }
}

exports.getAllUsers = async (req, res, next) => {
    try {
        const result = await userRepositories.getAll({ deleteAt: null }).lean().select('-_id -password -deleteAt -createdAt -updatedAt -__v');

        if (!result) {
            return next(new Error('USER_NOT_FOUND!'));
        }
        return res.json({
            message: 'List user',
            data: result
        });
    } catch(err) {
        return next(err);
    }
}

exports.removeUser = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const existedUser = await userRepositories.getOne({
            $and: [
                { _id: userId },
                { deleteAt: null }
        ]});
        if (!existedUser) {
            return next(new Error('USER_NOT_FOUND!'));
        };       
        const changeUser = await userRepositories.update(userId, { deleteAt: Date.now()});
        return res.json({
            message: 'Delete user successfully!',
            data: changeUser
        });
    } catch(err) {
        return next(err);
    }
}

exports.updateUser = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const body = req.body;

        const existedUser = await userRepositories.getOne({
            $and: [
                { _id: userId },
                { deleteAt: null }
        ]});
        if (!existedUser) {
            return next(new Error('USER_NOT_FOUND!'));
        };
        const updateUser = await userRepositories.update(userId, body);
        return res.json({
            message: 'Update user successfully!',
            data: updateUser
        });
    } catch(err) {
        return next(err);
    }
}