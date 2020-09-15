import { hasAttr, getAttr, isBoolean, isArray, _toString } from "../utils";
import BaseParser, { ParserOption, ParserBaseClass, ParseUpdateOption } from "./base";

export interface ModelClass {
  update({ newVal: any }: ParseUpdateOption): void;
}
const VAILD_MODEL_ELEMENT = ["input", "select", "textarea"];

/**
 * 派生类 ModelParser
 *
 * @export
 * @class ModelParser
 * @extends {BaseParser}
 * @implements {ParserBaseClass}
 */
export default class ModelParser extends BaseParser implements ParserBaseClass {
  /**
   * model中不同类型的解析器实例
   *
   * @private
   * @type {ModelClass} [modal 实例]
   * @memberof ModelParser
   */
  private type: string | null = null;
  /**
   * 是否是多选
   *
   * @private
   * @type {boolean}
   * @memberof ModelSelect
   */
  private multi = false;
  /**
   *Creates an instance of ModelParser.
   * @param {ParserOption} options
   * @param {HTMLElement} option.node [包含指令的 dom 节点]
   * @param {String} option.dirName [指令名称]
   * @param {String} option.dirValue [指令值]
   * @memberof ModelParser
   */
  public constructor({ node, dirName, dirValue, cs }: ParserOption) {
    super({ node, dirName, dirValue, cs });
    this.type = this.selectType();
    this.addEvent();
  }
  /**
   * model更新函数
   *
   * @param {ParseUpdateOption} options
   * @param {any} options.newVal [新值]
   * @memberof ModelParser
   */
  public update({ newVal }: ParseUpdateOption): void {
    switch (this.type) {
      case "text":
        this.textUpdate({ newVal });
        break;
      case "checkbox":
        this.checkboxUpdate({ newVal });
        break;
      case "radio":
        this.radioUpdate({ newVal });
        break;
      case "select":
        this.selectUpdate({ newVal });
        break;
    }
  }
  /**
   *
   *
   * @private
   * @return {*}  {string}
   * @memberof ModelParser
   */
  private selectType(): string {
    const tagName: string = this.el!.tagName.toLowerCase();
    const type: string = tagName === "input" ? getAttr(this.el!, "type") : tagName;

    if (!VAILD_MODEL_ELEMENT.includes(tagName)) {
      throw Error(`v-model can only be used for ${VAILD_MODEL_ELEMENT.join(" ")}`);
    }

    if (["text", "password", "textarea"].includes(type)) {
      return "text";
    }
    return type;

    // switch (type) {
    //   case "text":
    //   case "password":
    //   case "textarea":
    //     this.type = new ModelText(this);
    //     break;
    //   case "radio":
    //     this.type = new ModelRadio(this);
    //     break;
    //   case "checkbox":
    //     this.type = new ModelCheckbox(this);
    //     break;
    //   case "select":
    //     this.type = new ModelSelect(this);
    //     break;
    // }
  }
  /**
   *
   *
   * @private
   * @memberof ModelParser
   */
  private addEvent() {
    if (this.type === "select") {
      this.multi = hasAttr(<HTMLInputElement>this.el, "multiple");
    }
    this.el!.addEventListener(this.type === "text" ? "input" : "change", (e: Event): void => {
      if (this.type === "select") {
        const value = this.multi ? this.getSelectValue((<HTMLSelectElement>e.target).options) : (<HTMLSelectElement>e.target).value;
        this.watcher!.set(value);
      } else if (this.type === "checkbox") {
        const data: any = this.watcher!.get();
        const { checked, value } = <HTMLInputElement>e.target;
        if (isBoolean(data)) {
          this.watcher!.set(checked);
        } else {
          checked ? data.push(value) : data.splice(data.indexOf(value), 1);
        }
      } else {
        this.watcher!.set((<HTMLInputElement>e.target).value);
      }
    });
  }
  /**
   * 多选结果
   *
   * @private
   * @param {HTMLOptionsCollection} options [多选列表]
   * @return {string[]}
   * @memberof ModelSelect
   */
  private getSelectValue(options: HTMLOptionsCollection): string[] {
    const list: string[] = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        list.push(options[i].value);
      }
    }
    return list;
  }
  /**
   * 输入框等更新方法
   *
   * @private
   * @param {string} newVal
   * @memberof ModelParser
   */
  private textUpdate({ newVal }: ParseUpdateOption) {
    (<HTMLInputElement>this.el).value = _toString(newVal);
  }
  /**
   * 复选框 更新方法
   *
   * @private
   * @param {*} newVal
   * @memberof ModelParser
   */
  private checkboxUpdate({ newVal }: ParseUpdateOption) {
    if (!isArray(newVal) && !isBoolean(newVal)) {
      throw Error("Checkbox v-model value must be type of Boolean or Array");
    }
    const value: string = (<HTMLInputElement>this.el!).value;
    (<HTMLInputElement>this.el!).checked = isBoolean(newVal) ? newVal : newVal.includes(value);
  }
  /**
   * 单选框 更新方法
   *
   * @private
   * @param {*} newVal
   * @memberof ModelParser
   */
  private radioUpdate({ newVal }: ParseUpdateOption) {
    (<HTMLInputElement>this.el).checked = _toString(newVal) === (<HTMLInputElement>this.el).value;
  }
  /**
   * select 更新方法
   *
   * @private
   * @param {*} newVal
   * @memberof ModelParser
   */
  private selectUpdate({ newVal }: ParseUpdateOption) {
    const el: HTMLSelectElement = <HTMLSelectElement>this.el;
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
      const option: HTMLOptionElement = optionList[i];

      option.selected = this.multi ? newVal.includes(option.value) : option.value === _toString(newVal);
    }
  }
}
