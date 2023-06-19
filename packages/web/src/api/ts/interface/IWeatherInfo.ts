/** 获取到的网关信息 */
export interface ITokenInfo{
    /**  凭证是否有效 */
    cubeTokenValid : boolean,
    /** 上次获取token的请求时间 */
    requestTokenTime:number
}

export interface ICityData{
    //城市
    country:string,
    //id
    id:number,
    //精度
    lat:number,
    //纬度
    lon:string,
    //名字
    name:string,
    //地区
    region:string,
    //图片的url
    url:string,
    //展示名字
    display_name?:string
}

export interface IFormState {
    weather: {
        /** weather apiKey */
        weatherApiKey: string;
         /** 城市名称 */
        cityName: string | undefined;
        /**温度单位 */
        tempUnit: string | undefined;
    };
}

export interface IFormData{
    /** weather apiKey */
    weatherApiKey:string,
    /** 城市名称 */
    cityName:string | undefined;
    /**温度单位 */
    tempUnit:string | undefined;
}
