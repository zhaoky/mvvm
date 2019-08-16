import { ParserBaseInterface, ParserOptionInterface, ParseUpdateOptionInterface } from "../interface";
import BaseParser from "./base";
import { getAttr } from "./../utils";
import ModelText from "./models/text";
import ModelRadio from "./models/radio";
import ModelCheckbox from "./models/checkbox";
import ModelSelect from "./models/select";

const VAILD_MODEL_ELEMENT = ["input", "select", "textarea"];

/**
 * 派生类 ModelParser
 *
 * @export
 * @class ModelParser
 * @extends {BaseParser}
 * @implements {ParserBaseInterface}
 */
export default class ModelParser extends BaseParser implements ParserBaseInterface {
  protected type: any = null;
  /**
   *Creates an instance of ModelParser.
   * @param {ParserOptionInterface} { node, dirValue, cs }
   * @memberof ModelParser
   */
  public constructor({ node, dirValue, cs }: ParserOptionInterface) {
    super({ node, dirValue, cs });
    this.selectType();
  }
  /**
   * model更新函数
   *
   * @param {ParseUpdateOptionInterface} { newVal }
   * @memberof ModelParser
   */
  public update({ newVal }: ParseUpdateOptionInterface): void {
    this.type.update({ newVal });
  }
  /**
   * 选择对应model解析器
   *
   * @memberof ModelParser
   */
  private selectType(): void {
    const tagName = this.el.tagName.toLowerCase();
    const type = tagName === "input" ? getAttr(this.el, "type") : tagName;

    if (!VAILD_MODEL_ELEMENT.includes(tagName)) {
      throw Error(`v-model can only be used on ${VAILD_MODEL_ELEMENT.join(" ")}`);
    }

    switch (type) {
      case "text":
      case "password":
      case "textarea":
        this.type = new ModelText(this);
        break;
      case "radio":
        this.type = new ModelRadio(this);
        break;
      case "checkbox":
        this.type = new ModelCheckbox(this);
        break;
      case "select":
        this.type = new ModelSelect(this);
        break;
    }
  }
}
