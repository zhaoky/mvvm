import { replaceNode } from "../utils";
import BaseParser, { ParserOption, ParserBaseClass, ParseUpdateOption } from "./base";
interface IfElement extends HTMLElement {
  __vif__?: boolean;
}
/**
 * 派生类 IfParser
 *
 * @class IfParser
 * @extends {IfParser}
 * @implements {ParserBaseClass}
 */
export default class IfParser extends BaseParser implements ParserBaseClass {
  /**
   * 指令父节点
   *
   * @private
   * @type {HTMLElement | null}
   * @memberof IfParser
   */
  private $parent: HTMLElement | null = null;
  /**
   * 克隆的节点
   *
   * @private
   * @type {HTMLElement | null}
   * @memberof IfParser
   */
  private elTpl: HTMLElement | null = null;
  /**
   * 空文本节点
   *
   * @private
   * @type {Text}
   * @memberof IfParser
   */
  private emptyNode: Text;
  /**
   *Creates an instance of IfParser.
   * @param {ParserOption} options
   * @param {HTMLElement} option.node [包含指令的 dom 节点]
   * @param {String} option.dirName [指令名称]
   * @param {String} option.dirValue [指令值]
   * @memberof IfParser
   */
  public constructor({ node, dirName, dirValue, cs }: ParserOption) {
    super({ node, dirName, dirValue, cs });
    this.$parent = <HTMLElement>this.el!.parentNode;

    if (this.$parent.nodeType !== 1) {
      throw Error("v-if can't used in the root element!");
    }

    this.elTpl = <HTMLElement>this.el!.cloneNode(true);
    this.emptyNode = document.createTextNode("");
    replaceNode(this.el!, this.emptyNode);
  }
  /**
   * if更新函数
   *
   * @param {any} newVal [新值]
   * @param {Record<string, any> | null} scope [v-for 作用域]
   * @memberof IfParser
   */
  public update({ newVal, scope }: ParseUpdateOption): void {
    const tpl = <HTMLElement>this.elTpl!.cloneNode(true);

    if (newVal) {
      this.cs!.collectDir({ element: tpl, isRoot: true, scope });
      this.$parent!.insertBefore(tpl, this.emptyNode);

      Reflect.defineProperty(tpl, "__vif__", {
        value: true,
        writable: true,
        enumerable: false,
        configurable: true,
      });
    } else {
      const el = <IfElement>this.emptyNode.previousSibling;
      if (el && el.__vif__) {
        this.$parent!.removeChild(el);
      }
    }
  }
}
