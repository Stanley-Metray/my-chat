const Router = require('express').Router;
const appController = require('../controllers/appController');
const authController = require('../controllers/authController');

const appRouter = Router();

appRouter.get('/', authController.verifyToken ,appController.getHomePage);

appRouter.get('/error', appController.getErrorPage);

module.exports = appRouter;