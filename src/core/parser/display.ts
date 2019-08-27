import { ParserBaseInterface, ParserOptionInterface, ParseUpdateOptionInterface } from "./../interface";
import BaseParser from "./base";
/**
 * 派生类 DisplayParser
 *
 * @class DisplayParser
 * @extends {BaseParser}
 */
export default class DisplayParser extends BaseParser implements ParserBaseInterface {
  /**
   *Creates an instance of DisplayParser.
   * @param {ParserOptionInterface} { node, dirName, dirValue, cs }
   * @memberof DisplayParser
   */
  public constructor({ node, dirName, dirValue, cs }: ParserOptionInterface) {
    super({ node, dirName, dirValue, cs });
  }
  /**
   * display更新函数
   *
   * @param {any} newVal
   * @memberof DisplayParser
   */
  public update({ newVal }: ParseUpdateOptionInterface): void {
    if (this.dirName === "show") {
      this.el.style.display = !!newVal ? "block" : "none";
    } else {
      this.el.style.display = !!newVal ? "none" : "block";
    }
  }
}
