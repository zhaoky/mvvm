import { ParserBaseInterface, ParserOptionInterface, ParseUpdateOptionInterface } from "./../interface";
import { setAttr } from "./../utils";
import BaseParser from "./base";
/**
 * 派生类 OtherParser
 *
 * @class OtherParser
 * @extends {BaseParser}
 */
export default class OtherParser extends BaseParser implements ParserBaseInterface {
  /**
   *Creates an instance of OtherParser.
   * @param {ParserOptionInterface} { node, dirName, dirValue, cs }
   * @memberof OtherParser
   */
  public constructor({ node, dirName, dirValue, cs }: ParserOptionInterface) {
    super({ node, dirName, dirValue, cs });
  }
  /**
   *  other更新函数
   *
   * @param {any} newVal
   * @memberof OtherParser
   */
  public update({ newVal }: ParseUpdateOptionInterface): void {
    setAttr(this.el, this.dirName, newVal);
  }
}
