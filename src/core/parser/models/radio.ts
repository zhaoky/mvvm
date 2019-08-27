import { ParseUpdateOptionInterface, ParserBaseInterface } from "./../../interface";
import { _toString } from "./../../utils";
/**
 * <input type='radio'>
 * 双向绑定类
 * @export
 * @class ModelRadio
 */
export default class ModelRadio {
  /**
   * model解析器
   *
   * @private
   * @type {ParserBaseInterface}
   * @memberof ModelRadio
   */
  private model: ParserBaseInterface = null;
  /**
   *Creates an instance of ModelRadio.
   * @param {*} model
   * @memberof ModelRadio
   */
  public constructor(model: ParserBaseInterface) {
    this.model = model;
    this.model.el.addEventListener("change", (e: Event): void => {
      model.watcher.set((e.target as HTMLInputElement).value);
    });
  }
  /**
   * 更新函数
   *
   * @param {ParseUpdateOptionInterface} { newVal }
   * @memberof ModelRadio
   */
  public update({ newVal }: ParseUpdateOptionInterface): void {
    (this.model.el as HTMLInputElement).checked = _toString(newVal) === (this.model.el as HTMLInputElement).value;
  }
}
