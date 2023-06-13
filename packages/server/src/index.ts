import process from 'node:process';
import express from 'express';
import { v4 as uuid } from 'uuid';
import _ from 'lodash';
import { logger } from './logger';
import {
    LISTEN_HOST,
    LISTEN_PORT
} from './const';

logger.info('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ START @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@');

const app = express();

// Middleware - parse body json data
app.use(express.json());

// Middleware - log request
app.use((req, res, next) => {
    const logType = '(app.mid.log)';
    const {
        ip,
        method,
        originalUrl,
        body
    } = req;

    // Set request ID
    const requestId = uuid();
    _.set(req, 'requestId', requestId);

    logger.info(`[${requestId}] ${logType} request: ${ip} --> ${method} ${originalUrl}`);
    if (!_.isEmpty(body)) {
        logger.info(`[${requestId}] ${logType} body: ${JSON.stringify(body)}`);
    }

    next();
});

app.listen(LISTEN_PORT, LISTEN_HOST, () => {
    logger.info(`Server listen at port ${LISTEN_PORT}`);
});

process.on('SIGTERM', () => {
    logger.info('................................ GOT SIGTERM ................................');
    process.exit(0);
});
