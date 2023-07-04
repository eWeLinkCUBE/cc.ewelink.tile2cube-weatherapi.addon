import process from 'node:process';
import axios, { AxiosRequestConfig } from 'axios';
import _ from 'lodash';
import { wait } from '../../utils/time';
import { logger } from '../../logger';
import {
    GET_BRIDGE_TOKEN_INTERVAL,
    GET_BRIDGE_TOKEN_RETRY,
} from './const';
import {
    createErrorRes,
    ERR_SERVER_INTERNAL,
    ERR_IHOST_UNREACH,
    ERR_GET_BRIDGE_TOKEN_TIMEOUT,
    ERR_NO_CUBE_API_TOKEN,
} from '../http-apiv1/error';

interface CubeApiClientOpts {
    host?: string;
    token?: string;
}

interface CubeApiClientSendHttpRequestParams {
    method: string;
    url: string;
    bodyData?: any;
    queryParams?: any;
    timeout?: number;
    needToken?: boolean;
}

interface CubeApiClientGetBridgeTokenParams {
    appName?: string;
}

interface AddUiCardListParams {
    label?: string;
    cast_settings?: {
        dimensions: {
            src: string;
            size: string;
        }[];
        default: string;
    };
    web_settings: {
        dimensions: {
            src: string;
            size: string;
        }[];
        drawer_component?: {
            src: string;
        };
        default: string;
    };
}

class CubeApiClient {
    private _host = '';
    private _token = '';

    constructor(opts: CubeApiClientOpts) {
        this._host = opts.host || '';
        this._token = opts.token || '';
    }

    private async _sendHttpRequest(params: CubeApiClientSendHttpRequestParams) {
        if (params.needToken && !this._token) {
            return createErrorRes(ERR_NO_CUBE_API_TOKEN);
        }

        const reqConfig: AxiosRequestConfig = {
            method: params.method,
            url: `http://${this._host}${params.url}`
        };

        if (params.bodyData) {
            reqConfig.data = params.bodyData;
            _.set(reqConfig, 'headers["Content-Type"]', 'application/json');
        }

        if (params.queryParams) {
            reqConfig.params = params.queryParams;
        }

        if (params.timeout) {
            reqConfig.timeout = params.timeout;
        }

        if (params.needToken) {
            _.set(reqConfig, 'headers["Authorization"]', `Bearer ${this._token}`);
        }

        logger.debug(`(mod.cube-api) _sendHttpRequest() reqConfig: ${JSON.stringify(reqConfig)}`);

        try {
            const res = await axios(reqConfig);
            logger.debug(`(mod.cube-api) _sendHttpRequest() res.data: ${JSON.stringify(res.data)}`);
            return res.data;
        } catch (err: any) {
            logger.error(`(mod.cube-api) _sendHttpRequest() error: ${err.message}`);
            if (err.code === 'EHOSTUNREACH') {
                return createErrorRes(ERR_IHOST_UNREACH);
            } else {
                return createErrorRes(ERR_SERVER_INTERNAL);
            }
        }
    }

    setToken(token: string) {
        logger.debug(`(mod.cube-api) setToken() token: ${token}`);
        this._token = token;
    }

    /** Get bridge token */
    async getBridgeToken(params?: CubeApiClientGetBridgeTokenParams) {
        const queryParams = {};
        if (params?.appName) {
            _.set(queryParams, 'app_name', params.appName);
        }
        let n = 0;

        while (n++ < GET_BRIDGE_TOKEN_RETRY) {
            // res: { error: 0, data: { token: 'abc' }, message: 'success' }
            const res = await this._sendHttpRequest({
                method: 'GET',
                url: '/open-api/v1/rest/bridge/access_token',
                queryParams,
            });
            const resError = _.get(res, 'error');
            const resToken = _.get(res, 'data.token');
            if (resError === 0) {
                this._token = resToken;
                return {
                    error: 0,
                    msg: 'Success',
                    data: {
                        token: resToken
                    }
                };
            }
            await wait(GET_BRIDGE_TOKEN_INTERVAL);
        }

        return createErrorRes(ERR_GET_BRIDGE_TOKEN_TIMEOUT);
    }

    /** Get device list */
    async getDeviceList() {
        return await this._sendHttpRequest({
            method: 'GET',
            url: '/open-api/v1/rest/devices',
            needToken: true
        });
    }

    /** Get iHost UI card list */
    async getUiCardList() {
        return await this._sendHttpRequest({
            method: 'GET',
            url: '/open-api/v1/rest/ui/cards',
            needToken: true
        });
    }

    /** Add iHost UI card list */
    async addUiCardList(params: AddUiCardListParams) {
        return await this._sendHttpRequest({
            method: 'POST',
            url: '/open-api/v1/rest/ui/cards',
            needToken: true,
            bodyData: params
        });
    }
}

export const cubeApiClient = new CubeApiClient({ host: process.env.CONFIG_CUBE_HOST });
