export interface Node {
  [x: string]: any;
}
export interface CompilerInterface {
  $data: Record<string, any>;
  $queue: [HTMLElement, Record<string, any>][];
  collectDir: ({ element, isRoot, scope, isInit }: CollectDirOptionInterface) => void;
  compileNode: (item: [HTMLElement, Record<string, any>]) => void;
  parseAttr: (node: HTMLElement, attr: Record<string, any>, scope: Record<string, any>) => void;
  parseText: (node: HTMLElement, scope: Record<string, any>) => void;
  selectParsers: ({ node, dirName, dirValue, cs }: ParserOptionInterface) => Record<string, any>;
  completed: (isInit: boolean) => void;
}
export interface MvvmOptionInterface {
  /**
   * mvvm根节点
   *
   * @type {HTMLElement}
   * @memberof MvvmOptionInterface
   */
  view: HTMLElement;
  /**
   * 初始data对象
   *
   * @type {Record<string, any>}
   * @memberof MvvmOptionInterface
   */
  model: Record<string, any>;
  /**
   * 包含方法队列的对象
   *
   * @type {Record<string, any>}
   * @memberof MvvmOptionInterface
   */
  methods?: Record<string, any>;
  /**
   * MVVM加载完成后的回调
   *
   * @memberof MvvmOptionInterface
   */
  mounted?: () => void;
}
export interface CollectDirOptionInterface {
  element: HTMLElement | DocumentFragment | Node;
  isRoot: boolean;
  scope: Record<string, any>;
  isInit?: boolean;
}
export interface ParserOptionInterface {
  /**
   * 包含指令的节点
   *
   * @type {HTMLElement}
   * @memberof ParserOptionInterface
   */
  node: HTMLElement;
  /**
   * 指令名称
   *
   * @type {string}
   * @memberof ParserOptionInterface
   */
  dirName?: string;
  /**
   * 指令值
   *
   * @type {string}
   * @memberof ParserOptionInterface
   */
  dirValue: string;
  /**
   * Compiler
   *
   * @type {CompilerInterface}
   * @memberof ParserOptionInterface
   */
  cs: CompilerInterface;
}
export interface ParserBaseInterface {
  /**
   * 包含指令的节点
   *
   * @type {HTMLElement}
   * @memberof ParserBaseInterface
   */
  el: HTMLElement;
  /**
   * 指令名称
   *
   * @type {string}
   * @memberof ParserOptionInterface
   */
  dirName?: string;
  /**
   * 指令值
   *
   * @type {string}
   * @memberof ParserOptionInterface
   */
  dirValue?: string;
  /**
   * Compiler
   *
   * @type {CompilerInterface}
   * @memberof ParserBaseInterface
   */
  cs: CompilerInterface;
  /**
   * 是否为深度依赖
   *
   * @type {boolean}
   * @memberof ParserBaseInterface
   */
  deep?: boolean;
  /**
   * 更新函数
   *
   * @memberof ParserBaseInterface
   */
  update?: ({ newVal, oldVal, args, scope }: ParseUpdateOptionInterface) => void;
}
export interface ParserOnInterface {
  parseEvent(scope: Record<string, any>): void;
  getHandler(expression: string): OnHandlerInterface;
  addEvent(): void;
}
export interface OnHandlerInterface {
  (scope: Record<string, any>, e: Event): void;
}
export interface ParseUpdateOptionInterface {
  newVal: any;
  oldVal?: any;
  scope?: Record<string, any>;
  args?: any;
}
export interface WatcherInterface {
  /**
   * 更新前的值
   *
   * @type {*}
   * @memberof WatcherInterface
   */
  oldVal: any;
  /**
   * 对应指令的解析器
   *
   * @type {ParserBaseInterface}
   * @memberof WatcherInterface
   */
  parser: ParserBaseInterface;
  /**
   * 数组item的作用域
   *
   * @type {Record<string, any>}
   * @memberof WatcherInterface
   */
  scope: Record<string, any>;
  /**
   * 通过getter获取到的最新值
   *
   * @type {*}
   * @memberof WatcherInterface
   */
  value: any;
  /**
   * 更新前执行的函数（深拷贝得到原始值）
   *
   * @memberof WatcherInterface
   */
  beforeUpdate(): void;
  /**
   * 更新函数
   *
   * @param {any} [args]
   * @memberof WatcherInterface
   */
  update(args?: any): void;
}
