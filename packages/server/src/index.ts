import process from 'node:process';
import path from 'node:path';
import fs from 'node:fs';
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
import { weatherApiClient } from './modules/weather-api';
import { BUILDINFO_FILE } from './const';

logger.info('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ START @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@');

function printBuildInfo() {
    try {
        const filename = path.join(process.cwd(), BUILDINFO_FILE);
        const res = fs.readFileSync(filename);
        const contentList = res.toString().trim().split('\n');
        for (const item of contentList) {
            logger.info(item);
        }
    } catch (err: any) {
        logger.error(err.message);
        process.exit(1);
    }
}

if (process.env.ENABLE_PRINT_BUILDINFO === '1') {
    printBuildInfo();
}

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

app.use(express.static(path.join(process.cwd(), 'public')));

app.listen(LISTEN_PORT, LISTEN_HOST, async () => {
    logger.info(`Server listen at port ${LISTEN_PORT}`);

    // Init cubeApiClient
    const tokenData = await cubeTokenStore.getCubeToken();
    const tokenStr = _.get(tokenData, 'token');
    if (tokenStr) {
        cubeApiClient.setToken(tokenStr);
    }

    // Try to update weather data
    weatherApiClient.getForecastData(5);
    // Start weather schedule
    weatherApiClient.startSched();
});

process.on('SIGTERM', async () => {
    await weatherApiClient.stopSched();
    logger.info('................................ STOP ................................');
    process.exit(0);
});
