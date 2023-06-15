import _ from 'lodash';
import axios, { AxiosRequestConfig } from 'axios';
import { logger } from '../../logger';
import { ERR_SERVER_INTERNAL, createErrorRes } from '../http-apiv1/error';

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
            return res.data;
        } catch (err: any) {
            logger.error(`(mod.weather-api) requestJsonData() error: ${err.message}`);
            // TODO: check Internet connection
            return createErrorRes(ERR_SERVER_INTERNAL);
        }
    }
}

export const weatherApiClient = new WeatherApiClient();
