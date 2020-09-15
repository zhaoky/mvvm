import { dirNameHasOn, isFunction, isObject, isElement, isDirective, removeAttr, nodeToFragment, hasDirective, hasLateCompileChilds } from "./utils";
import TextParser from "./parser/text";
import StyleParser from "./parser/style";
import ClassParser from "./parser/class";
import ForParser from "./parser/for";
import OnParser from "./parser/on";
import ModelParser from "./parser/model";
import DisplayParser from "./parser/display";
import IfParser from "./parser/if";
import OtherParser from "./parser/other";
import Watcher, { WatcherClass } from "./watcher";
import { MVVMClass, MVVMOption } from "./mvvm";
import { ParserBaseClass } from "./parser/base";

type queueItem = [HTMLElement | Text, Record<string, any> | null];
interface CollectDirOption {
  element: HTMLElement | DocumentFragment;
  isRoot: boolean;
  scope?: Record<string, any> | null;
  isInit?: boolean;
}
export interface CompilerClass {
  $queue: queueItem[];
  ms: MVVMClass | null;
  collectDir: ({ element, isRoot, scope, isInit }: CollectDirOption) => void;
}
export interface CompilerParseOption {
  node: HTMLElement | Text;
  attr?: Attr;
  scope?: Record<string, any> | null;
  dirName?: string;
  dirValue?: string;
}
export interface ParserMaps {
  text: ParserBaseClass;
  style: ParserBaseClass;
  class: ParserBaseClass;
  for: ParserBaseClass;
  on: ParserBaseClass;
  model: ParserBaseClass;
  display: ParserBaseClass;
  if: ParserBaseClass;
  other: ParserBaseClass;
}
/**
 * 编译器
 *
 * @class Compiler
 */
export default class Compiler implements CompilerClass {
  /**
   * 编译根节点
   *
   * @private
   * @type {HTMLElement}
   * @memberof Compiler
   */
  private $rootElement: HTMLElement | null = null;
  /**
   * document缓存片段节点
   *
   * @private
   * @type {DocumentFragment}
   * @memberof Compiler
   */
  private $fragment: DocumentFragment | null = null;
  /**
   * 编译完成后的回调
   *
   * @private
   * @memberof Compiler
   */
  private $mounted?: () => void;
  /**
   * 解析元素节点收集到的每个指令
   *
   * @private
   * @param {CompilerParseOption} options
   * @param {HTMLElement} options.node [dom 节点]
   * @param {Attr} options.attr [dom 属性]
   * @param {Record<string, any> | null} options.scope [数组 item 作用域]
   * @return {void}
   * @memberof Compiler
   */
  private parseAttr({ node, attr, scope }: CompilerParseOption): void {
    const name: string = attr!.name;
    const dirName: string = name.substr(2);
    const dirValue: string = attr!.value.trim();

    removeAttr(<HTMLElement>node, name);

    this.parseHandler({ node, dirName, dirValue, scope });
  }
  /**
   * 解析指令为文本节点
   *
   * @private
   * @param {CompilerParseOption} options
   * @param {HTMLElement} options.node [dom 节点]
   * @param {Record<string, any> | null} options.scope [数组 item 作用域]
   * @memberof Compiler
   */
  private parseText({ node, scope }: CompilerParseOption): void {
    const reg = /(\{\{.*?(?=\}\})\}\})/g;
    const text: string = node.textContent!;
    let dirValue = "";

    !(function parse(preIndex: number): any {
      const result = reg.exec(text);

      if (result === null) {
        dirValue = `${dirValue}'${text.substr(preIndex)}'`;
        return;
      }

      const index: number = result.index;
      const slot: string = result[1].substr(2, result[1].length - 4);
      const str: string = (text as string).substring(preIndex, index);
      const lastIndex: number = index + result[1].length;

      dirValue = `${dirValue}'${str}'+( ${slot} )+`;

      parse(lastIndex);
    })(0);

    dirValue = dirValue.replace(/\n/g, "");

    this.parseHandler({ node, dirName: "text", dirValue, scope });
  }
  /**
   * - 编译收集到的每一个节点
   * - 提取指令交给不同的编译器编译
   *
   * @private
   * @param {queueItem} queueItem 指令
   * @memberof Compiler
   */
  private compileNode(queueItem: queueItem): void {
    const [node, scope] = queueItem;

    if (isElement(node)) {
      let attrs: Attr[] = [];
      const nodeAttrs: NamedNodeMap = node.attributes;
      const nodeAttrsLen: number = nodeAttrs.length;

      for (let i = 0; i < nodeAttrsLen; i++) {
        const attr: Attr = nodeAttrs[i];
        if (!isDirective(attr.name)) {
          continue;
        }
        if (attr.name === "v-for") {
          attrs = [attr];
          break;
        }
        attrs.push(attr);
      }
      attrs.map((attr: Attr): void => {
        this.parseAttr({ node, attr, scope });
      });
    } else {
      this.parseText({ node, scope });
    }
  }
  /**
   * 处理解析后的指令
   *
   * @private
   * @param {CompilerParseOption} options
   * @param {HTMLElement} options.node [dom 节点]
   * @param {string} options.dirName [指令名称]
   * @param {string} options.dirValue [dom 属性]
   * @param {Record<string, any> | null} options.scope [数组 item 作用域]
   * @memberof Compiler
   */
  private parseHandler({ node, dirName, dirValue, scope }: CompilerParseOption): void {
    // 根据不同指令选择不同的解析器
    const parser: ParserBaseClass = this.selectParsers({ node, dirName, dirValue });
    if (dirNameHasOn(dirName!)) {
      parser.parseEvent!(scope!);
      return;
    }
    // 建立解析器与数据模型的关系
    const watcher: WatcherClass = new Watcher(parser, scope!);

    parser.watcher = watcher;
    // 初始化视图更新
    parser.update!({ newVal: watcher.value, scope });
  }
  /**
   * 根据不同指令选择不同的解析器
   *
   * @private
   * @param {CompilerParseOption} options
   * @param {HTMLElement} options.node [dom 节点]
   * @param {string} options.dirName [指令名称]
   * @param {string} options.dirValue [dom 属性]
   * @return {ParserBaseClass}  [对应 parser 实例]
   * @memberof Compiler
   */
  private selectParsers({ node, dirName, dirValue }: CompilerParseOption): ParserBaseClass {
    let name: string = dirName!;

    if (/^on:.+$/.test(name)) {
      name = "on";
    }
    if (~["show", "hide"].indexOf(name)) {
      name = "display";
    }
    if (!["text", "style", "class", "for", "on", "display", "if", "model"].includes(name)) {
      name = "other";
    }

    const parserMap: any = {
      text: TextParser,
      style: StyleParser,
      class: ClassParser,
      for: ForParser,
      on: OnParser,
      model: ModelParser,
      display: DisplayParser,
      if: IfParser,
      other: OtherParser,
    };
    return new parserMap[name as keyof ParserMaps]({ node, dirName, dirValue, cs: this });
  }
  /**
   * 收集、编译，解析完成后
   *
   * @private
   * @param {Boolean} isInit [首次加载]
   * @memberof Compiler
   */
  private completed(isInit: boolean): void {
    if (!isInit) {
      return;
    }

    this.$rootElement!.appendChild(this.$fragment!);

    this.$fragment = null;

    if (isFunction(this.$mounted)) {
      this.$mounted.call(this.ms);
    }
  }
  /**
   * mvvm作用域
   *
   * @private
   * @type {Record<string, any>}
   * @memberof Compiler
   */
  public ms: MVVMClass | null = null;
  /**
   * 指令缓存队列
   *
   * @type {queueItem[]}
   * @memberof Compiler
   */
  public $queue: queueItem[] = [];
  /**
   *Creates an instance of Compiler.
   * @param {MVVMOption} option
   * @param {MVVMClass} ms
   * @memberof Compiler
   */
  public constructor(option: MVVMOption, ms: MVVMClass) {
    this.$rootElement = option.view;
    this.$mounted = option.mounted;
    this.ms = ms;

    if (isObject(option.methods)) {
      const __eventHandler: Record<string, any> = (option.model["__eventHandler"] = {});
      const methods: Record<string, any> = option.methods;
      const keys: string[] = Object.keys(methods);

      keys.forEach((key: string): void => {
        ms[key] = __eventHandler[key] = methods[key];
      });
    }

    this.$fragment = nodeToFragment(this.$rootElement!);
    this.collectDir({ element: this.$fragment, isRoot: true, isInit: true });
  }
  /**
   * - 收集节点所有需要编译的指令
   * - 并在收集完成后编译指令列表
   * @param {CollectDirOption} options
   * @param {HTMLElement} options.element [要收集指令的dom节点]
   * @param {Boolean} options.isRoot [是否是根节点]
   * @param {Object|null} options.scope [v-for作用域]
   * @param {Boolean} options.isInit [首次加载]
   * @memberof Compiler
   */
  public collectDir({ element, isRoot, scope = null, isInit }: CollectDirOption): void {
    if (isRoot && hasDirective(<ChildNode>element)) {
      this.$queue.push([<HTMLElement | Text>element, scope]);
    }

    const children = element.childNodes;
    const childrenLen: number = children.length;

    for (let i = 0; i < childrenLen; i++) {
      const node: ChildNode = children[i];
      const nodeType: number = node.nodeType;

      if (nodeType !== 1 && nodeType !== 3) {
        continue;
      }
      if (hasDirective(node)) {
        this.$queue.push([node, scope]);
      }
      if (node.hasChildNodes() && !hasLateCompileChilds(<HTMLElement>node)) {
        this.collectDir({ element: <HTMLElement>node, isRoot: false, scope });
      }
    }

    if (isRoot) {
      for (let i = 0; i < this.$queue.length; i++) {
        this.compileNode(this.$queue[i]);
        this.$queue.splice(i, 1);
        i--;
      }
      this.completed(isInit!);
    }
  }
}
