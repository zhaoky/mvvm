import { cloneDeep } from "./utils";
import { ParserBaseInterface, WatcherInterface } from "./interface";
import Dep from "./dep";

/**
 * 给监听属性添加watcher
 *
 * @class Watcher
 */
export default class Watcher implements WatcherInterface {
  public oldVal: any = null;
  public parser: ParserBaseInterface;
  public scope: Record<string, any> = null;
  public value: any = null;
  /**
   *Creates an instance of Watcher.
   * @param {ParserBaseInterface} parser [解析器]
   * @param {Record<string, any>} scope [item作用域]
   * @memberof Watcher
   */
  public constructor(parser: ParserBaseInterface, scope: Record<string, any>) {
    this.parser = parser;
    this.scope = scope;
    this.value = this.get();
  }

  /**
   * getter 函数
   *
   * @private
   * @param {string} expression
   * @return {Function}
   * @memberof Watcher
   */
  private _getter(expression: string): Function {
    try {
      return new Function("scope", `with(scope){return ${expression}};`);
    } catch {
      throw Error(`The attribute value:'${expression}' must be not keyword.`);
    }
  }
  /**
   * 深度订阅遍历
   *
   * @private
   * @param {any} target
   * @return {void}
   * @memberof Watcher
   */
  private _walkThrough(target: any): void {
    if (target.__isProxy !== 1) {
      return;
    }
    const keys = Object.getOwnPropertyNames(target);

    for (let i = 0; i < keys.length; i++) {
      this._walkThrough(target[keys[i]]);
    }
  }
  /**
   * 1.获取最新值
   * 2.把watcher与值绑定,通知到每一个相关属性，加入到对应的订阅列表
   * @private
   * @return {any}
   * @memberof Watcher
   */
  private get(): any {
    Dep.curWatcher = this;

    const value = this._getter(this.parser.dirValue)(this.scope || this.parser.cs.$data);

    // 深度订阅，将目标属性值的订阅列表递归分发给所有子元素
    if (this.parser.deep) {
      this._walkThrough(value);
    }

    Dep.curWatcher = null;
    return value;
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
   * 更新函数
   *
   * @param {*} [args]
   * @memberof Watcher
   */
  public update(args?: any): void {
    // 添加订阅列表
    const newVal = (this.value = this.get());
    this.parser.update.call(this.parser, { newVal, oldVal: this.oldVal, args });
  }
}
