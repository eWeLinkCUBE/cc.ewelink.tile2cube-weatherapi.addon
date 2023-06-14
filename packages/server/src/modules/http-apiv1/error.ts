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

export function createErrorRes(errRes: any, newErrMsg?: string) {
    const errCode = _.get(errRes, 'error');
    const errMsg = newErrMsg || _.get(errRes, 'msg');
    return {
        error: errCode,
        msg: errMsg,
        data: {}
    };
}
