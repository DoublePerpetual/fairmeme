import { post } from '../request';
export const getTokenList = (params: CrazyMemeHome.Params): Promise<CrazyMemeHome.Response> =>
    post('/api/v1/token/list', params);
export const followActionReq = (params: CrazyMemeHome.FollowActionParams): Promise<CrazyMemeHome.Response> =>
    post('/api/v1/followAction', params);
