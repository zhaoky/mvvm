import { WatcherInterface } from "@/interface";
/**
 * 发布订阅中心
 *
 * @class Dep
 */
export default class Dep {
  /**
   * 订阅者列表(该属性收集到的需要通知的watcher（节点）列表)
   *
   * @type {Record<string, Set<WatcherInterface>>}
   * @memberof Dep
   */
  public dependList: Record<string, Set<WatcherInterface>> = null;
  /**
   * 当前watcher
   *
   * @static
   * @type {WatcherInterface}
   * @memberof Dep
   */
  public static curWatcher: WatcherInterface = null;

  /**
   *Creates an instance of Dep.
   * @memberof Dep
   */
  public constructor() {
    this.dependList = {};
  }
  /**
   * 添加订阅者
   *
   * @param {String} path
   * @param {WatcherInterface} dep
   * @memberof Dep
   */
  public addDep(path: string, dep: WatcherInterface): void {
    if (!this.dependList[path]) {
      this.dependList[path] = new Set();
    }
    this.dependList[path].add(dep);
  }
  /**
   * 通知订阅者（之前）
   *
   * @param {String} key
   * @return {void}
   * @memberof Dep
   */
  public beforeNotfiy(key: string): void {
    if (!this.dependList[key]) {
      return;
    }
    this.dependList[key].forEach((item: WatcherInterface): void => {
      item.beforeUpdate();
    });
  }
  /**
   * 通知订阅者
   *
   * @param {string} key
   * @param {*} arrArgs
   * @return {void}
   * @memberof Dep
   */
  public notfiy(key: string, arrArgs: any): void {
    if (!this.dependList[key]) {
      return;
    }
    this.dependList[key].forEach((item: WatcherInterface): void => {
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
  public copyArrayWatcherDep(arrayPath: string, path: string): void {
    const arrayDep = this.dependList[`${arrayPath}____proxy`];
    if (arrayDep) {
      arrayDep.forEach((item: WatcherInterface): void => {
        this.addDep(path, item);
      });
    }
  }
}
