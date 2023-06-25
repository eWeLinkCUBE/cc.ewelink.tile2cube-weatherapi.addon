import router from '@/router';
import i18n from '@/i18n';
import { message } from 'ant-design-vue';
import { useEtcStore } from '@/store/etc';
import moment from 'moment';
import type { IForeCastMapping, IWindDirMapping } from '@/api/ts/interface/IWeatherInfo';
const $t = i18n.global.t;
/**
 *
 * 根据路径获取assets文件夹内的文件（主要用于图片）
 * @date 29/05/2023
 * @export
 * @param {string} url
 * @returns {*}
 */
export function getAssetsFile(url: string) {
    return new URL(`../assets/${url}`, import.meta.url).href;
}

/**
 *
 * ip校验（link IP）
 * @date 30/05/2023
 * @export
 * @param {string} ip
 * @returns {*}
 */
export function checkIpValid(ipAddress: string) {
    const reg = new RegExp(/^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/);
    if (!reg.test(ipAddress)) {
        return false;
    }
    return true;
}

/**
 *
 * 睡眠函数
 * @date 01/06/2023
 * @param {number} time
 */
export function sleep(time: number) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(1);
        }, time);
    });
}

/**
 * 温度单位选项
 * @date 15/06/2023
 */
export const temperatureData = [
    {
        label: '℃',
        value: 'C',
    },
    {
        label: '℉',
        value: 'F',
    },
];

/** 获取路由参数 */
export const getQuery = (e: string) => {
    if (!e) return '';
    let t: any = {},
        r = [],
        n = '',
        a = '';
    try {
        let arr: any[] = [];
        if ((e.indexOf('?') >= 0 && (arr = e.substring(e.indexOf('?') + 1, e.length).split('&')), arr.length > 0))
            for (let o in arr) (n = (r = arr[o].split('='))[0]), (a = r[1]), (t[n] = a);
    } catch (s) {
        t = {};
    }
    return t;
};

/**
 * 时间格式化
 * @date 20/06/2023
 * @export
 * @param {number} time
 * @returns {*}
 */
export function formatTimeUtils(time: number, type: string) {
    return moment(time * 1000).format(type); //"YYYY-MM-DD HH:mm:ss"
}

/**
 * 根据时间戳获取当前是星期几
 * @date 20/06/2023
 * @export
 * @param {number} time
 * @returns {*}
 */
export function getWeekByTimeStamp(timeStamp: number, type = 'd') {
    return moment(timeStamp * 1000).format(type);
}

/**
 * 天气预报信息映射
 * @date 20/06/2023
 * @export
 * @param {number} code
 * @returns {*}
 */
export const FORECAST_SETTING_MAPPING: IForeCastMapping = {
    1003: {
        dayText: '中文',
        dayIcon: '',
        nightText: '英文',
        nightIcon: '',
    },
};

/**
 * 判断对象是否为空
 * @date 20/06/2023
 * @export
 * @param {object} object
 * @returns {*}
 */
export function isEmptyObject(object: object) {
    const arr = Object.keys(object);
    if (!arr || arr.length < 1) return true;
    return false;
}

/**
 * km/h小时换算m/s
 * @date 21/06/2023
 * @export
 * @param {number} kph
 * @returns {*}
 */
export function kmToMs(kph: number) {
    return Math.round((kph * 1000) / 3600);
}

/**
 * 风向映射中英文
 * @date 21/06/2023
 * @export
 * @param {string} windDir
 * @returns {*}
 */
export const WIND_DIR_MAPPING: IWindDirMapping = {
    // TODO:改成i18n
    N: {
        zh_sc: '北风',
        en_us: 'N',
    },
    NNE: {
        zh_sc: '北东北风',
        en_us: 'NNE',
    },
    NE: {
        zh_sc: '东北风',
        en_us: 'NE',
    },
    ENE: {
        zh_sc: '东东北风向',
        en_us: 'ENE',
    },
    E: {
        zh_sc: '东风向',
        en_us: 'E',
    },
    ESE: {
        zh_sc: '东东南风向',
        en_us: 'ESE',
    },
    SE: {
        zh_sc: '东南风向',
        en_us: 'SE',
    },
    SSE: {
        zh_sc: '南东南风向',
        en_us: 'SSE',
    },
    S: {
        zh_sc: '南风',
        en_us: 'S',
    },
    SSW: {
        zh_sc: '南西南风向',
        en_us: 'SSW',
    },
    SW: {
        zh_sc: '西南风向',
        en_us: 'SW',
    },
    WSW: {
        zh_sc: '西西南风向',
        en_us: 'WSW',
    },
    W: {
        zh_sc: '西风',
        en_us: 'W',
    },
    WNW: {
        zh_sc: '西西北风向',
        en_us: 'WNW',
    },
    NW: {
        zh_sc: '西北风向',
        en_us: 'NW',
    },
    NNW: {
        zh_sc: '北西北风向',
        en_us: 'NNW',
    },
};

/**
 * 空气质量判断
 * @date 21/06/2023
 * @export
 * @param {number} air_quality
 * @returns {*}
 */
export function judgeAirQuality(air_quality: Number) {
    switch (air_quality) {
        case 1:
            return i18n.global.t('AIR_GOOD');
        case 2:
            return i18n.global.t('AIR_MODERATE');
        case 3:
            return i18n.global.t('AIR_SENSITIVE_UNHEALTHY');
        case 4:
            return i18n.global.t('AIR_UNHEALTHY');
        case 5:
            return i18n.global.t('AIR_VERY_UNHEALTHY');
        case 6:
            return i18n.global.t('AIR_HAZARDOUS');
        default:
            return '';
    }
}

/**
 * 紫外线判断
 * @date 21/06/2023
 * @export
 * @param {number} uv
 * @returns {*}
 */
export function judgeUv(uv: number): string {
    if (uv > 0 && uv <= 2) {
        return i18n.global.t('UV_LOW');
    } else if (uv >= 3 && uv <= 5) {
        return i18n.global.t('UV_MODERATE');
    } else if (uv >= 6 && uv <= 7) {
        return i18n.global.t('UV_HIGH');
    } else if (uv >= 8 && uv <= 10) {
        return i18n.global.t('UV_VERY_HIGH');
    } else if (uv >= 11) {
        return i18n.global.t('UV_EXTREME');
    } else {
        return '';
    }
}

/**
 * 温度单位选项
 * @date 15/06/2023
 */
export const temperatureData = [
    {
        label: '℃',
        value: '℃',
    },
    {
        label: '℉',
        value: '℉',
    },
];
