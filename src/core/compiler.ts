import { CompilerInterface, MvvmOptionInterface, CollectDirOptionInterface, ParserBaseInterface, ParserOnInterface, ParserOptionInterface } from "./interface";
import { isFunction, isObject, isElement, isDirective, removeAttr, nodeToFragment, hasDirective, hasLateCompileChilds } from "./utils";
import Observer from "./observer";
import TextParser from "./parser/text";
import StyleParser from "./parser/style";
import ClassParser from "./parser/class";
import ForParser from "./parser/for";
import OnParser from "./parser/on";
import ModelParser from "./parser/model";
import DisplayParser from "./parser/display";
import IfParser from "./parser/if";
import OtherParser from "./parser/other";
import Watcher from "./watcher";

/**
 * 编译器
 *
 * @class Compiler
 */
export default class Compiler implements CompilerInterface {
  /**
   * 编译根节点
   *
   * @private
   * @type {HTMLElement}
   * @memberof Compiler
   */
  private $element: HTMLElement = null;
  /**
   * 编译完成后的回调
   *
   * @private
   * @memberof Compiler
   */
  private $mounted: () => void;
  /**
   * document缓存片段节点
   *
   * @private
   * @type {DocumentFragment}
   * @memberof Compiler
   */
  private $fragment: DocumentFragment = null;
  /**
   * 数据模型对象
   *
   * @private
   * @type {Record<string, any>}
   * @memberof Compiler
   */
  public $data: Record<string, any> = null;
  /**
   * 指令缓存队列
   *
   * @type {[HTMLElement, Record<string, any>][]}
   * @memberof Compiler
   */
  public $queue: [HTMLElement, Record<string, any>][] = [];
  /**
   *Creates an instance of Compiler.
   * @param {MvvmOptionInterface} option
   * @memberof Compiler
   */
  public constructor(option: MvvmOptionInterface) {
    this.$element = option.view;
    this.$mounted = option.mounted;

    //* ** 这里进入数据监听模块 ***/
    this.$data = option.model = new Observer(option.model, `__${new Date().getTime()}__data`).getData();

    if (isObject(option.methods)) {
      const _eventHandler = (option.model["_eventHandler"] = {});
      const methods = option.methods;

      const keys = Object.keys(methods);

      keys.forEach((key: string): void => {
        (_eventHandler as Record<string, any>)[key] = methods[key];
      });
    }

    this.$fragment = nodeToFragment(this.$element);
    this.collectDir({ element: this.$fragment, isRoot: true, scope: undefined, isInit: true });
  }
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
  public collectDir({ element, isRoot, scope, isInit }: CollectDirOptionInterface): void {
    if (isRoot && hasDirective(element as Node)) {
      this.$queue.push([element as HTMLElement, scope]);
    }

    const children = element.childNodes;
    const childrenLen = children.length;

    for (let i = 0; i < childrenLen; i++) {
      const node = children[i];
      const nodeType = node.nodeType;

      if (nodeType !== 1 && nodeType !== 3) {
        continue;
      }
      if (hasDirective(node as HTMLElement)) {
        this.$queue.push([node as HTMLElement, scope]);
      }
      if (node.hasChildNodes() && !hasLateCompileChilds(node as HTMLElement)) {
        this.collectDir({ element: node as HTMLElement, isRoot: false, scope });
      }
    }

    if (isRoot) {
      for (let i = 0; i < this.$queue.length; i++) {
        this.compileNode(this.$queue[i]);
        this.$queue.splice(i, 1);
        i--;
      }
      this.completed(isInit);
    }
  }
  /**
   * 编译收集到的每一个节点
   * 提取指令交给不同的编译器编译
   * @param {Array} queueItem
   * @memberof Compiler
   */
  public compileNode(queueItem: [HTMLElement, Record<string, any>]): void {
    const node = queueItem[0] as HTMLElement;
    const scope = queueItem[1] as Record<string, any>;

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
      attrs.map((at: Attr): void => {
        this.parseAttr(node, at, scope);
      });
    } else {
      this.parseText(node, scope);
    }
  }
  /**
   * 解析元素节点收集到的每个指令
   * 解析器只做好两件事：1.将刷新函数订阅到 Model 的变化监测中；2.初始状态更新
   * @param {HTMLElement} node [node节点]
   * @param {Attr} attr [属性]
   * @param {Record<string, any>} scope [数组item作用域]
   * @memberof Compiler
   */
  public parseAttr(node: HTMLElement, attr: Attr, scope: Record<string, any>): void {
    const name: string = attr.name;
    const dirName: string = name.substr(2);
    const dirValue: string = attr.value.trim();
    removeAttr(node, name);

    const parser = this.selectParsers({ node, dirName, dirValue, cs: this });

    if (/^on:.+$/.test(dirName)) {
      (parser as ParserOnInterface).parseEvent(scope);
      return;
    }
    const watcher = new Watcher(parser as ParserBaseInterface, scope);

    (parser as ParserBaseInterface).watcher = watcher;

    (parser as ParserBaseInterface).update({ newVal: watcher.value, scope });
  }
  /**
   * 解析指令为文本节点
   *
   * @param {HTMLElement} node [node节点]
   * @param {Record<string, any>} scope [数组item作用域]
   * @memberof Compiler
   */
  public parseText(node: HTMLElement, scope: Record<string, any>): void {
    const reg = /(\{\{.*?(?=\}\})\}\})/g;
    const text = node.textContent;
    let dirValue = "";

    !(function parse(preIndex: number): any {
      const result = reg.exec(text);
      if (result === null) {
        return;
      }
      const index = result.index;
      const slot = result[1].substr(2, result[1].length - 4);
      const str = text.substring(preIndex, index);
      dirValue = dirValue + `'${str}'+` + `( ${slot} )+`;
      const lastIndex = index + result[1].length;
      parse(lastIndex);
    })(0);
    dirValue = `${dirValue.substring(0, dirValue.length - 1)}`;
    const parser = new TextParser({ node, dirValue, cs: this });
    const watcher = new Watcher(parser as ParserBaseInterface, scope);
    (parser as ParserBaseInterface).update({ newVal: watcher.value, scope });
  }
  /**
   * 根据不同指令选择不同的解析器
   *
   * @param {ParserOptionInterface} { node, dirName, dirValue, cs }
   * @return {Record<string, any>}
   * @memberof Compiler
   */
  public selectParsers({ node, dirName, dirValue, cs }: ParserOptionInterface): ParserBaseInterface | ParserOnInterface {
    let parser: ParserBaseInterface | ParserOnInterface;
    let name: string = dirName;
    if (/^on:.+$/.test(name)) {
      name = "on";
    }
    if (["show", "hide"].indexOf(name) > -1) {
      name = "display";
    }
    switch (name) {
      case "text":
        parser = new TextParser({ node, dirValue, cs });
        break;
      case "style":
        parser = new StyleParser({ node, dirValue, cs });
        break;
      case "class":
        parser = new ClassParser({ node, dirValue, cs });
        break;
      case "for":
        parser = new ForParser({ node, dirValue, cs });
        break;
      case "on":
        parser = new OnParser({ node, dirName, dirValue, cs });
        break;
      case "display":
        parser = new DisplayParser({ node, dirName, dirValue, cs });
        break;
      case "if":
        parser = new IfParser({ node, dirValue, cs });
        break;
      case "model":
        parser = new ModelParser({ node, dirValue, cs });
        break;
      default:
        parser = new OtherParser({ node, dirName, dirValue, cs });
    }

    return parser;
  }
  /**
   * 收集、编译，解析完成后
   *
   * @param {Boolean} isInit [首次加载]
   * @memberof Compiler
   */
  public completed(isInit: boolean): void {
    if (!isInit) {
      return;
    }

    this.$element.appendChild(this.$fragment);
    delete this.$fragment;

    if (isFunction(this.$mounted)) {
      this.$mounted();
    }
  }
}
