const userController = require('../controllers/user.js');
const userValidation = require('../validations/user.js');
const validate = require('express-validation');
const { isAuth } = require ('../middlewares/authentication-middleware.js');

exports.load = (app) => {
	app.post('/api/v1/register', validate(userValidation.createUser()), userController.register);
	app.post('/api/v1/login', validate(userValidation.loginUser()), userController.login);
	app.post('/api/v1/forgotPassword', validate(userValidation.forgotUser()), userController.forgotPassWord);
	app.post('/api/v1/resetPassword', validate(userValidation.resetUser()), userController.resetPassword);
    app.get('/api/v1/users', [ isAuth ], userController.getAllUsers);
	app.get('/api/v1/users/:id', [ isAuth ], validate(userValidation.checkId()), userController.getOneUser); 
	app.delete('/api/v1/users', [ isAuth ], userController.removeUser);
	app.put('/api/v1/users', [ isAuth ], validate(userValidation.updateUser()), userController.updateUser); 
}