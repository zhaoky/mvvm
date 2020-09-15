import { setAttr } from "../utils";
import BaseParser, { ParserBaseClass, ParseUpdateOption } from "./base";
/**
 * 派生类 OtherParser
 *
 * @class OtherParser
 * @extends {BaseParser}
 */
export default class OtherParser extends BaseParser implements ParserBaseClass {
  /**
   *  other更新函数
   *
   * @param {any} newVal [新值]
   * @memberof OtherParser
   */
  public update({ newVal }: ParseUpdateOption): void {
    setAttr(this.el!, this.dirName!, newVal);
  }
}
