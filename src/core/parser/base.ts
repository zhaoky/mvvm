import { CompilerInterface, ParserOptionInterface, ParserBaseInterface } from "./../interface";
/**
 * 基类
 *
 * @class BaseParser
 */
export default class BaseParser implements ParserBaseInterface {
  public el: HTMLElement;
  public dirName?: string;
  public dirValue?: string;
  public cs: CompilerInterface;
  public deep?: boolean;
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
