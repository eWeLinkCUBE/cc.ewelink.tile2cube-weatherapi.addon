import _ from 'lodash';

export const ERR_SERVER_INTERNAL = {
    error: 1000,
    msg: 'Server internal error'
};

export const ERR_IHOST_UNREACH = {
    error: 1001,
    msg: 'iHost unreach'
};

export const ERR_GET_BRIDGE_TOKEN_TIMEOUT = {
    error: 1002,
    msg: 'Get bridge token timeout'
};

export const ERR_WEATHER_API_KEY_NOT_PROVIDED = {
    error: 1003,
    msg: 'Weather API key not provided'
};

export const ERR_WEATHER_API_KEY_INVALID = {
    error: 1004,
    msg: 'Weather API key invalid'
};

export const ERR_WEATHER_API_EXCEEDED_CALL = {
    error: 1005,
    msg: 'Weather API key has exceeded calls per month quota'
};

export const ERR_WEATHER_API_KEY_DISABLED = {
    error: 1006,
    msg: 'Weather API key has been disabled'
};

export const ERR_WEATHER_API_INTERNAL = {
    error: 1007,
    msg: 'Weather API internal error'
};

export const ERR_PARAM_NO_WEATHER_API_KEY = {
    error: 2000,
    msg: 'No weather API key'
};

export const ERR_PARAM_NO_CITY_NAME = {
    error: 2001,
    msg: 'No city name'
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
