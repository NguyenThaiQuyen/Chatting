const messageController = require('../controllers/message.js');
const messageValidation = require('../validations/message.js');
const validate = require('express-validation');
const { isAuth } = require ('../middlewares/authentication-middleware.js');

exports.load = (app) => {
    app.get('/api/v1/messages', [isAuth],  messageController.getAllMessages);
    app.get('/api/v1/messages',  [isAuth], messageController.getOneMessage); 
    app.put('/api/v1/messages',  [isAuth], validate(messageValidation.updateMessage()), messageController.updateMessage); 
	app.post('/api/v1/messages',  [isAuth], validate(messageValidation.createMessage()), messageController.createMessage);
	app.delete('/api/v1/messages',  [isAuth], messageController.removeMessage);
}