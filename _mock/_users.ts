import {MockRequest, MockStatusError} from '@delon/mock';

export const USER = {
    // 支持值为 Object 和 Array
    'GET /users': {users: [1, 2], total: 2},
    // GET 可省略
    '/users/1': {users: [1, 2], total: 2},
    // POST 请求
    'POST /users/1': {uid: 1},
    // POST 请求
    'POST /login': (req: MockRequest) => req.body,
    // 获取请求参数 queryString、headers、body
    '/qs': (req: MockRequest) => req.queryString.pi,
    // 路由参数
    '/users/:id': (req: MockRequest) => req.params, // /users/100, output: { id: 100 }
    // 发送 Status 错误
    '/404': () => {
        throw new MockStatusError(404);
    },
    // 使用 () 表示：正则表达式
    '/data/(.*)': (req: MockRequest) => req
}
