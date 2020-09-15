import { updateStyle } from "../utils";
import BaseParser, { ParserBaseClass, ParseUpdateOption } from "./base";
/**
 * 派生类 StyleParser
 *
 * @class StyleParser
 * @extends {BaseParser}
 */
export default class StyleParser extends BaseParser implements ParserBaseClass {
  /**
   * 是否为深度依赖
   *
   * @type {boolean}
   * @memberof StyleParser
   */
  public deep = true;
  /**
   * style刷新视图函数
   *
   * @param {Record<string, any>} newVal [新的style对象]
   * @param {Record<string, any>} oldVal [旧的style对象]
   * @memberof StyleParser
   */
  public update({ newVal, oldVal }: ParseUpdateOption): void {
    if (oldVal) {
      const keys: string[] = Object.keys(oldVal);
      keys.map((item: string): void => {
        oldVal[item] = "";
      });
      updateStyle(this.el!, oldVal);
    }
    updateStyle(this.el!, newVal);
  }
}
