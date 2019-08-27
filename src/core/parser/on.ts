import { ParserOptionInterface, ParserOnInterface, OnHandlerInterface } from "./../interface";
import { isPC } from "./../utils";
import BaseParser from "./base";
/**
 * 派生类 OnParser
 *
 * @class OnParser
 * @extends {BaseParser}
 */
export default class OnParser extends BaseParser implements ParserOnInterface {
  private scope: Record<string, any>;
  private handlerType: string;
  private handlerFn: OnHandlerInterface;
  /**
   *Creates an instance of OnParser.
   * @param {ParserOptionInterface} { node, dirName, dirValue, cs }
   * @memberof OnParser
   */
  public constructor({ node, dirName, dirValue, cs }: ParserOptionInterface) {
    super({ node, dirName, dirValue, cs });
  }
  /**
   *  解析事件绑定函数
   *
   * @param {Object} scope
   * @memberof OnParser
   */
  public parseEvent(scope: Record<string, any>): void {
    this.scope = scope;

    this.handlerType = this.dirName.substr(3);

    if (this.handlerType === "click" && !isPC()) {
      this.handlerType = "touchstart";
    }

    this.handlerFn = this.getHandler(this.dirValue);

    this.addEvent();
  }
  /**
   * 生成事件处理函数
   *
   * @param {String} expression
   * @return {*}
   * @memberof OnParser
   */
  public getHandler(expression: string): OnHandlerInterface {
    expression = expression.trim();

    if (/^(\S+?)\(.*\)$/g.test(expression)) {
      expression = expression.replace(/^(\S+?)(?=\()/, "scope._eventHandler.$1");
    } else {
      expression = `scope._eventHandler.${expression}()`;
    }
    expression = expression.replace(/([(,])(\S+?)(?=[,)])/g, (_match: any, $1: any, $2: any): string => {
      if ($2 === "$event") {
        return `${$1}${$2}`;
      }
      return `${$1}scope.${$2}`;
    });

    try {
      return new Function("scope,$event", `${expression}`) as OnHandlerInterface;
    } catch {
      throw Error(`Check the expression for errors`);
    }
  }
  /**
   * 绑定事件
   *
   * @memberof OnParser
   */
  public addEvent(): void {
    const el = this.el;
    const handlerType = this.handlerType;
    const handlerFn = this.handlerFn;
    const scope = this.scope || this.cs.$data;

    el.addEventListener(handlerType, (e: Event): void => {
      handlerFn(scope, e);
    });
  }
}
