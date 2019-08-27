import { CompilerInterface, ParserOptionInterface, ParserBaseInterface } from "./../interface";
/**
 * 基类
 *
 * @class BaseParser
 */
export default class BaseParser implements ParserBaseInterface {
  /**
   * 包含指令的节点
   *
   * @type {HTMLElement}
   * @memberof BaseParser
   */
  public el: HTMLElement;
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
   * @type {CompilerInterface}
   * @memberof BaseParser
   */
  public cs: CompilerInterface;
  /**
   * Creates an instance of BaseParser.
   * @param {HTMLElement} node
   * @param {String} dirName
   * @param {String} dirValue
   * @param {CompilerInterface} cs
   * @memberof BaseParser
   */
  public constructor({ node, dirName, dirValue, cs }: ParserOptionInterface) {
    this.el = node;
    dirName && (this.dirName = dirName);
    dirValue && (this.dirValue = dirValue);
    cs && (this.cs = cs);
  }
}
