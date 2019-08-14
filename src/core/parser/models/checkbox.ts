import { ParseUpdateOptionInterface, ParserBaseInterface } from "./../../interface";
import { _toString } from "./../../utils";
/**
 * <input type='text/password'>
 * <textarea>
 * 双向绑定类
 * @export
 * @class ModelCheckbox
 */
export default class ModelCheckbox {
  private model: ParserBaseInterface = null;
  /**
   *Creates an instance of ModelCheckbox.
   * @param {*} model
   * @memberof ModelCheckbox
   */
  public constructor(model: ParserBaseInterface) {
    this.model = model;
    this.model.el.addEventListener("input", function(): void {
      // eslint-disable-next-line no-invalid-this
      model.cs.watcher.set((this as HTMLInputElement).value);
    });
  }
  /**
   * 更新函数
   *
   * @param {ParseUpdateOptionInterface} { newVal }
   * @memberof ModelCheckbox
   */
  public update({ newVal }: ParseUpdateOptionInterface): void {
    (this.model.el as HTMLInputElement).value = _toString(newVal);
  }
}
