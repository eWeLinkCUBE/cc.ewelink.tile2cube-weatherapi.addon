import { request } from '../public';
import type { IGateWayInfoData } from '@/api/ts/interface/IWeatherInfo';
import EReqMethod from '../ts/enum/EReqMethod';

/** 获取凭证信息 */
async function GetTokenInfo() {
    return await request<IGateWayInfoData>(`/cube-token-info`, { }, EReqMethod.GET);
}

/** 获取token接口 */
async function GetToken(){
    return await request(`/cube-token`,{},EReqMethod.GET);
}

export default {
    GetTokenInfo
};
