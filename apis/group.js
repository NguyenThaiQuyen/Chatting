const groupController = require('../controllers/group');
const groupValidation = require('../validations/group');
const validate = require('express-validation');
const { isAuth } = require ('../middlewares/authentication-middleware.js');

exports.load = (app) => {
	app.post('/api/v1/groups', [ isAuth ], validate(groupValidation.createGroup()), groupController.createGroup);
    app.get('/api/v1/groups/:name', [ isAuth ], groupController.getAllGroups);
	app.get('/api/v1/groups', [ isAuth ], groupController.getOneGroup); 
	app.delete('/api/v1/groups', [ isAuth ], groupController.removeGroup);
	app.put('/api/v1/groups', [ isAuth ], validate(groupValidation.updateGroup()), groupController.updateGroup); 
}