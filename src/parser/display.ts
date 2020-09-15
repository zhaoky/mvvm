import BaseParser, { ParserOption, ParserBaseClass, ParseUpdateOption } from "./base";
/**
 * 派生类 DisplayParser
 *
 * @class DisplayParser
 * @extends {BaseParser}
 */
export default class DisplayParser extends BaseParser implements ParserBaseClass {
  /**
   *Creates an instance of DisplayParser.
   * @param {ParserOption} options
   * @param {HTMLElement} option.node [包含指令的 dom 节点]
   * @param {String} option.dirName [指令名称]
   * @param {String} option.dirValue [指令值]
   * @memberof DisplayParser
   */
  public constructor({ node, dirName, dirValue, cs }: ParserOption) {
    super({ node, dirName, dirValue, cs });
    this.el!.style.display = (<any>this.el)!.originalDisplay = this.el!.style.display === "none" ? "" : this.el!.style.display;
  }
  /**
   * display更新函数
   *
   * @param {any} newVal
   * @memberof DisplayParser
   */
  public update({ newVal }: ParseUpdateOption): void {
    if (this.dirName === "show") {
      if (newVal) {
        this.el!.style.display = (<any>this.el)!.originalDisplay ? "block" : (<any>this.el)!.originalDisplay;
      } else {
        this.el!.style.display = "none";
      }
    } else {
      if (newVal) {
        this.el!.style.display = "none";
      } else {
        this.el!.style.display = (<any>this.el)!.originalDisplay ? "block" : (<any>this.el)!.originalDisplay;
      }
    }
  }
}
