const Router = require('express').Router;
const chatController = require('../controllers/chatController');
const authController = require('../controllers/authController');

const chatRouter = Router();

chatRouter.post('/create-chat', authController.verifyToken, chatController.postCreateChat);

chatRouter.post('/send-message', authController.verifyToken, chatController.postSendMessage);

chatRouter.get('/get-messages/:id', authController.verifyToken, chatController.getMessages);

chatRouter.get('/create-group', authController.verifyToken, chatController.getCreateGroup);

chatRouter.get('/group/:linkId', authController.verifyToken ,chatController.joinGroup);

chatRouter.get('/get-chats', authController.verifyToken, chatController.getAllChats);

chatRouter.get('/get-chat/:id', authController.verifyToken, chatController.getChat);

chatRouter.post('/make-admin', authController.verifyToken, chatController.postMakeAdmin);

chatRouter.post('/remove-member', authController.verifyToken, chatController.removeMember);

chatRouter.post('/add-member', authController.verifyToken, chatController.postAddMember);

chatRouter.post('/search-member-by-phone', authController.verifyToken, chatController.postSearchMemberByPhone);


module.exports = chatRouter;