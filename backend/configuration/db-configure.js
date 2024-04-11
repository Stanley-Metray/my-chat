const User = require('../models/user');
const Message = require('../models/message');
const Chat = require('../models/chat');
const JoinLink = require('../models/group-join-links');

module.exports.config = () => {
    User.hasMany(Chat, {onDelete : 'CASCADE'});
    Chat.belongsTo(User);

    Chat.hasMany(Message, {onDelete : 'CASCADE'});
    Message.belongsTo(Chat);

    Chat.hasOne(JoinLink, {onDelete : 'CASCADE'});
    JoinLink.belongsTo(Chat);

    User.hasMany(Message, {onDelete:'CASCADE'});
    Message.belongsTo(User);
}

