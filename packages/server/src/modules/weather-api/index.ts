import _ from 'lodash';
import axios, { AxiosRequestConfig } from 'axios';
import { logger } from '../../logger';
import {
    ERR_SERVER_INTERNAL,
    ERR_WEATHER_API_EXCEEDED_CALL,
    ERR_WEATHER_API_INTERNAL,
    ERR_WEATHER_API_KEY_DISABLED,
    ERR_WEATHER_API_KEY_INVALID,
    ERR_WEATHER_API_KEY_NOT_PROVIDED,
    createErrorRes
} from '../http-apiv1/error';

interface WeatherApiClientOpts {
    requestKey?: string;
}

interface WeatherApiRequestParams {
    q: string;
    lang?: string;
    dt?: string;
    days?: number;
}

type WeatherApiType = 'search.json' | 'current.json' | 'forecast.json';

class WeatherApiClient {
    private _requestKey = '';

    constructor(opts?: WeatherApiClientOpts) {
        if (opts && opts.requestKey) {
            this._requestKey = opts.requestKey;
        }
    }

    setRequestKey(key: string) {
        logger.debug(`(mod.weather-api) setRequestKey() key: ${key}`);
        this._requestKey = key;
    }

    async requestJsonData(apiType: WeatherApiType, reqParams: WeatherApiRequestParams) {
        _.set(reqParams, 'key', this._requestKey);
        const reqConfig: AxiosRequestConfig = {
            method: 'GET',
            url: `https://api.weatherapi.com/v1/${apiType}`,
            params: reqParams
        };

        logger.debug(`(mod.weather-api) requestJsonData() reqConfig: ${JSON.stringify(reqConfig)}`);

        try {
            const res = await axios(reqConfig);
            logger.debug(`(mod.weather-api) requestJsonData() res.data: ${JSON.stringify(res.data)}`);
            return {
                error: 0,
                msg: 'Success',
                data: res.data
            };
        } catch (err: any) {
            logger.error(`(mod.weather-api) requestJsonData() error: ${err.message}`);
            const status = _.get(err, 'response.status');
            const errCode = _.get(err, 'response.data.error.code');
            if (status === 401 && errCode === 1002) {
                return createErrorRes(ERR_WEATHER_API_KEY_NOT_PROVIDED);
            } else if (status === 400 && errCode === 1005) {
                return createErrorRes(ERR_WEATHER_API_KEY_INVALID);
            } else if (status === 403 && errCode === 2007) {
                return createErrorRes(ERR_WEATHER_API_EXCEEDED_CALL);
            } else if (status === 403 && errCode === 2008) {
                return createErrorRes(ERR_WEATHER_API_KEY_DISABLED);
            } else if (status === 400 && errCode === 9999) {
                return createErrorRes(ERR_WEATHER_API_INTERNAL);
            } else {
                return createErrorRes(ERR_SERVER_INTERNAL);
            }
        }
    }
}

export const weatherApiClient = new WeatherApiClient();
