const appRouter = require('../routes/appRoutes');
const userRouter = require('../routes/userRoutes');
const chatRouter = require('../routes/chatRoutes');
const utilRouter = require('../routes/utilRoutes');

module.exports.config = (app) => {
    app.use(appRouter);
    app.use(userRouter);
    app.use(chatRouter);
    app.use(utilRouter);
}

