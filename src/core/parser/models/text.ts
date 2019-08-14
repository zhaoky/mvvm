import { ParseUpdateOptionInterface, ParserBaseInterface } from "./../../interface";
import { _toString } from "./../../utils";
/**
 * <input type='text/password'>
 * <textarea>
 * 双向绑定类
 * @export
 * @class ModelText
 */
export default class ModelText {
  private model: ParserBaseInterface = null;
  /**
   *Creates an instance of ModelText.
   * @param {*} model
   * @memberof ModelText
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
   * @memberof ModelText
   */
  public update({ newVal }: ParseUpdateOptionInterface): void {
    (this.model.el as HTMLInputElement).value = _toString(newVal);
  }
}
