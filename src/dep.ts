import { WatcherClass } from "./watcher";
import { ArrArgs } from "./observer";

export interface DepClass {
  depCenter: Record<string, Set<WatcherClass>>;
  collectDep(path: string): void;
  addDep(path: string, dep: WatcherClass): void;
  removeDep(path: string, dep: WatcherClass): void;
  beforeNotfiy(key: string): void;
  notfiy(key: string, arrArgs: ArrArgs): void;
  copyDep(arrayPath: string, path: string): void;
}
/**
 * 发布订阅中心
 *
 * @class Dep
 */
export default class Dep implements DepClass {
  /**
   * 订阅中心(该对象收集到的需要通知 path 及对应 watcher（节点）列表)
   *
   * @type {Record<string, Set<WatcherClass>>}
   * @memberof Dep
   */
  public depCenter: Record<string, Set<WatcherClass>> = {};
  /**
   * 当前watcher
   *
   * @static
   * @type {WatcherClass}
   * @memberof Dep
   */
  public static curWatcher: WatcherClass | null = null;
  /**
   * 为 watcher 收集订阅者
   *
   * @param {String} path
   * @param {WatcherClass} dep
   * @memberof Dep
   */
  public collectDep(path: string): void {
    if (!this.depCenter[path]) {
      this.depCenter[path] = new Set();
    }
    Dep.curWatcher!.addDeps(path, this);
  }
  /**
   * 添加订阅者
   *
   * @param {String} path
   * @param {WatcherClass} dep
   * @memberof Dep
   */
  public addDep(path: string, dep: WatcherClass): void {
    if (!this.depCenter[path]) {
      this.depCenter[path] = new Set();
    }
    this.depCenter[path].add(dep);
  }

  /**
   * 移除订阅者
   *
   * @param {String} path
   * @param {WatcherClass} dep
   * @memberof Dep
   */
  public removeDep(path: string, dep: WatcherClass): void {
    this.depCenter[path].delete(dep);
  }
  /**
   * 通知订阅者（之前）
   *
   * @param {String} key
   * @return {void}
   * @memberof Dep
   */
  public beforeNotfiy(key: string): void {
    if (!this.depCenter[key]) {
      return;
    }
    this.depCenter[key].forEach((item: WatcherClass): void => {
      item.beforeUpdate();
    });
  }
  /**
   * 通知订阅者
   *
   * @param {string} key
   * @param {ArrArgs} arrArgs
   * @return {void}
   * @memberof Dep
   */
  public notfiy(key: string, arrArgs: ArrArgs): void {
    if (!this.depCenter[key]) {
      return;
    }
    this.depCenter[key].forEach((item: WatcherClass): void => {
      item.update(arrArgs);
    });
  }
  /**
   * 复制订阅列表到数组的新子元素里
   *
   * @param {string} arrayPath [数组path]
   * @param {string} path [新子元素path]
   * @memberof Dep
   */
  public copyDep(arrayPath: string, path: string): void {
    const arrayDep = this.depCenter[`${arrayPath}____proxy`];
    if (arrayDep) {
      arrayDep.forEach((item: WatcherClass): void => {
        this.addDep(path, item);
      });
    }
  }
}
