import process from 'node:process';
import express from 'express';
import _ from 'lodash';
import { cubeTokenStore } from '../local-store/cube-token';
import { userConfigStore } from '../local-store/user-config';
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
import { weatherDataStore } from '../local-store/weather-data';
import { LISTEN_PORT } from '../../const';

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
        if (!tokenData) {
            return res.send(result);
        }

        if (tokenData.requestTokenTime) {
            result.data.requestTokenTime = tokenData.requestTokenTime;
        }

        if (tokenData.token) {
            const deviceListRes = await cubeApiClient.getDeviceList();
            if (deviceListRes.error === 0) {
                result.data.cubeTokenValid = true;
            }
        }

        return res.send(result);
    } catch (err: any) {
        logger.error(`${logPrefix} error: ${err.message}`);
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
        const tokenRes = await cubeApiClient.getBridgeToken({ appName: process.env.APP_NAME });
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
    } catch (err: any) {
        logger.error(`${logPrefix} error: ${err.message}`);
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
        logger.error(`${logPrefix} error: ${err.message}`);
        result = createErrorRes(ERR_SERVER_INTERNAL);
        return res.send(result);
    } finally {
        logger.info(`${logPrefix} result: ${JSON.stringify(result)}`);
    }
});

// Get user config
apiv1.get('/config', async (req, res) => {
    const requestId = _.get(req, 'requestId');
    const logType = 'apiv1.getUserConfig';
    const logPrefix = `[${requestId}] (${logType})`;

    let result = {
        error: 0,
        msg: 'Success',
        data: {
            weatherApiKey: '',
            cityData: null,
            tempUnit: ''
        }
    };

    try {
        const userConfig = await userConfigStore.getUserConfigData();
        logger.info(`${logPrefix} userConfig: ${JSON.stringify(userConfig)}`);
        if (userConfig) {
            if (userConfig.weatherApiKey) {
                result.data.weatherApiKey = userConfig.weatherApiKey;
            }
            if (userConfig.cityData) {
                result.data.cityData = userConfig.cityData as any;
            }
            if (userConfig.tempUnit) {
                result.data.tempUnit = userConfig.tempUnit;
            }
        }
        return res.send(result);
    } catch (err: any) {
        logger.error(`${logPrefix} error: ${err.message}`);
        result = createErrorRes(ERR_SERVER_INTERNAL) as any;
        return res.send(result);
    } finally {
        logger.info(`${logPrefix} result: ${JSON.stringify(result)}`);
    }
});

// Save user config
apiv1.post('/config', async (req, res) => {
    const requestId = _.get(req, 'requestId');
    const logType = 'apiv1.saveUserConfig';
    const logPrefix = `[${requestId}] (${logType})`;

    let result = {
        error: 0,
        msg: 'Success',
        data: {}
    };

    try {
        // TODO: check params
        const weatherApiKey = _.get(req, 'body.weatherApiKey');
        const cityData = _.get(req, 'body.cityData');
        const tempUnit = _.get(req, 'body.tempUnit');

        const saveData = {};
        if (weatherApiKey) {
            _.set(saveData, 'weatherApiKey', weatherApiKey);
        }
        if (cityData) {
            _.set(saveData, 'cityData', cityData);
        }
        if (tempUnit) {
            _.set(saveData, 'tempUnit', tempUnit);
        }

        if (!_.isEmpty(saveData)) {
            await userConfigStore.setUserConfigData(saveData);
        }

        // Get iHost UI card list
        const cardListRes = await cubeApiClient.getUiCardList();
        if (cardListRes.error !== 0) {
            result = createErrorRes(cardListRes);
            return res.send(result);
        }
        const cardList = cardListRes.data;

        // Check pre-save UI card ID
        let shouldCreateWeatherUiCard = true;
        const userConfigData = await userConfigStore.getUserConfigData();
        if (userConfigData && userConfigData.weatherCardIdList && userConfigData.weatherCardIdList.length !== 0) {
            for (const id of userConfigData.weatherCardIdList) {
                const found = _.find(cardList, { id });
                if (found) {
                    shouldCreateWeatherUiCard = false;
                    break;
                }
            }
        }

        if (shouldCreateWeatherUiCard) {
            const HOST = `ihost.local:${LISTEN_PORT}`;
            const addRes = await cubeApiClient.addUiCardList({
                label: 'Weather Card',
                web_settings: {
                    default: '2×1',
                    dimensions: [
                        {
                            size: '2×1',
                            src: `http://${HOST}/#/card`
                        }
                    ],
                    drawer_component: {
                        src: `http://${HOST}/#/card`
                    }
                },
                cast_settings: {
                    default: '1×1',
                    dimensions: [
                        {
                            size: '1×1',
                            src: `http://${HOST}/#/card`
                        }
                    ]
                }
            });
            if (addRes.error === 0) {
                await userConfigStore.setUserConfigData({ weatherCardIdList: [ addRes.data.id ] });
            }
        }

        return res.send(result);
    } catch (err: any) {
        logger.error(`${logPrefix} error: ${err.message}`);
        result = createErrorRes(ERR_SERVER_INTERNAL) as any;
        return res.send(result);
    } finally {
        logger.info(`${logPrefix} result: ${JSON.stringify(result)}`);
    }
});

// Get weather forecast data
apiv1.get('/forecast', async (req, res) => {
    const requestId = _.get(req, 'requestId');
    const logType = 'apiv1.getForecastData';
    const logPrefix = `[${requestId}] (${logType})`;

    let result = {
        error: 0,
        msg: 'Success',
        data: {}
    };

    try {
        const days = req.query.days;
        const refresh = req.query.refresh || '0';

        if (refresh === '1') {
            // Refresh cache data
            const forecastDays = days ? _.toInteger(days) : 5;
            const forecastRes = await weatherApiClient.getForecastData(forecastDays);
            if (forecastRes.error !== 0) {
                result = createErrorRes(forecastRes);
                return res.send(result);
            }
        }

        const weatherData = await weatherDataStore.getWeatherData();
        _.set(result, 'data', weatherData);
        return res.send(result);
    } catch (err: any) {
        logger.error(`${logPrefix} error: ${err.message}`);
        result = createErrorRes(ERR_SERVER_INTERNAL) as any;
        return res.send(result);
    } finally {
        logger.info(`${logPrefix} result: ${JSON.stringify(result)}`);
    }
});
