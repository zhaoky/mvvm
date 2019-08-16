import { ParseUpdateOptionInterface, ParserBaseInterface } from "./../../interface";
import { isBoolean } from "./../../utils";
import { isArray } from "util";
/**
 * <input type='checkbox>
 * 只支持boolean和array
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
    model.el.addEventListener("change", function(): void {
      const data = model.watcher.get();
      // eslint-disable-next-line no-invalid-this
      const { checked, value } = this as HTMLInputElement;
      if (isBoolean(data)) {
        model.watcher.set(checked);
      } else if (isArray(data)) {
        if (checked && !data.includes(value)) {
          data.push(value);
        } else if (!checked && data.includes(value)) {
          data.splice(data.indexOf(value), 1);
        }
      }
    });
  }
  /**
   * 更新函数
   *
   * @param {ParseUpdateOptionInterface} { newVal }
   * @memberof ModelCheckbox
   */
  public update({ newVal }: ParseUpdateOptionInterface): void {
    if (!isArray(newVal) && !isBoolean(newVal)) {
      throw Error("Checkbox v-model value must be a type of Boolean or Array");
    }
    const value = (this.model.el as HTMLInputElement).value;
    (this.model.el as HTMLInputElement).checked = isBoolean(newVal) ? newVal : (newVal as any[]).includes(value);
  }
}
