import { ParseUpdateOptionInterface, ParserBaseInterface } from "./../../interface";
import { _toString, hasAttr, isArray } from "./../../utils";
/**
 * <select multiple>
 *  <option></option>
 *  <option></option>
 * </select>
 * 双向绑定类
 * @export
 * @class ModelSelect
 */
export default class ModelSelect {
  private model: ParserBaseInterface = null;
  private multi: boolean = false;
  /**
   *Creates an instance of ModelSelect.
   * @param {ParserBaseInterface} model
   * @memberof ModelSelect
   */
  public constructor(model: ParserBaseInterface) {
    this.model = model;
    this.multi = hasAttr(model.el, "multiple");
    const selectScope = this;

    model.el.addEventListener("change", function(): void {
      // eslint-disable-next-line no-invalid-this
      const value = selectScope.multi ? selectScope.getSelectValue(this as HTMLSelectElement) : (this as HTMLSelectElement).value;
      model.watcher.set(value);
    });
  }
  /**
   * 更新函数
   *
   * @param {ParseUpdateOptionInterface} { newVal }
   * @memberof ModelSelect
   */
  public update({ newVal }: ParseUpdateOptionInterface): void {
    const el: HTMLSelectElement = this.model.el as HTMLSelectElement;
    el.selectedIndex = -1;
    const optionList: HTMLOptionsCollection = el.options;

    // 如果是多选，绑定值需为array
    if (this.multi && !isArray(newVal)) {
      throw Error("the model must be array when select set multi");
    }
    // 如果是单选,绑定值不能为array
    if (!this.multi && isArray(newVal)) {
      throw Error("the model must be no array when select not set multi");
    }
    for (let i = 0; i < optionList.length; i++) {
      const option = optionList[i];
      option.selected = this.multi ? (newVal as string[]).includes(option.value) : option.value === _toString(newVal);
    }
  }
  /**
   * 多选结果
   *
   * @private
   * @param {HTMLSelectElement} el
   * @return {string[]}
   * @memberof ModelSelect
   */
  private getSelectValue(el: HTMLSelectElement): string[] {
    const optionList: HTMLOptionsCollection = el.options;
    const list: string[] = [];
    for (let i = 0; i < optionList.length; i++) {
      if (optionList[i].selected) {
        list.push(optionList[i].value);
      }
    }
    return list;
  }
}
