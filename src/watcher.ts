import { cloneDeep } from "./utils";
import Dep from "./dep";
import { ArrArgs } from "./observer";
import { ParserBaseClass } from "./parser/base";
let id = 0;
interface targetDictionary extends Record<string, any> {
  __proxy: 1;
}
export interface WatcherClass {
  value: any;
  beforeUpdate(): void;
  update(args?: any): void;
  set(value: any): void;
  get(): any;
  addDeps(...args: any[]): any;
}
interface DepWatcher {
  depCenterList: Set<any>;
  depMap: Record<string, Set<any>>;
}

/**
 * watcher 类
 * - 每一个 parser 对应一个 watcher
 * - 一个 dom 节点上可能不止一个 parser
 * - 意味着一个 dom 可能有多个订阅 watcher
 * - 一旦触发 watcher 更新，则会通知该 dom 进行更新操作
 *
 * @class Watcher
 */
export default class Watcher implements WatcherClass {
  /**
   * 数组item的作用域
   *
   * @private
   * @type {Record<string, any> | null}
   * @memberof Watcher
   */
  private scope: Record<string, any> | null = null;
  /**
   * 对应指令的解析器
   *
   * @private
   * @type {ParserBaseClass}
   * @memberof Watcher
   */
  private parser: ParserBaseClass;
  /**
   * 旧值
   *
   * @private
   * @type {*}
   * @memberof Watcher
   */
  private oldVal: any = null;
  /**
   * 通过getter获取到的最新值
   *
   * @type {any}
   * @memberof Watcher
   */
  public value: any = null;
  /**
   * 老的依赖 deps 列表
   *
   * @private
   * @type {array}
   * @memberof path[]
   */
  private deps: DepWatcher = {
    depCenterList: new Set(),
    depMap: {},
  };
  /**
   * 新的依赖 deps 列表
   *
   * @private
   * @type {array}
   * @memberof path[]
   */
  private newDeps: DepWatcher = {
    depCenterList: new Set(),
    depMap: {},
  };
  /**
   * getter 函数
   *
   * @private
   * @param {string} expression
   * @return {Function}
   * @memberof Watcher
   */
  private _getter(expression: string) {
    try {
      return new Function("scope", `with(scope){return ${expression}};`);
    } catch {
      throw Error(`The attribute value:'${expression}' error parsing.`);
    }
  }
  /**
   * 深度递归订阅遍历
   *
   * @private
   * @param {any} target
   * @return {void}
   * @memberof Watcher
   */
  private _walkThrough<T extends targetDictionary>(target: T): void {
    if (target.__proxy !== 1) {
      return;
    }
    const keys: string[] = Object.getOwnPropertyNames(target);

    for (let i = 0; i < keys.length; i++) {
      this._walkThrough(target[keys[i]]);
    }
  }
  private id = 0;
  /**
   * 通过访问层级取值
   *
   * @param {*} target
   * @param {*} paths
   * @return {*}
   */
  private _getDeepValue<T extends Record<string, any>>(target: T, paths: string[]): T {
    while (paths.length) {
      target = target[paths.shift()!];
    }
    return target;
  }
  /**
   *Creates an instance of Watcher.
   * @param {ParserBaseClass} parser [解析器]
   * @param {Record<string, any>} scope [item作用域]
   * @memberof Watcher
   */
  public constructor(parser: ParserBaseClass, scope: Record<string, any> | null) {
    this.parser = parser;
    this.scope = scope;
    this.value = this.get();
    this.id = ++id;
  }
  /**
   * 更新前执行的函数（深拷贝得到原始值）
   *
   * @memberof Watcher
   */
  public beforeUpdate(): void {
    this.oldVal = cloneDeep(this.value);
  }
  /**
   * 更新方法
   *
   * @param {ArrArgs} [arrArgs]
   * @memberof Watcher
   */
  public update(arrArgs: ArrArgs): void {
    // 添加订阅列表
    const newVal = (this.value = this.get());

    (this.parser.update as any).call(this.parser, { newVal, oldVal: this.oldVal, scope: this.scope, arrArgs });
  }
  /**
   * 1.获取最新值
   * 2.把watcher与值绑定,通知到每一个相关属性，加入到对应的订阅列表
   * @return {any}
   * @memberof Watcher
   */
  public get(): any {
    Dep.curWatcher = this;

    const value: any = this._getter(this.parser.dirValue!)(this.scope || this.parser.cs!.ms!.$data);

    // 深度订阅，将目标属性值的订阅列表递归分发给所有子元素
    if (value && this.parser.deep) {
      this._walkThrough(value);
    }

    Dep.curWatcher = null;

    // 清除无用依赖
    this.removeDeps();

    this.deps = cloneDeep(this.newDeps);
    this.newDeps = {
      depCenterList: new Set(),
      depMap: {},
    };
    return value;
  }
  /**
   * 设置双向绑定值
   *
   * @param {any} value
   * @memberof Watcher
   */
  public set(value: any): void {
    let pathList: string[] = this.parser.dirValue!.split(/[\.\]\[]/g);

    pathList = pathList.filter((item: string): boolean => {
      return item !== "";
    });

    const key: string = pathList.pop()!;
    const data: Record<string, any> = this._getDeepValue(this.parser.cs!.ms!.$data, pathList);

    data[key] = value;
  }
  /**
   * 添加依赖
   * @param {string} path [model路径]
   * @param {any} dep [依赖]
   */
  public addDeps(path: string, dep: Dep): void {
    this.newDeps.depCenterList.add(dep);

    if (!this.newDeps.depMap[path]) {
      this.newDeps.depMap[path] = new Set();
    }
    this.newDeps.depMap[path].add(dep.depCenter);
    dep.addDep(path, this);
    // if (!this.deps.depMap[path]) {
    //   dep.addDep(path, this);
    // }
  }
  /**
   * 移除依赖
   *
   * @memberof Watcher
   */
  public removeDeps(): void {
    const paths: string[] = Object.keys(this.deps.depMap);
    const newPaths: string[] = Object.keys(this.newDeps.depMap);
    const depCenterList: Set<Dep> = this.deps.depCenterList;
    const removePath: string[] = paths.filter((i) => !newPaths.includes(i));

    removePath.forEach((path) => {
      depCenterList.forEach((center) => {
        const keys = Object.keys(center.depCenter);
        const values = Object.values(center.depCenter);
        if (keys.includes(path)) {
          center.removeDep(path, this);
          if (values.every((i) => i.size === 0)) {
            depCenterList.delete(center);
          }
        }
      });
    });
  }
}
