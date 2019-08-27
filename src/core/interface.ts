export interface Node {
  [x: string]: any;
}
export interface CompilerInterface {
  /**
   * 数据模型对象
   *
   * @private
   * @type {Record<string, any>}
   * @memberof Compiler
   */
  $data: Record<string, any>;
  /**
   * 指令缓存队列
   *
   * @type {[HTMLElement, Record<string, any>][]}
   * @memberof Compiler
   */
  $queue: [HTMLElement, Record<string, any>][];
  /**
   * 收集节点所有需要编译的指令
   * 并在收集完成后编译指令列表
   * @param {CollectDirOptionInterface} { element, isRoot, scope, isInit }
   * @param {HTMLElement} element [要收集指令的dom节点]
   * @param {Boolean} isRoot [是否是根节点]
   * @param {Record<string, any>} scope [v-for作用域]
   * @param {Boolean} isInit [首次加载]
   * @memberof Compiler
   */
  collectDir: ({ element, isRoot, scope, isInit }: CollectDirOptionInterface) => void;
  /**
   * 编译收集到的每一个节点
   * 提取指令交给不同的编译器编译
   * @param {Array} queueItem
   * @memberof Compiler
   */
  compileNode: (item: [HTMLElement, Record<string, any>]) => void;
  /**
   * 解析元素节点收集到的每个指令
   * 解析器只做好两件事：1.将刷新函数订阅到 Model 的变化监测中；2.初始状态更新
   * @param {HTMLElement} node [node节点]
   * @param {Attr} attr [属性]
   * @param {Record<string, any>} scope [数组item作用域]
   * @memberof Compiler
   */
  parseAttr: (node: HTMLElement, attr: Record<string, any>, scope: Record<string, any>) => void;
  /**
   * 解析指令为文本节点
   *
   * @param {HTMLElement} node [node节点]
   * @param {Record<string, any>} scope [数组item作用域]
   * @memberof Compiler
   */
  parseText: (node: HTMLElement, scope: Record<string, any>) => void;
  /**
   * 根据不同指令选择不同的解析器
   *
   * @param {ParserOptionInterface} { node, dirName, dirValue, cs }
   * @return {Record<string, any>}
   * @memberof Compiler
   */
  selectParsers: ({ node, dirName, dirValue, cs }: ParserOptionInterface) => Record<string, any>;
  /**
   * 收集、编译，解析完成后
   *
   * @param {Boolean} isInit [首次加载]
   * @memberof Compiler
   */
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
  /**
   * 要收集指令的dom节点
   *
   * @type {(HTMLElement | DocumentFragment | Node)}
   * @memberof CollectDirOptionInterface
   */
  element: HTMLElement | DocumentFragment | Node;
  /**
   * 是否是根节点
   *
   * @type {boolean}
   * @memberof CollectDirOptionInterface
   */
  isRoot: boolean;
  /**
   * v-for作用域
   *
   * @type {Record<string, any>}
   * @memberof CollectDirOptionInterface
   */
  scope: Record<string, any>;
  /**
   * 首次加载
   *
   * @type {boolean}
   * @memberof CollectDirOptionInterface
   */
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
   * Watcher
   *
   * @type {WatcherInterface}
   * @memberof ParserBaseInterface
   */
  watcher?: WatcherInterface;
  /**
   * 更新函数
   *
   * @memberof ParserBaseInterface
   */
  update?: ({ newVal, oldVal, args, scope }: ParseUpdateOptionInterface) => void;
}
export interface ParserOnInterface {
  /**
   * 解析事件绑定函数
   *
   * @param {Record<string, any>} scope
   * @memberof ParserOnInterface
   */
  parseEvent(scope: Record<string, any>): void;
}
export interface OnHandlerInterface {
  (scope: Record<string, any>, e: Event): void;
}
export interface ParseUpdateOptionInterface {
  /**
   * 新值
   *
   * @type {*}
   * @memberof ParseUpdateOptionInterface
   */
  newVal: any;
  /**
   * 旧值
   *
   * @type {*}
   * @memberof ParseUpdateOptionInterface
   */
  oldVal?: any;
  /**
   * v-for作用域
   *
   * @type {Record<string, any>}
   * @memberof ParseUpdateOptionInterface
   */
  scope?: Record<string, any>;
  /**
   * v-for的额外参数
   *
   * @type {*}
   * @memberof ParseUpdateOptionInterface
   */
  args?: any;
}
export interface WatcherInterface {
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
  /**
   * 设置双向绑定值
   *
   * @param {*} value
   * @memberof WatcherInterface
   */
  set(value: any): void;
  /**
   * 1.获取最新值
   * 2.把watcher与值绑定,通知到每一个相关属性，加入到对应的订阅列表
   *
   * @returns {*}
   * @memberof WatcherInterface
   */
  get(): any;
}
