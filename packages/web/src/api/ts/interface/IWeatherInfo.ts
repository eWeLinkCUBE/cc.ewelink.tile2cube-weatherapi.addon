/** 获取到的网关信息 */
export interface ITokenInfo {
    /**  凭证是否有效 */
    cubeTokenValid: boolean;
    /** 上次获取token的请求时间 */
    requestTokenTime: number;
}

/** 城市数据 */
export interface ICityData {
    //城市
    country: string;
    //id
    id: number;
    //精度
    lat: number;
    //纬度
    lon: string;
    //名字
    name: string;
    //地区
    region: string;
    //图片的url
    url: string;
    //前端自己加的展示名字
    display_name?: string;
}

/** 表单数据 */
export interface IFormState {
    weather: {
        /** weather apiKey */
        weatherApiKey: string;
        /** 城市id */
        cityData: string | undefined | number;
        /**温度单位 */
        tempUnit: string | undefined;
    };
}

/** 提交保存配置信息 */
export interface ISubmitData {
    /** weather apiKey */
    weatherApiKey: string;
    /** 城市完整数据 */
    cityData: ICityData;
    /**温度单位 */
    tempUnit: string | undefined;
}

/** 提交的配置信息 */
export interface IRequestConfigInfo {
    /** apiKey */
    weatherApiKey: string;
    /** 完整城市数据 */
    cityData: object;
    /**温度单位 */
    tempUnit: string | undefined;
}

/** 请求天气预报参数 */
export interface IRequestForeCastInfo {
    /** 天气预报的天数 */
    days?: number;
    /** 是否强制刷新天气 */
    refresh?: string;
}

/** 返回的天气预报信息 */
export interface IForeCastResultInfo {
    forecastData: {
        /** 天气预警 */
        alerts: object;
        /** 当日天气预报 */
        current: object;
        /** 未来五天天气预报 */
        forecast: object;
        /** 位置信息 */
        location: {
            // country: string;
            // lat: number;
            // localtime: string;
            // localtime_epoch: number;
            // lon: number;
            // name: string;
            // region: string;
            // tz_id: string;
        };
    };
    updateTime: number;
}

export interface ICardStyle {
    width: number;
    height: number;
}

export interface IForeCastMapping {
    [propsName: number]: {
        /** 白天天气 */
        day: string;
        /** 晚上天气 */
        night: string;
        /** 白天图标 */
        dayIcon: string;
        /** 夜晚图标 */
        nightIcon: string;
    };
}
