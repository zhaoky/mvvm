import { isArray, isObject } from "./utils";
import Dep, { DepClass } from "./dep";
export interface ArrArgs {
  receiver: any;
  property: string;
  value: any;
}
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
   * @type {any}
   * @memberof Observer
   */
  private data: any = null;
  /**
   *Creates an instance of Observer.
   * @param {any} data [需要监听的数据]
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
   * @param {Record<string, any>} data [需要监听的数据]
   * @param {string} path [订阅key(路径标识)]
   * @return {Proxy}
   * @memberof Observer
   */
  private _observe(data: Record<string, any>, path: string): ProxyConstructor {
    const dep: DepClass = new Dep(); // 每一个对象就一个订阅中心
    const keys: string[] = Object.keys(data);

    keys.forEach((key: string): void => {
      const value: any = data[key];
      data[key] = new Observer(value, `${path}__${key}`).getData();
    });

    const handler: ProxyHandler<any> = {
      get(target: any, property: string | number | symbol): any {
        if (!target.hasOwnProperty(property) && typeof property === "symbol") {
          return Reflect.get(target, property);
        }

        // 订阅中心开始收集watcher依赖
        if (Dep.curWatcher) {
          dep.collectDep(`${path}____proxy`);
          dep.collectDep(`${path}__${String(property)}`);
        }

        return Reflect.get(target, property);
      },
      set(target: any, property: string, value: any, receiver: any): boolean {
        if (target[property] === value) {
          return true;
        }

        let arrArgs: ArrArgs = {
          receiver: null,
          property: "",
          value: null,
        };

        // 目标是数组的handler
        if (isArray(target)) {
          arrArgs = { receiver, property, value };
        }
        // 如果元素是新加入的，就把所有订阅分发给新元素
        if (target[property] === undefined) {
          dep.copyDep(`${path}`, `${path}__${property}`);
        }

        dep.beforeNotfiy(`${path}__${property}`);

        target[property] = new Observer(value, `${path}__${property}`).getData();

        Reflect.set(target, property, target[property]);

        dep.notfiy(`${path}__${property}`, arrArgs);

        return true;
      },
    };

    const proxy: ProxyConstructor = new Proxy(data, handler);
    // 添加 proxy 对象标志属性 __proxy
    Reflect.defineProperty(data, "__proxy", {
      value: 1,
      writable: false,
      enumerable: false,
      configurable: false,
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
