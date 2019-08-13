import { ParserBaseInterface, ParserOptionInterface, ParseUpdateOptionInterface } from "./../interface";
import { removeClass, addClass } from "./../utils";
import BaseParser from "./base";
/**
 * 派生类 ClassParser
 *
 * @class ClassParser
 * @extends {BaseParser}
 */
export default class ClassParser extends BaseParser implements ParserBaseInterface {
  /**
   *Creates an instance of ClassParser.
   * @param {ParserOptionInterface} { node, dirValue, cs }
   * @memberof ClassParser
   */
  public constructor({ node, dirValue, cs }: ParserOptionInterface) {
    super({ node, dirValue, cs });
  }
  /**
   * class刷新视图函数
   *
   * @param {any} newVal [新的class类]
   * @param {any} oldVal [旧的class类]
   * @memberof ClassParser
   */
  public update({ newVal, oldVal }: ParseUpdateOptionInterface): void {
    if (oldVal) {
      const oldClassList = oldVal.split(" ");
      oldClassList.map((item: string): void => {
        removeClass(this.el, item);
      });
    }
    const classList = newVal.split(" ");
    classList.map((item: string): void => {
      addClass(this.el, item);
    });
  }
}
