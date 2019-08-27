import { ParserOptionInterface, ParseUpdateOptionInterface, Node } from "./../interface";
import { isArray } from "./../utils";
import BaseParser from "./base";
import Observer from "./../observer";

/**
 * 派生类 ForParser
 *
 * @class ForParser
 * @extends {BaseParser}
 */
export default class ForParser extends BaseParser {
  private alias: string = "";
  private symbol: symbol = Symbol();
  private scopes: Record<string, any>[] = [];
  private parent: Node = null;
  private end: Node = null;
  private isInit: boolean = true;
  private $index: string = "";
  public deep: boolean = true;

  /**
   *Creates an instance of ForParser.
   * @param {ParserOptionInterface} { node, dirValue, cs }
   * @memberof ForParser
   */
  public constructor({ node, dirValue, cs }: ParserOptionInterface) {
    super({ node, dirValue, cs });

    this.parseValue(dirValue);

    this.parent = node.parentNode;

    if (this.parent.nodeType !== 1) {
      throw Error("v-for can't used in the root element!");
    }
    this.end = node.nextSibling;
  }
  /**
   * for更新函数
   *
   * @param {ParseUpdateOptionInterface} { newVal, args }
   * @return {void}
   * @memberof ForParser
   */
  public update({ newVal, args }: ParseUpdateOptionInterface): void {
    // 如果不是数组
    if (!newVal || !isArray(newVal)) {
      throw Error("v-for item type must be array!");
    }
    // 如果是首次渲染
    if (this.isInit) {
      const parentNode = this.el.parentNode;
      parentNode.replaceChild(this.buildList(newVal), this.el);
      this.isInit = false;
      return;
    }
    // 如果是整体构建
    if (args.isBuildIntegral === 1) {
      this.recompileList(newVal);
      return;
    }
    // 如果是某一项改变
    if (args.property !== "length") {
      const index: number = +args.property;
      const frag: any = this.buildItem(index, newVal);
      const children = this.getChlids();
      if (children.length < index + 1) {
        this.parent.insertBefore(frag, this.end);
      } else {
        this.parent.replaceChild(frag, children[index]);
      }
    } else {
      // 如果是长度改变
      this.recompileLength(args.value);
    }
  }

  /**
   * 解析value
   *
   * @private
   * @param {string} value
   * @memberof ForParser
   */
  private parseValue(value: string): void {
    if (/\(.*\)/.test(value)) {
      const match = value.match(/.*\((.*),(.*)\).*(?: in | of )(.*)/);
      this.alias = match[1].trim();
      this.$index = match[2].trim();
      this.dirValue = match[3].trim();
    } else {
      const match = value.match(/(.*)(?: in | of )(.*)/);
      this.alias = match[1].trim();
      this.dirValue = match[2].trim();
    }
  }

  /**
   * 得到强相关的节点列表
   *
   * @private
   * @return {any[]}
   * @memberof ForParser
   */
  private getChlids(): any[] {
    const list = [];
    const childNodes = this.parent.childNodes;
    for (let i = 0; i < childNodes.length; i++) {
      if (childNodes[i]["__vfor__"] === this.symbol) {
        list.push(childNodes[i]);
      }
    }
    return list;
  }
  /**
   * 构建数组
   *
   * @private
   * @param {any[]} newArray
   * @return {DocumentFragment}
   * @memberof ForParser
   */
  private buildList(newArray: any[]): DocumentFragment {
    const listFragment = document.createDocumentFragment();
    const keys = Object.keys(newArray);

    for (let i = 0; i < keys.length; i++) {
      const frag: any = this.buildItem(i, newArray);
      listFragment.appendChild(frag);
    }

    return listFragment;
  }
  /**
   * 重建数组
   *
   * @private
   * @param {any[]} newArray
   * @memberof ForParser
   */
  private recompileList(newArray: any[]): void {
    const children = this.getChlids();
    for (let i = 0; i < children.length; i++) {
      this.parent.removeChild(children[i]);
    }
    this.scopes.length = 0;
    const listFragment = this.buildList(newArray);
    this.parent.insertBefore(listFragment, this.end);
  }
  /**
   * 重建数组长度
   *
   * @private
   * @param {number} length
   * @memberof ForParser
   */
  private recompileLength(length: number): void {
    const children = this.getChlids();
    for (let i = length; i < children.length; i++) {
      this.parent.removeChild(children[i]);
    }
    this.scopes.length = length;
    this.scopes.map((item: any, index: any): void => {
      item[this.$index] = index;
    });
  }
  /**
   * 构建数组项
   *
   * @private
   * @param {number} i [数组索引]
   * @param {any[]} newArray [数组值]
   * @return {Node}
   * @memberof ForParser
   */
  private buildItem(i: number, newArray: any[]): Node {
    const frag = this.el.cloneNode(true);
    const index = i;
    const alias = this.alias;

    let scope: any = {};
    scope[alias] = newArray[i];
    scope[this.$index] = index;

    scope = new Observer(scope, `__${new Date().getTime()}__scope`).getData();

    Reflect.setPrototypeOf(scope, this.cs.$data);
    this.scopes.push(scope);

    if (this.isInit) {
      const $queue = this.cs.$queue;
      $queue.splice(index, 1);
    }

    const symbol = this.symbol;
    Reflect.defineProperty(frag, "__vfor__", {
      value: symbol,
      writable: false,
      enumerable: false,
      configurable: false
    });

    this.cs.collectDir({ element: frag, isRoot: true, scope });
    return frag;
  }
}
