import { ParseUpdateOptionInterface, ParserBaseInterface } from "./../../interface";
import { _toString } from "./../../utils";
/**
 * <input type='text/password'>
 * <textarea>
 * 双向绑定类
 * @export
 * @class ModelSelect
 */
export default class ModelSelect {
  private model: ParserBaseInterface = null;
  /**
   *Creates an instance of ModelSelect.
   * @param {*} model
   * @memberof ModelSelect
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
   * @memberof ModelSelect
   */
  public update({ newVal }: ParseUpdateOptionInterface): void {
    (this.model.el as HTMLInputElement).value = _toString(newVal);
  }
}
