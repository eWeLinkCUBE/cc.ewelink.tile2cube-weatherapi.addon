import { request } from '../public';
import type { ITokenInfo, ICityData ,IFormData ,IFormState } from '@/api/ts/interface/IWeatherInfo';
import EReqMethod from '../ts/enum/EReqMethod';

/** 获取当前凭证信息 */
async function GetTokenInfo() {
    return await request<ITokenInfo>(`/cube-token-info`, {}, EReqMethod.GET);
}

/** 获取token接口 */
async function GetToken() {
    return await request<{ token: string }>(`/cube-token`, {}, EReqMethod.GET);
}

/** 获取城市列表 */
async function GetCityList(apiKey: string, city: string) {
    return await request<{ cityList: ICityData[] }>(`/city-list?key=${apiKey}&city=${city}`, {}, EReqMethod.GET);
}

/** 获取已经保存的配置信息 */
async function GetSaveData() {
    return await request<IFormData>(`/config`, {}, EReqMethod.GET);
}

/** 保存配置信息 */
async function setConfigData(params:IFormData){
    return await request<any>(`/config`, {params}, EReqMethod.POST);
}

export default {
    GetTokenInfo,
    GetToken,
    GetCityList,
    GetSaveData,
    setConfigData
};
