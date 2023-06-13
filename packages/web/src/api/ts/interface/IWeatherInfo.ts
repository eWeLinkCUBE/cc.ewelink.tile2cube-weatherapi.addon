/** 获取到的网关信息 */
export interface IGateWayInfoData{
    /** ip地址 */
    ip: string;
    /** mac地址 */
    mac: string;
    /** 名称 */
    name?: string;
    /** 域名 */
    domain: string;
    /** 开始获取token的时间戳 */
    ts: string | number;
    /** ip是否有效 */
    ipValid: boolean;
    /** 凭证是否有效 */
    tokenValid: boolean;
    /** 加密后的token */
    token?:string
}
