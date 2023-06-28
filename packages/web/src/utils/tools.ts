import router from '@/router';
import i18n from '@/i18n';
import { message } from 'ant-design-vue';
import { useEtcStore } from '@/store/etc';
import moment from 'moment';
import type { IForeCastMapping } from '@/api/ts/interface/IWeatherInfo';
//晴天
import SunnyIcon_day from '@/assets/img/forecast/day/sunnyIcon-day.png';
import SunnyIcon_night from '@/assets/img/forecast/night/sunnyIcon-night.png';
//热
import HotIcon_day from '@/assets/img/forecast/day/hotIcon-day.png';
import HotIcon_night from '@/assets/img/forecast/night/hotIcon-night.png';
//冷
import ColdIcon_day from '@/assets/img/forecast/day/coldIcon-day.png';
import ColdIcon_night from '@/assets/img/forecast/night/coldIcon-night.png';
//雨夹雪
import RainSnowIcon_day from '@/assets/img/forecast/day/rainSnowIcon-day.png';
import RainSnowIcon_night from '@/assets/img/forecast/night/rainSnowIcon-night.png';
//风
import WindyIcon from '@/assets/img/forecast/day/windyIcon.png';
//晴转多云
import SunnyCloudyIcon_day from '@/assets/img/forecast/day/sunnyCloudyIcon-day.png';
import SunnyCloudyIcon_night from '@/assets/img/forecast/night/sunnyCloudyIcon-night.png';
//冰雹
import SleetIcon_day from '@/assets/img/forecast/day/sleetIcon-day.png';
import SleetIcon_night from '@/assets/img/forecast/night/sleetIcon-night.png';
//多云
import CloudyIcon_day from '@/assets/img/forecast/day/cloudyIcon-day.png';
import CloudyIcon_night from '@/assets/img/forecast/night/cloudyIcon-night.png';
//雾
import FogIcon_day from '@/assets/img/forecast/day/fogIcon-day.png';
import FogIcon_night from '@/assets/img/forecast/night/fogIcon-night.png';
//雪
import SnowIcon_day from '@/assets/img/forecast/day/snowIcon-day.png';
import SnowIcon_night from '@/assets/img/forecast/night/snowIcon-night.png';
//暴雨
import TStormsIcon_day from '@/assets/img/forecast/day/tStormsIcon-day.png';
import TStormsIcon_night from '@/assets/img/forecast/night/tStormsIcon-night.png';
//小雪
import FlurriesIcon_day from '@/assets/img/forecast/day/flurriesIcon-day.png';
import FlurriesIcon_night from '@/assets/img/forecast/night/flurriesIcon-night.png';
//阵雨
import ShowersIcon_day from '@/assets/img/forecast/day/showersIcon-day.png';
import ShowersIcon_night from '@/assets/img/forecast/night/showersIcon-night.png';
//未获取到天气
import Unknown from '@/assets/img/Unknown.png';

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
 * 根据code获取中英文
 * @date 28/06/2023
 * @export
 * @param {number} code
 * @param {number} isDay 1:白天 0:黑夜
 * @returns {*}
 */
export function translateByCode(code: number, isDay: boolean) {
    const item = FORECAST_SETTING_MAPPING[code];
    return isDay ? i18n.global.t(item.day) : i18n.global.t(item.night);
}

/**
 * 天气预报信息映射
 * @date 20/06/2023
 * @export
 * @param {number} code
 * @returns {*}
 */
export const FORECAST_SETTING_MAPPING: IForeCastMapping = {
    0: {
        day: 'unknown',
        night: 'unknown',
        dayIcon: Unknown,
        nightIcon: Unknown,
    },
    1000: {
        day: 'FORECAST.SUNNY', //"Sunny",
        night: 'FORECAST.CLEAR', //"Clear",
        dayIcon: SunnyIcon_day,
        nightIcon: SunnyIcon_night,
    },
    1003: {
        day: 'FORECAST.SUNNY_CLOUDY', //"Partly cloudy",
        night: 'FORECAST.CLOUDY', //"Partly cloudy",
        dayIcon: SunnyCloudyIcon_day,
        nightIcon: SunnyCloudyIcon_night,
    },
    1006: {
        day: 'FORECAST.CLOUDY',
        night: 'FORECAST.CLOUDY',
        dayIcon: CloudyIcon_day,
        nightIcon: CloudyIcon_night,
    },
    1009: {
        day: 'FORECAST.CLOUDY',
        night: 'FORECAST.CLOUDY',
        dayIcon: CloudyIcon_day,
        nightIcon: CloudyIcon_night,
    },
    1030: {
        day: 'FORECAST.FOG',
        night: 'FORECAST.FOG',
        dayIcon: FogIcon_day,
        nightIcon: FogIcon_night,
    },
    1063: {
        day: 'FORECAST.SHOWERS',
        night: 'FORECAST.SHOWERS',
        dayIcon: ShowersIcon_day,
        nightIcon: ShowersIcon_night,
    },
    1066: {
        day: 'FORECAST.SNOW',
        night: 'FORECAST.SNOW',
        dayIcon: SnowIcon_day,
        nightIcon: SnowIcon_night,
    },
    1069: {
        day: 'FORECAST.RAIN_SNOW',
        night: 'FORECAST.RAIN_SNOW',
        dayIcon: RainSnowIcon_day,
        nightIcon: RainSnowIcon_night,
    },
    1072: {
        day: 'FORECAST.SLEET',
        night: 'FORECAST.SLEET',
        dayIcon: SleetIcon_day,
        nightIcon: SleetIcon_night,
    },
    1087: {
        day: 'FORECAST.TSTORMS',
        night: 'FORECAST.TSTORMS',
        dayIcon: TStormsIcon_day,
        nightIcon: TStormsIcon_night,
    },
    1114: {
        day: 'FORECAST.FLURRIES',
        night: 'FORECAST.FLURRIES',
        dayIcon: FlurriesIcon_day,
        nightIcon: FlurriesIcon_night,
    },
    1117: {
        day: 'FORECAST.SNOW',
        night: 'FORECAST.SNOW',
        dayIcon: SnowIcon_day,
        nightIcon: SnowIcon_night,
    },
    1135: {
        day: 'FORECAST.FOG',
        night: 'FORECAST.FOG',
        dayIcon: FogIcon_day,
        nightIcon: FogIcon_night,
    },
    1147: {
        day: 'FORECAST.FOG',
        night: 'FORECAST.FOG',
        dayIcon: FogIcon_day,
        nightIcon: FogIcon_night,
    },
    1150: {
        day: 'FORECAST.SHOWERS',
        night: 'FORECAST.SHOWERS',
        dayIcon: ShowersIcon_day,
        nightIcon: ShowersIcon_night,
    },
    1153: {
        day: 'FORECAST.SHOWERS',
        night: 'FORECAST.SHOWERS',
        dayIcon: ShowersIcon_day,
        nightIcon: ShowersIcon_night,
    },
    1168: {
        day: 'FORECAST.SLEET',
        night: 'FORECAST.SLEET',
        dayIcon: SleetIcon_day,
        nightIcon: SleetIcon_night,
    },
    1171: {
        day: 'FORECAST.SHOWERS',
        night: 'FORECAST.SHOWERS',
        dayIcon: ShowersIcon_day,
        nightIcon: ShowersIcon_night,
    },
    1180: {
        day: 'FORECAST.SHOWERS',
        night: 'FORECAST.SHOWERS',
        dayIcon: ShowersIcon_day,
        nightIcon: ShowersIcon_night,
    },
    1183: {
        day: 'FORECAST.SHOWERS',
        night: 'FORECAST.SHOWERS',
        dayIcon: ShowersIcon_day,
        nightIcon: ShowersIcon_night,
    },
    1186: {
        day: 'FORECAST.SHOWERS',
        night: 'FORECAST.SHOWERS',
        dayIcon: ShowersIcon_day,
        nightIcon: ShowersIcon_night,
    },
    1189: {
        day: 'FORECAST.SHOWERS',
        night: 'FORECAST.SHOWERS',
        dayIcon: ShowersIcon_day,
        nightIcon: ShowersIcon_night,
    },
    1192: {
        day: 'FORECAST.SHOWERS',
        night: 'FORECAST.SHOWERS',
        dayIcon: ShowersIcon_day,
        nightIcon: ShowersIcon_night,
    },
    1195: {
        day: 'FORECAST.SHOWERS',
        night: 'FORECAST.SHOWERS',
        dayIcon: ShowersIcon_day,
        nightIcon: ShowersIcon_night,
    },
    1198: {
        day: 'FORECAST.SLEET',
        night: 'FORECAST.SLEET',
        dayIcon: SleetIcon_day,
        nightIcon: SleetIcon_night,
    },
    1201: {
        day: 'FORECAST.SLEET',
        night: 'FORECAST.SLEET',
        dayIcon: SleetIcon_day,
        nightIcon: SleetIcon_night,
    },
    1204: {
        day: 'FORECAST.RAIN_SNOW',
        night: 'FORECAST.RAIN_SNOW',
        dayIcon: RainSnowIcon_day,
        nightIcon: RainSnowIcon_night,
    },
    1207: {
        day: 'FORECAST.RAIN_SNOW',
        night: 'FORECAST.RAIN_SNOW',
        dayIcon: RainSnowIcon_day,
        nightIcon: RainSnowIcon_night,
    },
    1210: {
        day: 'FORECAST.FLURRIES',
        night: 'FORECAST.FLURRIES',
        dayIcon: FlurriesIcon_day,
        nightIcon: FlurriesIcon_night,
    },
    1213: {
        day: 'FORECAST.FLURRIES',
        night: 'FORECAST.FLURRIES',
        dayIcon: FlurriesIcon_day,
        nightIcon: FlurriesIcon_night,
    },
    1216: {
        day: 'FORECAST.SNOW',
        night: 'FORECAST.SNOW',
        dayIcon: SnowIcon_day,
        nightIcon: SnowIcon_night,
    },
    1219: {
        day: 'FORECAST.SNOW',
        night: 'FORECAST.SNOW',
        dayIcon: SnowIcon_day,
        nightIcon: SnowIcon_night,
    },
    1222: {
        day: 'FORECAST.SNOW',
        night: 'FORECAST.SNOW',
        dayIcon: SnowIcon_day,
        nightIcon: SnowIcon_night,
    },
    1225: {
        day: 'FORECAST.SNOW',
        night: 'FORECAST.SNOW',
        dayIcon: SnowIcon_day,
        nightIcon: SnowIcon_night,
    },
    1237: {
        day: 'FORECAST.SLEET',
        night: 'FORECAST.SLEET',
        dayIcon: SleetIcon_day,
        nightIcon: SleetIcon_night,
    },
    1240: {
        day: 'FORECAST.SHOWERS',
        night: 'FORECAST.SHOWERS',
        dayIcon: ShowersIcon_day,
        nightIcon: ShowersIcon_night,
    },
    1243: {
        day: 'FORECAST.SHOWERS',
        night: 'FORECAST.SHOWERS',
        dayIcon: ShowersIcon_day,
        nightIcon: ShowersIcon_night,
    },
    1246: {
        day: 'FORECAST.TSTORMS',
        night: 'FORECAST.TSTORMS',
        dayIcon: TStormsIcon_day,
        nightIcon: TStormsIcon_night,
    },
    1249: {
        day: 'FORECAST.SLEET',
        night: 'FORECAST.SLEET',
        dayIcon: SleetIcon_day,
        nightIcon: SleetIcon_night,
    },
    1252: {
        day: 'FORECAST.RAIN_SNOW',
        night: 'FORECAST.RAIN_SNOW',
        dayIcon: RainSnowIcon_day,
        nightIcon: RainSnowIcon_night,
    },
    1255: {
        day:'FORECAST.FLURRIES',
        night:'FORECAST.FLURRIES',
        dayIcon: FlurriesIcon_day,
        nightIcon: FlurriesIcon_night,
    },
    1258: {
        day:'FORECAST.SNOW',
        night:'FORECAST.SNOW',
        dayIcon: SnowIcon_day,
        nightIcon: SnowIcon_night,
    },
    1261: {
        day:'FORECAST.SLEET',
        night:'FORECAST.SLEET',
        dayIcon: SleetIcon_day,
        nightIcon: SleetIcon_night,
    },
    1264: {
        day:'FORECAST.SLEET',
        night:'FORECAST.SLEET',
        dayIcon: SleetIcon_day,
        nightIcon: SleetIcon_night,
    },
    1273: {
        day:'FORECAST.TSTORMS',
        night:'FORECAST.TSTORMS',
        dayIcon: TStormsIcon_day,
        nightIcon: TStormsIcon_night,
    },
    1276: {
        day:'FORECAST.TSTORMS',
        night:'FORECAST.TSTORMS',
        dayIcon: TStormsIcon_day,
        nightIcon: TStormsIcon_night,
    },
    1279: {
        day:'FORECAST.FLURRIES',
        night:'FORECAST.FLURRIES',
        dayIcon: FlurriesIcon_day,
        nightIcon: FlurriesIcon_night,
    },
    1282: {
        day:'FORECAST.SNOW',
        night:'FORECAST.SNOW',
        dayIcon: SnowIcon_day,
        nightIcon: SnowIcon_night,
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
    if (!kph || kph <= 0) return '';
    return Math.round((kph * 1000) / 3600);
}

/**
 * 风向映射中英文
 * @date 21/06/2023
 * @export
 * @param {string} windDir
 * @returns {*}
 */
export const WIND_DIR_MAPPING: {
    [windDir: string]: string;
} = {
    N: 'WIND_DIRECTION.N',
    NNE: 'WIND_DIRECTION.NNE',
    NE: 'WIND_DIRECTION.NE',
    ENE: 'WIND_DIRECTION.ENE',
    E: 'WIND_DIRECTION.E',
    ESE: 'WIND_DIRECTION.ESE',
    SE: 'WIND_DIRECTION.SE',
    SSE: 'WIND_DIRECTION.SSE',
    S: 'WIND_DIRECTION.S',
    SSW: 'WIND_DIRECTION.SSW',
    SW: 'WIND_DIRECTION.SW',
    WSW: 'WIND_DIRECTION.WSW',
    W: 'WIND_DIRECTION.W',
    WNW: 'WIND_DIRECTION.WNW',
    NW: 'WIND_DIRECTION.NW',
    NNW: 'WIND_DIRECTION.NNW',
};

/**
 * 空气质量判断
 * @date 21/06/2023
 * @export
 * @param {number} air_quality
 * @returns {*}
 */
export function judgeAirQuality(air_quality: number) {
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
