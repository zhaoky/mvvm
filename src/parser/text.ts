import { _toString } from "../utils";
import BaseParser, { ParserBaseClass, ParseUpdateOption } from "./base";

/**
 * 派生类 TextParser
 *
 * @class TextParser
 * @extends {BaseParser}
 * @implements {ParserBaseClass}
 */
export default class TextParser extends BaseParser implements ParserBaseClass {
  /**
   * text刷新视图函数
   *
   * @param {any} newVal [新值]
   * @memberof TextParser
   */
  public update({ newVal }: ParseUpdateOption): void {
    this.el!.textContent = _toString(newVal);
  }
}
