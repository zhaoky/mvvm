import { ParserBaseInterface, ParserOptionInterface, ParseUpdateOptionInterface } from "@/interface";
import { updateStyle } from "@/utils";
import BaseParser from "@/parser/base";
/**
 * 派生类 StyleParser
 *
 * @class StyleParser
 * @extends {BaseParser}
 */
export default class StyleParser extends BaseParser implements ParserBaseInterface {
  /**
   * 是否为深度依赖
   *
   * @type {boolean}
   * @memberof ParserBaseInterface
   */
  public deep = true;
  /**
   *Creates an instance of StyleParser.
   * @param {ParserOptionInterface} { node, dirValue, cs }
   * @memberof StyleParser
   */
  public constructor({ node, dirValue, cs }: ParserOptionInterface) {
    super({ node, dirValue, cs });
  }
  /**
   * style刷新视图函数
   *
   * @param {any} newVal [新的style对象]
   * @param {any} oldVal [旧的style对象]
   * @memberof StyleParser
   */
  public update({ newVal, oldVal }: ParseUpdateOptionInterface): void {
    if (oldVal) {
      const keys = Object.keys(oldVal);
      keys.map((item: string): void => {
        oldVal[item] = "";
      });
      updateStyle(this.el, oldVal);
    }
    updateStyle(this.el, newVal);
  }
}
