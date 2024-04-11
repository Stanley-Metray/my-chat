const authController = require('../controllers/authController');
const Message = require('../models/message');
// const MissedMessages = require('../models/missed-messages');

module.exports.chatSocket = async (io) => {
    io.on('connection', (socket) => {
        socket.on('groupChat', async (message) => {
            const chatId = message.chatId;
            const userId = await authController.verifyTokenForSocket(message.token);
            socket.join(`${chatId}`);
            await Message.create({ userId: userId, chatId: chatId, content: message.msg.content, sender: message.user });
            if (message.msg.type === 'file')
            {
                io.to(`${chatId}`).emit('file-message', { sender: message.user, content: {link: message.msg.link, fileName:message.msg.content, fileType:message.msg.fileType, timestamp:message.msg.timestamp}});
            }
            else
            {
                io.to(`${chatId}`).emit('message', { sender: message.user, content: message.msg });
            }
        });
    });
}


// const authController = require('../controllers/authController');
// const Message = require('../models/message');
// const MissedMessage = require('../models/missed-messages'); // Assuming you have a model for missed messages

// module.exports.chatSocket = async (io) => {
//     io.on('connection', async (socket) => {
//         const userId = await authController.verifyTokenForSocket(socket.handshake.query.token);
//         const chatId = socket.handshake.query.chatId;
//         const userChatIds = []; // Array to store chatIds of chats the user is in (populate this array with actual chatIds)

//         // Join rooms for each chat the user is in
//         userChatIds.forEach((chatId) => {
//             socket.join(chatId);
//         });

//         // Send missed messages to the user
//         if (chatId) {
//             const missedMessages = await MissedMessage.findAll({ where: { userId, chatId } });
//             missedMessages.forEach((missedMessage) => {
//                 socket.emit('message', { sender: missedMessage.sender, content: missedMessage.content });
//             });
//         }

//         socket.on('groupChat', async (message) => {
//             // Check if the user is in the chat
//             if (!userChatIds.includes(chatId)) {
//                 // User is not in the chat, store the message as a missed message
//                 await MissedMessage.create({ userId: userId, chatId: chatId, sender: message.user, content: message.msg });
//                 io.to(chatId).emit('message', { sender: message.user, content: message.msg });
//             } else {
//                 // User is in the chat, broadcast the message to other users
//                 io.to(chatId).emit('message', { sender: message.user, content: message.msg });
//             }

//             // Save the message to the database
//             await Message.create({ userId: userId, chatId: chatId, content: message.msg, sender: message.user });
//         });

//         socket.on('disconnect', async () => {
//             // When the user disconnects, delete all their missed messages
//             await MissedMessage.destroy({ where: { userId, chatId } });
//         });
//     });
// };


