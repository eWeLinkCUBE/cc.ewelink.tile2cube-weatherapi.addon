import process from 'node:process';
import express from 'express';
import { v4 as uuid } from 'uuid';
import _ from 'lodash';
import { logger } from './logger';
import {
    LISTEN_HOST,
    LISTEN_PORT
} from './const';
import { apiv1 } from './modules/http-apiv1';
import { cubeTokenStore } from './modules/local-store/cube-token';
import { cubeApiClient } from './modules/cube-api';

logger.info('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ START @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@');

const app = express();

// Middleware - parse body json data
app.use(express.json());

// Middleware - log request
app.use((req, res, next) => {
    const {
        ip,
        method,
        originalUrl,
        body
    } = req;
    const logType = 'app.mid.log';
    const requestId = uuid();
    _.set(req, 'requestId', requestId);
    const logPrefix = `[${requestId}] (${logType})`

    logger.info(`${logPrefix} request: ${ip} --> ${method} ${originalUrl}`);
    if (!_.isEmpty(body)) {
        logger.info(`${logPrefix} body: ${JSON.stringify(body)}`);
    }

    next();
});

app.use('/api/v1', apiv1);

app.listen(LISTEN_PORT, LISTEN_HOST, async () => {
    logger.info(`Server listen at port ${LISTEN_PORT}`);

    // Init cubeApiClient
    const tokenData = await cubeTokenStore.getCubeToken();
    const tokenStr = _.get(tokenData, 'token');
    if (tokenStr) {
        cubeApiClient.setToken(tokenStr);
    }
});

process.on('SIGTERM', () => {
    logger.info('................................ GOT SIGTERM ................................');
    process.exit(0);
});
