import { defineStore } from "pinia";
import {
  type userType,
  store,
  router,
  resetRouter,
  routerArrays,
  storageLocal
} from "../utils";
import {
  type UserResult,
  getLogin,
  getLogout
} from "@/api/user";
import { useMultiTagsStoreHook } from "./multiTags";
import { type DataInfo, setTokenFromLogin, removeToken, userKey } from "@/utils/auth";

export const useUserStore = defineStore("pure-user", {
  state: (): userType => ({
    // 用户名
    username: storageLocal().getItem<DataInfo<number>>(userKey)?.username ?? "",
    // 账号
    account: storageLocal().getItem<DataInfo<number>>(userKey)?.account ?? "",
    // 角色
    roles: storageLocal().getItem<DataInfo<number>>(userKey)?.roles ?? [],
    // 是否勾选了登录页的免登录
    isRemembered: false,
    // 登录页的免登录存储几天，默认7天
    loginDay: 7
  }),
  actions: {
    /** 存储用户名 */
    SET_USERNAME(username: string) {
      this.username = username;
    },
    /** 存储账号 */
    SET_ACCOUNT(account: string) {
      this.account = account;
    },
    /** 存储角色 */
    SET_ROLES(roles: Array<string>) {
      this.roles = roles;
    },
    /** 存储是否勾选了登录页的免登录 */
    SET_ISREMEMBERED(bool: boolean) {
      this.isRemembered = bool;
    },
    /** 设置登录页的免登录存储几天 */
    SET_LOGINDAY(value: number) {
      this.loginDay = Number(value);
    },
    /** 登入 */
    async loginByUsername(data) {
      console.log('调用登录API，参数:', data);
      return new Promise((resolve, reject) => {
        getLogin(data)
          .then(data => {
            console.log('登录API返回:', data);
            if (data?.code === 200) {
              console.log('登录成功，用户信息:', data.data);
              setTokenFromLogin(data.data);
              this.SET_USERNAME(data.data.username);
              this.SET_ACCOUNT(data.data.account);
              this.SET_ROLES([data.data.role]);
            } else {
              console.log('登录失败:', data?.msg);
            }
            resolve(data);
          })
          .catch(error => {
            console.error('登录API错误:', error);
            reject(error);
          });
      });
    },
    /** 登出 */
    async logOut() {
      return new Promise((resolve, reject) => {
        getLogout()
          .then(() => {
            this.username = "";
            this.account = "";
            this.roles = [];
            removeToken();
            useMultiTagsStoreHook().handleTags("equal", [...routerArrays]);
            resetRouter();
            router.push("/login");
            resolve(true);
          })
          .catch(error => {
            reject(error);
          });
      });
    }
  }
});

export function useUserStoreHook() {
  return useUserStore(store);
}
