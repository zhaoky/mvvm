import { ParseUpdateOptionInterface, ParserBaseInterface } from "@/interface";
import { isBoolean, isArray } from "@/utils";
/**
 * <input type='checkbox>
 * 只支持boolean和array
 * 双向绑定类
 * @export
 * @class ModelCheckbox
 */
export default class ModelCheckbox {
  /**
   * model解析器
   *
   * @private
   * @type {ParserBaseInterface}
   * @memberof ModelCheckbox
   */
  private model: ParserBaseInterface = null;
  /**
   *Creates an instance of ModelCheckbox.
   * @param {*} model
   * @memberof ModelCheckbox
   */
  public constructor(model: ParserBaseInterface) {
    this.model = model;
    model.el.addEventListener("change", (e: Event): void => {
      const data = model.watcher.get();
      const { checked, value } = e.target as HTMLInputElement;
      if (isBoolean(data)) {
        model.watcher.set(checked);
      } else {
        checked ? data.push(value) : data.splice(data.indexOf(value), 1);
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
      throw Error("Checkbox v-model value must be type of Boolean or Array");
    }
    const value = (this.model.el as HTMLInputElement).value;
    (this.model.el as HTMLInputElement).checked = isBoolean(newVal) ? newVal : (newVal as any[]).includes(value);
  }
}
