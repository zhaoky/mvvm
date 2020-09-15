import { removeClass, addClass } from "../utils";
import BaseParser, { ParserBaseClass, ParseUpdateOption } from "./base";
/**
 * 派生类 ClassParser
 *
 * @class ClassParser
 * @extends {BaseParser}
 */
export default class ClassParser extends BaseParser implements ParserBaseClass {
  /**
   * class刷新视图函数
   *
   * @param {any} newVal [新的class类]
   * @param {any} oldVal [旧的class类]
   * @memberof ClassParser
   */
  public update({ newVal, oldVal }: ParseUpdateOption): void {
    if (oldVal) {
      const oldClassList: string[] = oldVal.split(" ");
      oldClassList.map((item: string): void => {
        removeClass(this.el!, item);
      });
    }
    const classList: string[] = newVal.split(" ");
    classList.map((item: string): void => {
      addClass(this.el!, item);
    });
  }
}
