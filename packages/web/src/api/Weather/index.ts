import { request } from '../public';
import type { ITokenInfo, ICityData ,ISubmitData ,IFormState ,IRequestForeCastInfo ,IRequestConfigInfo ,IForeCastResultInfo } from '@/api/ts/interface/IWeatherInfo';
import EReqMethod from '../ts/enum/EReqMethod';

/** 获取当前凭证信息 */
async function GetTokenInfo() {
    return await request<ITokenInfo>(`/cube-token-info`, {}, EReqMethod.GET);
}

/** 获取token接口 */
async function sendRequestGetToken() {
    return await request<{ token: string }>(`/cube-token`, {}, EReqMethod.GET);
}

/** 获取城市列表 */
async function GetCityList(apiKey: string, city: string) {
    return await request<{ cityList: ICityData[] }>(`/city-list?key=${apiKey}&city=${city}`, {}, EReqMethod.GET);
}

/** 获取已经保存的配置信息 */
async function GetSaveData() {
    return await request<ISubmitData>(`/config`, {}, EReqMethod.GET);
}

/** 保存配置信息 */
async function setConfigData(params:IRequestConfigInfo){
    return await request<any>(`/config`, params, EReqMethod.POST);
}

/** 获取天气预报 */
async function getForeCastInfo(params:IRequestForeCastInfo){
    return await request<IForeCastResultInfo>(`/forecast?days=${params.days}`, {}, EReqMethod.GET);
}

export default {
    GetTokenInfo,
    sendRequestGetToken,
    GetCityList,
    GetSaveData,
    setConfigData,
    getForeCastInfo
};
