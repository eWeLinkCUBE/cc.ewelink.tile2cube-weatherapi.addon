import _ from 'lodash';

export const ERR_SERVER_INTERNAL = {
    error: 1000,
    msg: 'Server internal error'
};

export const ERR_IHOST_UNREACH = {
    error: 1001,
    msg: 'iHost unreach'
};

export const ERR_NO_CUBE_API_TOKEN = {
    error: 1002,
    msg: 'No eWeLink Cube API token'
};

export const ERR_GET_BRIDGE_TOKEN_TIMEOUT = {
    error: 1003,
    msg: 'Get bridge token timeout'
};

export const ERR_PARAM_NO_WEATHER_API_KEY = {
    error: 2000,
    msg: 'No weather API key'
};

export const ERR_PARAM_NO_CITY_NAME = {
    error: 2001,
    msg: 'No city name'
};

export const ERR_PARAM_NO_CITY_DATA = {
    error: 2002,
    msg: 'No city data'
};

export const ERR_PARAM_NO_TEMP_UNIT = {
    error: 2003,
    msg: 'No temperature unit'
};

export const ERR_WEATHER_API_KEY_NOT_PROVIDED = {
    error: 3000,
    msg: 'Weather API key not provided'
};

export const ERR_WEATHER_API_KEY_INVALID = {
    error: 3001,
    msg: 'Weather API key invalid'
};

export const ERR_WEATHER_API_EXCEEDED_CALL = {
    error: 3002,
    msg: 'Weather API key has exceeded calls per month quota'
};

export const ERR_WEATHER_API_KEY_DISABLED = {
    error: 3003,
    msg: 'Weather API key has been disabled'
};

export const ERR_WEATHER_API_INTERNAL = {
    error: 3004,
    msg: 'Weather API internal error'
};

export const ERR_WEATHER_API_NO_CITY_DATA = {
    error: 3005,
    msg: 'Weather API no city data'
};

export function createErrorRes(errRes: any, newErrMsg?: string) {
    const errCode = _.get(errRes, 'error');
    const errMsg = newErrMsg || _.get(errRes, 'msg');
    return {
        error: errCode,
        msg: errMsg,
        data: {}
    };
}
