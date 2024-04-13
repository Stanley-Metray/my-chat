require('dotenv').config({path:'../.env'});
const {createServer} = require('http');
const express = require('express');
const { Server } = require('socket.io');
const socketManager = require('./utilities/socketManager');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
const sequelize = require('../backend/connection/connect');
require('../backend/configuration/db-configure').config();
const routerConfig = require('../backend/configuration/router-config');
const cronJobs = require('./utilities/cronJobs');

const app = express();
const server = createServer(app);
const io = new Server(server);

socketManager.chatSocket(io);
cronJobs.archiveDailyMessages();

app.use(cors({
    origin: ["http://localhost:3000", "https://mychat1.s3.amazonaws.com"],
    methods: ["GET", "POST", "PUT"],
    credentials: true
}));
 
app.use(express.json());
app.use(cookieParser());
app.use('/js', express.static(path.join(__dirname, '../frontend/public/js')));
app.use('/css', express.static(path.join(__dirname, '../frontend/public/css')));
app.use('/css', express.static(path.join(__dirname, '../node_modules/bootstrap/dist/css')));
app.use('/js', express.static(path.join(__dirname, '../node_modules/bootstrap/dist/js')));
app.use('/font', express.static(path.join(__dirname, '../node_modules/bootstrap-icons/font')));
routerConfig.config(app);

// io.on('connection', (socket) => {
//     socket.on('groupChat', (message) => {
//       console.log('Received groupChat message:', message);
//       socket.join(`${message.chatId}`);
//       io.to(`${message.chatId}`).emit('message', message.msg);
//     });
//   });

(async () => {
    try {
        await sequelize.sync();
        server.listen(process.env.PORT || 3500, () => {
            console.log(`Server running on port ${process.env.PORT || 3500}`);
        });
    } catch (error) {
        console.error('Error starting server:', error);
    }
})();
