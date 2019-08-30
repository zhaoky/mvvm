import { MvvmOptionInterface } from "@interface";
import { isObject, isElement } from "@utils";
import Compiler from "@compiler";

/**
 * MVVM入口
 *
 * @export
 * @class MVVM
 */
export default class MVVM {
  /**
   *Creates an instance of MVVM.
   * @param {MvvmOptionInterface} option
   * @memberof MVVM
   */
  public constructor(option: MvvmOptionInterface) {
    if (!isObject(option)) {
      throw Error("data must be object.");
    }
    if (!option.view || (!!option.view && !isElement(option.view))) {
      throw Error("data.view must be HTMLDivElement.");
    }
    if (!option.model || (!!option.model && !isObject(option.model))) {
      throw Error("data.model must be object.");
    }

    new Compiler(option);
  }
}
