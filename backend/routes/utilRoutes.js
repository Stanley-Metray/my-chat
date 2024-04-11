const Router = require('express').Router;
const s3Manager = require('../utilities/s3Manager');

const utilRouter = Router();

utilRouter.post('/generate-presigned-url', s3Manager.generatePresignedUrl);

module.exports = utilRouter;