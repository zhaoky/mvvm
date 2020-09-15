import { isObject, isElement } from "./utils";
import Compiler from "./compiler";
import Observer from "./observer";

export interface MVVMClass {
  $data: Record<string, any>;
  [x: string]: any;
}
export interface MVVMOption {
  /**
   * mvvm根节点
   *
   * @type {HTMLElement}
   * @memberof MVVMOption
   */
  view: HTMLElement;
  /**
   * 初始data对象
   *
   * @type {Record<string, any>}
   * @memberof MVVMOption
   */
  model: Record<string, any>;
  /**
   * 包含方法队列的对象
   *
   * @type {Record<string, any>}
   * @memberof MVVMOption
   */
  methods?: Record<string, any>;
  /**
   * MVVM加载完成后的回调
   *
   * @memberof MVVMOption
   */
  mounted?: () => void;
}
/**
 * MVVM入口
 *
 * @export
 * @class MVVM
 */
export default class MVVM implements MVVMClass {
  /**
   * 数据模型对象
   *
   * @type {any}
   * @memberof MVVM
   */
  public $data: Record<string, any> = {};
  /**
   * _proxy 函数
   *
   * @private
   * @return {void}
   * @memberof Compiler
   */
  private _proxy(): void {
    const keys: string[] = Object.keys(this.$data);
    let i: number = keys.length;

    while (i--) {
      const key: string = keys[i];

      Object.defineProperty(this, key, {
        enumerable: true,
        configurable: true,
        get: (): string => {
          return this.$data[key];
        },
        set: (val: string) => {
          this.$data[key] = val;
        },
      });
    }
  }
  /**
   *Creates an instance of MVVM.
   * @param {MvvmOptionInterface} option
   * @memberof MVVM
   */
  public constructor(option: MVVMOption) {
    if (!isObject(option)) {
      throw Error("data must be object.");
    }
    if (!option.view || (!!option.view && !isElement(option.view))) {
      throw Error("data.view must be HTMLDivElement.");
    }
    if (!option.model || (!!option.model && !isObject(option.model))) {
      throw Error("data.model must be object.");
    }

    //* ** 这里进入数据监听模块 ***/
    this.$data = option.model = new Observer(option.model, `__data`).getData();

    this._proxy();

    new Compiler(option, this);
  }
}
