import { CompilerClass } from "../compiler";
import { WatcherClass } from "../watcher";
import { ArrArgs } from "../observer";
export interface ParserBaseClass {
  el?: HTMLElement | HTMLInputElement;
  dirName?: string;
  dirValue?: string;
  cs?: CompilerClass;
  deep?: boolean;
  watcher: WatcherClass | null;
  update?: ({ newVal, oldVal, arrArgs, scope }: ParseUpdateOption) => void;
  parseEvent?: (scope: Record<string, any> | null) => void;
}
export interface ParseUpdateOption {
  /**
   * 新值
   *
   * @type {any}
   * @memberof ParseUpdateOption
   */
  newVal: any;
  /**
   * 旧值
   *
   * @type {any}
   * @memberof ParseUpdateOption
   */
  oldVal?: any;
  /**
   * v-for作用域
   *
   * @type {Record<string, any> | null}
   * @memberof ParseUpdateOption
   */
  scope?: Record<string, any> | null;
  /**
   * v-for的额外参数
   *
   * @type {any}
   * @memberof ParseUpdateOption
   */
  arrArgs?: ArrArgs;
}
export interface ParserOption {
  /**
   * 包含指令的节点
   *
   * @type {HTMLElement}
   * @memberof ParserOption
   */
  node?: HTMLElement;
  /**
   * 指令名称
   *
   * @type {string}
   * @memberof ParserOption
   */
  dirName?: string;
  /**
   * 指令值
   *
   * @type {string}
   * @memberof ParserOption
   */
  dirValue?: string;
  /**
   * 数组 item 作用域
   *
   * @type {Record<string, any> | null}
   * @memberof ParseAttrOption
   */
  cs?: CompilerClass;
}
/**
 * 基类
 *
 * @class BaseParser
 */
export default class BaseParser implements ParserBaseClass {
  /**
   * 包含指令的节点
   *
   * @type {HTMLElement}
   * @memberof BaseParser
   */
  public el?: HTMLElement;
  /**
   * 指令名称
   *
   * @type {string}
   * @memberof BaseParser
   */
  public dirName?: string;
  /**
   * 指令值
   *
   * @type {string}
   * @memberof BaseParser
   */
  public dirValue?: string;
  /**
   * Compiler
   *
   * @type {CompilerClass}
   * @memberof BaseParser
   */
  public cs?: CompilerClass;
  /**
   * watcher 类
   *
   * @private
   * @type {(WatcherClass | null)}
   * @memberof ModelParser
   */
  public watcher: WatcherClass | null = null;
  /**
   * Creates an instance of BaseParser.
   * @param {ParserOption} option
   * @param {HTMLElement} option.node [包含指令的 dom 节点]
   * @param {String} option.dirName [指令名称]
   * @param {String} option.dirValue [指令值]
   * @param {CompilerClass} option.cs [CompilerClass]
   * @memberof BaseParser
   */
  public constructor({ node, dirName, dirValue, cs }: ParserOption) {
    node && (this.el = node!);
    dirName && (this.dirName = dirName);
    dirValue && (this.dirValue = dirValue);
    cs && (this.cs = cs!);
  }
}
