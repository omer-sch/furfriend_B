"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetch = void 0;
const universal_cookie_1 = __importDefault(require("universal-cookie"));
const fetch = (...args) => {
    return (0, exports.fetch)(...args).then(async (res) => {
        if (res.status === 401) {
            const cookies = new universal_cookie_1.default();
            const refreshToken = localStorage.getItem('refresh_token');
            try {
                const result = await (0, exports.fetch)(`${process.env.DOMAIN_BASE}:${process.env.PORT}/auth/refresh`, // 
                {
                    method: 'POST',
                    headers: {
                        authorization: `JWT ${refreshToken}`
                    }
                });
                if (result.status !== 200) {
                    throw res;
                }
                localStorage.removeItem('refresh_token');
                cookies.remove('refresh_token');
                const data = await result.json();
                localStorage.setItem('refresh_token', data.refreshToken);
                cookies.set('access_token', data.accessToken);
                localStorage.setItem('user_id', data.user._id);
                const newArgs = [...args];
                if (args[0].includes('/logout')) {
                    newArgs[1].headers.authorization = `JWT ${data.refreshToken}`;
                }
                else {
                    newArgs[1].headers.authorization = `JWT ${data.accessToken}`;
                }
                return (0, exports.fetch)(...newArgs);
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        }
        else {
            return res;
        }
    });
};
exports.fetch = fetch;
//# sourceMappingURL=fetch.js.map