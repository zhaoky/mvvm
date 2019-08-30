import { isArray, isObject } from "@/utils";
import Dep from "@/dep";
/**
 * 监测数据模型
 *
 * @class Observer
 */
export default class Observer {
  /**
   * 数据值
   *
   * @private
   * @type {*}
   * @memberof Observer
   */
  private data: any = undefined;
  /**
   *Creates an instance of Observer.
   * @param {*} data [需要监听的数据]
   * @param {string} path [订阅key(路径标识)]
   * @memberof Observer
   */
  public constructor(data: any, path: string) {
    if (data.__proxy === 1) {
      this.data = data;
      return;
    }
    if (isObject(data) || isArray(data)) {
      this.data = this._observe(data, path);
      return;
    }
    this.data = data;
  }
  /**
   * 架设proxy拦截
   *
   * @private
   * @param {Record<string, any>} data
   * @param {string} path
   * @return {*}
   * @memberof Observer
   */
  private _observe(data: Record<string, any>, path: string): any {
    const dep = new Dep(); // 每一个对象就一个订阅中心
    const keys = Object.keys(data);

    keys.forEach((key: any): void => {
      const value = data[key];
      data[key] = new Observer(value, `${path}__${key}`).getData();
    });

    const handler = {
      get(target: any, property: string): any {
        if (!target.hasOwnProperty(property) && typeof property === "symbol") {
          return Reflect.get(target, property);
        }

        // 订阅watcher到属性上
        const curWatcher = Dep.curWatcher;
        if (curWatcher) {
          dep.addDep(`${path}____proxy`, curWatcher); // 订阅到上层__proxy以备用
          dep.addDep(`${path}__${property}`, curWatcher);
        }
        return Reflect.get(target, property);
      },
      set(target: any, property: string, value: any, receiver: any): boolean {
        let arrArgs = {};
        dep.beforeNotfiy(`${path}__${property}`);

        // 目标是数组的handler
        if (isArray(target)) {
          arrArgs = { receiver, property, value };
          // 如果数组里的元素是新加入的，就把数组上的所有订阅分发给新元素
          if (!target[property]) {
            dep.copyArrayWatcherDep(`${path}`, `${path}__${property}`);
          }
        }

        target[property] = new Observer(value, `${path}__${property}`).getData();

        Reflect.set(target, property, target[property]);

        dep.notfiy(`${path}__${property}`, arrArgs);

        return true;
      }
    };

    const proxy = new Proxy(data, handler);
    // 添加proxy对象标志属性
    Reflect.defineProperty(data, "__proxy", {
      value: 1,
      writable: false,
      enumerable: false,
      configurable: false
    });
    return proxy;
  }
  /**
   * 获取值
   *
   * @return {any}
   * @memberof Observer
   */
  public getData(): any {
    return this.data;
  }
}
