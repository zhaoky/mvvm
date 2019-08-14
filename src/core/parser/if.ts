import { ParserBaseInterface, ParserOptionInterface, ParseUpdateOptionInterface, Node } from "./../interface";
import { replaceNode } from "./../utils";
import BaseParser from "./base";
/**
 * 派生类 IfParser
 *
 * @class IfParser
 * @extends {IfParser}
 */
export default class IfParser extends BaseParser implements ParserBaseInterface {
  private $parent: Node & ParentNode | null;
  private elTpl: Node;
  private emptyNode: Text;
  /**
   *Creates an instance of IfParser.
   * @param {ParserOptionInterface} { node, dirValue, cs }
   * @memberof IfParser
   */
  public constructor({ node, dirValue, cs }: ParserOptionInterface) {
    super({ node, dirValue, cs });
    this.$parent = this.el.parentNode;
    this.elTpl = this.el.cloneNode(true);
    this.emptyNode = document.createTextNode("");
    replaceNode(this.el, this.emptyNode);
  }
  /**
   * if更新函数
   *
   * @param {any} newVal
   * @param {any} scope
   * @memberof IfParser
   */
  public update({ newVal, scope }: ParseUpdateOptionInterface): void {
    const tpl: Node = this.elTpl.cloneNode(true);

    if (newVal) {
      this.cs.collectDir({ element: tpl, isRoot: true, scope });
      this.$parent.insertBefore(tpl, this.emptyNode);

      Reflect.defineProperty(tpl, "__vif__", {
        value: true,
        writable: true,
        enumerable: false,
        configurable: true
      });
    } else {
      const el: Node = this.emptyNode.previousSibling;
      if (el && el.__vif__) {
        this.$parent.removeChild(el);
      }
    }
  }
}
