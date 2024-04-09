require('dotenv').config({path:'../.env'});
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const sequelize = require('../backend/connection/connect');
require('../backend/configuration/db-configure').config();
const routerConfig = require('../backend/configuration/router-config');

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use('/js', express.static(path.join(__dirname, '../frontend/public/js')));
app.use('/css', express.static(path.join(__dirname, '../frontend/public/css')));
app.use('/css', express.static(path.join(__dirname, '../node_modules/bootstrap/dist/css')));
app.use('/js', express.static(path.join(__dirname, '../node_modules/bootstrap/dist/js')));
app.use('/font', express.static(path.join(__dirname, '../node_modules/bootstrap-icons/font')));
routerConfig.config(app);

(async () => {
    try {
        await sequelize.sync();
        app.listen(3500);
    } catch (error) {
        console.log(error);
    }
})();