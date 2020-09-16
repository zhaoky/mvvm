import { isArray } from "../utils";
import BaseParser, { ParserOption, ParseUpdateOption } from "./base";
import Observer from "../observer";

interface ListItem extends HTMLElement {
  __vfor__?: symbol;
}

/**
 * 派生类 ForParser
 *
 * @class ForParser
 * @extends {BaseParser}
 */
export default class ForParser extends BaseParser {
  /**
   * item别名
   *
   * @private
   * @memberof ForParser
   */
  private alias = "";
  /**
   * 独特的__vfor__
   *
   * @private
   * @memberof ForParser
   */
  private symbol = Symbol();
  /**
   * 含有alias,$index对象的数组
   *
   * @private
   * @type {Record<string, any>[]}
   * @memberof ForParser
   */
  private scopes: Record<string, any>[] = [];
  /**
   * 父节点
   *
   * @private
   * @type {Node}
   * @memberof ForParser
   */
  private parent: HTMLElement | null = null;
  /**
   * 终止节点
   *
   * @private
   * @type {Node}
   * @memberof ForParser
   */
  private end: HTMLElement | null = null;
  /**
   * 是否是首次渲染
   *
   * @private
   * @memberof ForParser
   */
  private isInit = true;
  /**
   * 位置索引
   *
   * @private
   * @memberof ForParser
   */
  private $index = "";
  /**
   * 是否为深度依赖
   *
   * @memberof ForParser
   */
  public deep = true;

  /**
   *Creates an instance of ForParser.
   * @param {ParserOption} options
   * @param {HTMLElement} option.node [包含指令的 dom 节点]
   * @param {String} option.dirName [指令名称]
   * @param {String} option.dirValue [指令值]
   * @memberof ForParser
   */
  public constructor({ node, dirName, dirValue, cs }: ParserOption) {
    super({ node, dirName, dirValue, cs });

    this.parseValue(dirValue!);

    this.parent = <HTMLElement>node!.parentNode;

    if (this.parent!.nodeType !== 1) {
      throw Error("v-for can't used in the root element!");
    }
    this.end = <HTMLElement>node!.nextSibling;
  }
  /**
   * for更新函数
   *
   * @param {ParseUpdateOption} option
   * @param {any} option.newVal newVal [新值]
   * @param {ArrArgs} option.arrArgs [数组参数]
   * @return {void}
   * @memberof ForParser
   */
  public update({ newVal, arrArgs }: ParseUpdateOption): void {
    // 如果没有值
    if (!newVal) {
      return;
    }
    // 如果有值但不是数组
    if (newVal && !isArray(newVal)) {
      throw Error("v-for item type must be array!");
    }
    // 如果是首次渲染
    if (this.isInit) {
      const parentNode = <HTMLElement>this.el!.parentNode;
      parentNode.replaceChild(this.buildList(newVal), this.el!);
      this.isInit = false;
      return;
    }
    // 如果雨女无瓜
    if (arrArgs!.receiver && newVal !== arrArgs!.receiver) {
      return;
    }
    // 如果是整体构建
    if (!arrArgs!.property) {
      this.recompileList(newVal);
      return;
    }
    // 如果是某一项改变
    if (arrArgs!.property !== "length") {
      const index: number = +arrArgs!.property;
      const frag: HTMLElement = this.buildItem(index, newVal);
      const children = this.getChlids();
      if (children.length < index + 1) {
        this.parent!.insertBefore(frag, this.end);
      } else {
        this.parent!.replaceChild(frag, children[index]);
      }
    } else {
      // 如果是长度改变
      this.recompileLength(arrArgs!.value);
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
      this.alias = match![1].trim();
      this.$index = match![2].trim();
      this.dirValue = match![3].trim();
    } else {
      const match = value.match(/(.*)(?: in | of )(.*)/);
      this.alias = match![1].trim();
      this.dirValue = match![2].trim();
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
    const childNodes = this.parent!.childNodes;
    for (let i = 0; i < childNodes.length; i++) {
      const item = <ListItem>childNodes[i];
      if (item["__vfor__"] === this.symbol) {
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
      this.parent!.removeChild(children[i]);
    }
    this.scopes.length = 0;
    const listFragment = this.buildList(newArray);
    this.parent!.insertBefore(listFragment, this.end);
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
      this.parent!.removeChild(children[i]);
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
  private buildItem(i: number, newArray: any[]): HTMLElement {
    const frag = <HTMLElement>this.el!.cloneNode(true);
    const index = i;
    const alias = this.alias;

    let scope: Record<string, any> = {};
    scope[alias] = newArray[i];
    scope[this.$index] = index;

    scope = new Observer(scope, `__scope`).getData();

    Reflect.setPrototypeOf(scope, this.cs!.ms!.$data);
    this.scopes.push(scope);

    if (this.isInit) {
      const $queue = this.cs!.$queue;
      $queue.splice(index, 1);
    }

    const symbol = this.symbol;
    Reflect.defineProperty(frag, "__vfor__", {
      value: symbol,
      writable: false,
      enumerable: false,
      configurable: false,
    });

    this.cs!.collectDir({ element: frag, isRoot: true, scope });
    return frag;
  }
}
