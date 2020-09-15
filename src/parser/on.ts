import { isPC } from "../utils";
import BaseParser, { ParserBaseClass } from "./base";

interface OnHandler {
  (scope: Record<string, any>, e: Event): void;
}
/**
 * 派生类 OnParser
 *
 * @class OnParser
 * @extends {BaseParser}
 */
export default class OnParser extends BaseParser implements ParserBaseClass {
  /**
   * v-for作用域
   *
   * @private
   * @type {Record<string, any> | null}
   * @memberof OnParser
   */
  private scope?: Record<string, any> | null;
  /**
   * 事件类型
   *
   * @private
   * @type {string}
   * @memberof OnParser
   */
  private handlerType?: string;
  /**
   * 事件函数
   *
   * @private
   * @type {OnHandlerInterface}
   * @memberof OnParser
   */
  private handlerFn?: OnHandler;
  /**
   * 生成事件处理函数
   *
   * @private
   * @param {string} expression [表达式]
   * @return {OnHandler}
   * @memberof OnParser
   */
  private getHandler(expression: string): OnHandler {
    expression = expression.trim();

    if (/^(\S+?)\(.*\)$/g.test(expression)) {
      expression = expression.replace(/^(\S+?)(\()/, "scope.__eventHandler.$1.call(this,");
    } else {
      expression = `scope.__eventHandler.${expression}.call(this)`;
    }
    expression = expression.replace(/([(,])(\S+?)(?=[,)])/g, (_match: any, $1: any, $2: any): string => {
      return /^(?:(['"`])\S+\1)|(\d+?)|(\$event)|(this)$/.test($2) ? `${$1}${$2}` : `${$1}scope['${$2}']`;
    });

    try {
      return <OnHandler>new Function("scope,$event", `${expression}`);
    } catch {
      throw Error(`Check the expression for errors`);
    }
  }
  /**
   * 绑定事件
   *
   * @private
   * @memberof OnParser
   */
  private addEvent(): void {
    const el: HTMLElement = this.el!;
    const handlerType: string = this.handlerType!;
    const handlerFn: OnHandler = this.handlerFn!;
    const scope = this.scope || this.cs!.ms!.$data;

    el.addEventListener(handlerType, (e: Event): void => {
      handlerFn.call(this.cs!.ms!, scope, e);
    });
  }
  /**
   * 解析事件绑定函数
   *
   * @param {Record<string, any> | null} scope
   * @memberof OnParser
   */
  public parseEvent(scope: Record<string, any> | null): void {
    this.scope = scope!;

    this.handlerType = this.dirName!.substr(3);

    if (this.handlerType === "click" && !isPC()) {
      this.handlerType = "touchstart";
    }

    this.handlerFn = this.getHandler(this.dirValue!);

    this.addEvent();
  }
}
