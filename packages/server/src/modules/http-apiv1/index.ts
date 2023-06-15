import express from 'express';
import _ from 'lodash';
import { cubeTokenStore } from '../local-store/cube-token';
import { logger } from '../../logger';
import { cubeApiClient } from '../cube-api';
import {
    createErrorRes,
    ERR_PARAM_NO_CITY_NAME,
    ERR_PARAM_NO_WEATHER_API_KEY,
    ERR_SERVER_INTERNAL,
} from './error';
import SSE from '../../utils/sse';
import { weatherApiClient } from '../weather-api';

export const apiv1 = express.Router();

// SSE stream
apiv1.get('/events', async (req, res) => {
    try {
        SSE.buildStreamContext(req, res);
    } catch (err) {
        logger.error("build sse connection error: ", err);
    }
});

// Get eWeLink Cube token information
apiv1.get('/cube-token-info', async (req, res) => {
    let result = {
        error: 0,
        msg: 'Success',
        data: {
            requestTokenTime: 0,
            cubeTokenValid: false
        }
    };
    const requestId = _.get(req, 'requestId');
    const logType = 'apiv1.getCubeTokenInfo';
    const logPrefix = `[${requestId}] (${logType})`;

    try {
        const tokenData = await cubeTokenStore.getCubeToken();
        if (!tokenData || !tokenData.token) {
            return res.send(result);
        }

        if (tokenData.requestTokenTime) {
            result.data.requestTokenTime = tokenData.requestTokenTime;
        }

        const deviceListRes = await cubeApiClient.getDeviceList();
        if (deviceListRes.error === 0) {
            result.data.cubeTokenValid = true;
        }

        return res.send(result);
    } catch (err) {
        result = createErrorRes(ERR_SERVER_INTERNAL) as any;
        return res.send(result);
    } finally {
        logger.info(`${logPrefix} result: ${JSON.stringify(result)}`);
    }
});

// Get eWeLink Cube token
apiv1.get('/cube-token', async (req, res) => {
    let result = {
        error: 0,
        msg: 'Success',
        data: {}
    };
    const requestId = _.get(req, 'requestId');
    const logType = 'apiv1.getCubeToken';
    const logPrefix = `[${requestId}] (${logType})`;

    try {
        const now = Date.now();
        await cubeTokenStore.setCubeToken({ requestTokenTime: now });
        SSE.send({
            name: 'get_cube_token_start',
            data: { requestTokenTime: now }
        });
        const tokenRes = await cubeApiClient.getBridgeToken();
        SSE.send({
            name: 'get_cube_token_end',
            data: { requestTokenTime: now }
        });
        if (tokenRes.error === 0) {
            const token = _.get(tokenRes, 'data.token');
            _.set(result, 'data.token', token);
            await cubeTokenStore.setCubeToken({ token });
        } else {
            result = createErrorRes(tokenRes);
        }
        return res.send(result);
    } catch (err) {
        result = createErrorRes(ERR_SERVER_INTERNAL);
        return res.send(result);
    } finally {
        logger.info(`${logPrefix} result: ${JSON.stringify(result)}`);
    }
});

// Get city list
apiv1.get('/city-list', async (req, res) => {
    const requestId = _.get(req, 'requestId');
    const logType = 'apiv1.getCityList';
    const logPrefix = `[${requestId}] (${logType})`;

    const weatherApiKey = req.query.key as string;
    const cityName = req.query.city as string;

    let result = {
        error: 0,
        msg: 'Success',
        data: {}
    };

    try {
        if (!weatherApiKey) {
            result = createErrorRes(ERR_PARAM_NO_WEATHER_API_KEY);
            return res.send(result);
        }

        if (!cityName) {
            result = createErrorRes(ERR_PARAM_NO_CITY_NAME);
            return res.send(result);
        }

        weatherApiClient.setRequestKey(weatherApiKey);
        const cityRes = await weatherApiClient.requestJsonData('search.json', { q: cityName });
        if (cityRes.error === 0) {
            _.set(result, 'data.cityList', cityRes.data);
        } else {
            result = createErrorRes(cityRes);
        }
        return res.send(result);
    } catch (err: any) {
        result = createErrorRes(ERR_SERVER_INTERNAL);
        return res.send(result);
    } finally {
        logger.info(`${logPrefix} result :${JSON.stringify(result)}`);
    }
});
