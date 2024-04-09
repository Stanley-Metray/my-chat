const Router = require('express').Router;
const userController = require('../controllers/userController');

const userRouter = Router();

userRouter.get('/register', userController.getRegistration);

userRouter.post('/register', userController.postRegister);

userRouter.get('/login', userController.getLoginUser);

userRouter.post('/login', userController.postLoginUser);

module.exports = userRouter;