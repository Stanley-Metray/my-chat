const sequelize = require('../connection/connect');
const Chat = require('../models/chat');
const GroupMembers = require('../models/group-members');
const Message = require('../models/message');
const JoinLink = require('../models/group-join-links');
const User = require('../models/user');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const message = require('../models/message');



let filePath = path.join(__dirname, '../../frontend/views/');

module.exports.postSendMessage = async (req, res) => {
    try {
        const message = await Message.create(req.body);
        res.status(201).json({ success: true, message: message });
    } catch (error) {
        if (error.errors instanceof Array)
            res.status(500).json({ message: "Internal Server Error", success: false, error: error.errors[0].message });
        else
            res.status(500).json({ message: "Internal Server Error", success: false, error: error });
        console.log(error);
    }
}

module.exports.getMessages = async (req, res) => {
    try {
        const chatId = req.params.id;
        const messages = await Message.findAll({ where: { chatId: chatId }, attributes: ["sender", "content", "createdAt"] });
        res.status(200).json({ success: true, message: messages });
    } catch (error) {
        if (error.errors instanceof Array)
            res.status(500).json({ message: "Internal Server Error", success: false, error: error.errors[0].message });
        else
            res.status(500).json({ message: "Internal Server Error", success: false, error: error });
        console.log(error);
    }
}

module.exports.postCreateChat = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const chatId = uuidv4();
        const createdChat = await Chat.create({ id: chatId, ...req.body }, { transaction: t });
        const linkId = uuidv4();
        const link = `https://my-chat-w4ur.onrender.com/group/${linkId}`;
        const createdLink = await JoinLink.create({ id: linkId, link: link, chatId: chatId }, { transaction: t });
        await GroupMembers.create({ userId: req.body.userId, chatId: chatId, user_name: req.cookies.user, isAdmin: true }, { transaction: t });
        await t.commit();
        res.status(201).json({ message: "Group created, please wait", success: true, chat: createdChat, joinLink: createdLink.link });
    } catch (error) {
        await t.rollback();
        if (error.errors instanceof Array)
            res.status(500).json({ message: "Internal Server Error", success: false, error: error.errors[0].message });
        else
            res.status(500).json({ message: "Internal Server Error", success: false, error: error });
        console.log(error);
    }
}

module.exports.getCreateGroup = (req, res) => {
    res.status(200).sendFile(filePath + '/create-group.html');
}

module.exports.joinGroup = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const linkId = req.params.linkId;
        const joinLink = await JoinLink.findOne({ where: { id: linkId } }, { transaction: t });
        if (joinLink) {
            const userId = req.body.userId;
            const chatId = joinLink.chatId;
            const isGroupMember = await GroupMembers.findOne({ where: { chatId: chatId, userId: userId } }, { transaction: t });
            if (isGroupMember) {
                return res.status(200).sendFile(filePath + '/group-joined-fail.html');
            }
            await GroupMembers.create({ userId: userId, chatId: chatId, user_name: req.cookies.user }, { transaction: t });
            await Chat.increment('total_members', { by: 1, where: { id: chatId }, transaction: t });
            await t.commit();
            res.status(200).sendFile(filePath + '/group-joined.html');
        }
        else
            res.status(404).json({ success: false, message: "Invalid link", joinLink: req.url });

    } catch (error) {
        await t.rollback();
        if (error.errors instanceof Array)
            res.status(500).json({ message: "Internal Server Error", success: false, error: error.errors[0].message });
        else
            res.status(500).json({ message: "Internal Server Error", success: false, error: error });
        console.log(error);
    }
}


module.exports.getAllChats = async (req, res) => {
    try {
        // const data = await Chat.findAll({ where: { userId: req.body.userId } });
        const data = await GroupMembers.findAll({ where: { userId: req.body.userId } });
        let chats = [];

        await Promise.all(data.map(async (chat) => {
            const c = await Chat.findOne({ where: { id: chat.chatId } });
            chats.push(c);
        }));

        let newChats = JSON.parse(JSON.stringify(chats));

        await Promise.all(newChats.map(async (chat) => {
            const chatMessages = await Message.findAll({ where: { chatId: chat.id }, attributes : ["sender", "content", "createdAt"] });
            const chatJoinLink = await JoinLink.findOne({ where: { chatId: chat.id } });
            Object.assign(chat, { messages: chatMessages, joinLink: chatJoinLink.link });
        }));

        res.status(200).json({ success: true, chats: newChats });

    } catch (error) {
        if (error.errors instanceof Array)
            res.status(500).json({ message: "Internal Server Error", success: false, error: error.errors[0].message });
        else
            res.status(500).json({ message: "Internal Server Error", success: false, error: error });
        console.log(error);
    }
}


module.exports.getChat = async (req, res) => {
    try {
        const chatId = req.params.id;
        const chat = await Chat.findOne({ where: { id: chatId } });
        // const messages = await Message.findAll({ where: { chatId: chatId } });
        const joinLink = await JoinLink.findOne({ where: { chatId: chatId } });
        const members = await GroupMembers.findAll({ where: { chatId: chatId } });
        res.status(200).json({ success: true, chat: chat, joinLink: joinLink.link, members: members });
    } catch (error) {
        if (error.errors instanceof Array)
            res.status(500).json({ message: "Internal Server Error", success: false, error: error.errors[0].message });
        else
            res.status(500).json({ message: "Internal Server Error", success: false, error: error });
        console.log(error);
    }
}


module.exports.postMakeAdmin = async (req, res) => {
    try {
        const { userId, chatId, makeAdminId } = req.body;

        const member = await GroupMembers.findOne({ where: { userId, chatId } });
        if (member.isAdmin) {
            const makeAdminMember = await GroupMembers.findOne({ where: { userId: makeAdminId, chatId } });
            makeAdminMember.isAdmin = true;
            await makeAdminMember.save();
            res.status(200).json({ success: true, message: `${makeAdminMember.user_name} is now an Admin` });
        }
        else {
            res.status(404).json({ success: false, message: "Only Group Admin Can Do This" });
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }

}

module.exports.removeMember = async (req, res) => {
    try {
        const { userId, chatId, removeMemberId } = req.body;

        const member = await GroupMembers.findOne({ where: { userId, chatId } });
        if (member.isAdmin) {
            await GroupMembers.destroy({ where: { userId: removeMemberId, chatId } });
            const chat = await Chat.findOne({ where: { id: chatId } });
            let total_members = parseInt(chat.total_members) - 1;
            chat.total_members = total_members;
            chat.save();
            res.status(200).json({ success: true, message: `Removed, please wait` });
        }
        else {
            res.status(404).json({ success: false, message: "Only Group Admin Can Do This" });
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }

}


module.exports.postAddMember = async (req, res) => {
    try {
        const { userId, chatId, phone } = req.body;
        const user = await GroupMembers.findOne({ where: { userId, chatId } });
        if (user.isAdmin) {
            const member = await User.findOne({ where: { phone: phone }, attributes: ["id", "first_name"] });
            const isMember = await GroupMembers.findOne({where : {userId : member.id, chatId:chatId}});
            
            if(isMember)
                return res.status(404).json({ success: false, message: "Already a member"});

            const createdMember = await GroupMembers.create({ chatId: chatId, userId: member.id, user_name: member.first_name });
            const chat = await Chat.findOne({ where: { id: chatId } });
            let total_members = parseInt(chat.total_members) + 1;
            chat.total_members = total_members;
            chat.save();
            res.status(200).json({ success: true, message: `Added`, member : createdMember });
        }
        else {
            res.status(404).json({ success: false, message: "Only Group Admin Can Do This" });
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

module.exports.postSearchMemberByPhone = async (req, res) => {
    try {
        const {phone} = req.body;
        const member = await User.findOne({ where: { phone: phone }, attributes: ["id", "first_name"] });
        if(member)
            res.status(200).json({success:true, member:member});
        else
            res.status(404).json({success:false, message : "User not found!"});
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

