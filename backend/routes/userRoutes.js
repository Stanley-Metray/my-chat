const Router = require('express').Router;
const userController = require('../controllers/userController');

const UserRouter = Router();

UserRouter.get('/register', userController.getRegistration);

UserRouter.post('/register', userController.postRegister);

UserRouter.get('/login', userController.getLoginUser);

UserRouter.post('/login', userController.postLoginUser);

module.exports = UserRouter;