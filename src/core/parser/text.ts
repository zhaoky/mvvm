import { ParserBaseInterface, ParserOptionInterface, ParseUpdateOptionInterface } from "./../interface";
import { _toString } from "./../utils";
import BaseParser from "./base";
/**
 * 派生类 TextParser
 *
 * @class TextParser
 * @extends {BaseParser}
 */
export default class TextParser extends BaseParser implements ParserBaseInterface {
  /**
   *Creates an instance of TextParser.
   * @param {ParserOptionInterface} { node, dirValue, cs }
   * @memberof TextParser
   */
  public constructor({ node, dirValue, cs }: ParserOptionInterface) {
    super({ node, dirValue, cs });
  }
  /**
   * text刷新视图函数
   *
   * @param {any} newVal [新值]
   * @memberof TextParser
   */
  public update({ newVal }: ParseUpdateOptionInterface): void {
    this.el.textContent = _toString(newVal);
  }
}
