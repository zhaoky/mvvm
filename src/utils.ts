interface FunDictionary<U, T> {
  (...args: U[]): T;
}
/**
 * 是否为数组
 * @param {any} value
 * @return {Boolean}
 */
export function isArray(value: any): value is any[] {
  return Array.isArray(value);
}
/**
 * 是否是布尔值
 *
 * @export
 * @param {any} value
 * @return {boolean}
 */
export function isBoolean(value: any): value is boolean {
  return Reflect.apply(Object.prototype.toString, value, []) === "[object Boolean]";
}
/**
 * 是否为对象
 * @param {any} value
 * @return {Boolean}
 */
export function isObject(value: any): value is Record<string, any> {
  return Reflect.apply(Object.prototype.toString, value, []) === "[object Object]";
}
/**
 * 是否为Set类型
 * @param {any} value
 * @return {Boolean}
 */
export function isSet(value: any): value is Set<any> {
  return Reflect.apply(Object.prototype.toString, value, []) === "[object Set]";
}
/**
 * 是否为函数
 * @param {any} value
 * @return {Boolean}
 */
export function isFunction(value: any): value is FunDictionary<any, any> {
  return Reflect.apply(Object.prototype.toString, value, []) === "[object Function]";
}
/**
 * 是否是元素节点
 *
 * @param {HTMLElement | DocumentFragment} value
 * @return {boolean}
 */
export function isElement<T extends HTMLElement>(value: ChildNode): value is T {
  return value.nodeType === 1;
}
/**
 * 是否是文本节点
 *
 * @param {HTMLElement | DocumentFragment} value
 * @return {Boolean}
 */
export function isTextNode(value: ChildNode): value is Text {
  return value.nodeType === 3;
}
/**
 * 节点是否存在属性
 * @param   {K}   node
 * @param   {T}   name
 * @return  {Boolean}
 */
export function hasAttr<T extends HTMLElement, K extends string>(node: T, name: K): node is T {
  return node.hasAttribute(<string>name);
}
/**
 * 获取节点属性值
 * @param   {T}   node
 * @param   {K}   name
 * @return  {String}
 */
export function getAttr<T extends HTMLElement, K extends string>(node: T, name: K): any {
  return node.getAttribute(name) || "";
}
/**
 * 设置节点属性
 * @param  {HTMLElement}  node
 * @param  {String}   name
 * @param  {any}   value
 */
export function setAttr<T extends HTMLElement, K extends string>(node: T, name: K, value: any): void {
  // 设为 null/undefined 和 false 移除该属性
  if (value == null || value === false) {
    removeAttr(node, name);
    return;
  }

  if (value === true) {
    node[<keyof T>name] = value;

    // 有些浏览器/情况下用 node[name] = true 是无法添加自定义属性的，此时设置一个空字符串
    if (!hasAttr(node, name)) {
      (<T>node).setAttribute(name, "");
    }
  } else if (value !== getAttr(node, name)) {
    node.setAttribute(name, value);
  }
}
/**
 * 删除节点属性值
 *
 * @param {HTMLElement} node
 * @param {String} name
 */
export function removeAttr<T extends HTMLElement>(node: T, name: string): void {
  node.removeAttribute(<string>name);
}
/**
 * 节点是否存在 classname
 * @param   {HTMLElement}  node
 * @param   {String}   classname
 * @return  {Boolean}
 */
function hasClass(node: HTMLElement, classname: string): boolean {
  let current;
  const list = node.classList;
  if (list) {
    return list.contains(classname);
  } else {
    current = ` ${getAttr(node, "class")} `;
    return current.indexOf(" " + classname + " ") > -1;
  }
}
/**
 * 节点添加 classname
 * @param  {HTMLElement}  node
 * @param  {String}   classname
 */
export function addClass(node: HTMLElement, classname: string): void {
  let current;
  const list = node.classList;

  if (!classname || hasClass(node, classname)) {
    return;
  }

  if (list) {
    list.add(classname);
  } else {
    current = " " + getAttr(node, "class") + " ";

    if (current.indexOf(" " + classname + " ") === -1) {
      setAttr(node, "class", (current + classname).trim());
    }
  }
}
/**
 * 节点删除 classname
 * @param  {HTMLElement}  node
 * @param  {String}   classname
 */
export function removeClass(node: HTMLElement, classname: string): void {
  let current;
  let target;
  const list = node.classList;
  if (!classname || !hasClass(node, classname)) {
    return;
  }
  if (list) {
    list.remove(classname);
  } else {
    target = " " + classname + " ";
    current = " " + getAttr(node, "class") + " ";

    while (current.indexOf(target) > -1) {
      current = current.replace(target, " ");
    }

    setAttr(node, "class", current.trim());
  }
  if (!node.className) {
    removeAttr(node, "class");
  }
}
/**
 * 元素节点替换
 * @param  {HTMLElement}  oldChild
 * @param  {HTMLElement|Text}  newChild
 */
export function replaceNode(oldChild: HTMLElement, newChild: HTMLElement | Text): void {
  const parent = oldChild.parentNode;
  if (parent) {
    parent.replaceChild(newChild, oldChild);
  }
}
/**
 * 属性值是否是指令
 *
 * @param {String} directive
 * @return {Boolean}
 */
export function isDirective(directive: string): boolean {
  return directive.indexOf("v-") === 0;
}
/**
 * 节点是否含有指令
 *
 * @param {ChildNode} node
 * @return {Boolean}
 */
export function hasDirective(node: ChildNode): node is HTMLElement | Text {
  if (isElement(node) && node.hasAttributes()) {
    const nodeAttrs: NamedNodeMap = node.attributes;

    for (let i = 0; i < nodeAttrs.length; i++) {
      if (isDirective(nodeAttrs[i].name)) {
        return true;
      }
    }
    return false;
  } else if (isTextNode(node) && /\{\{.*\}\}/.test(node.textContent!)) {
    return true;
  } else {
    return false;
  }
}
/**
 * 是否含有延迟编译的节点(该节点及其后代节点延迟编译)
 *
 * @param {HTMLElement} node
 * @return {Boolean}
 */
export function hasLateCompileChilds<T extends HTMLElement>(node: T): node is T {
  return hasAttr(node, "v-if") || hasAttr(node, "v-for");
}
/**
 * 判断是否是 on 指令
 *
 * @export
 * @param {string} dirName
 * @return {*}  {boolean}
 */
export function dirNameHasOn(dirName: string): boolean {
  return /^on:.+$/.test(dirName);
}
/**
 * 转换成字符串，null转换为空字符串
 * @param {String} value
 * @return {String}
 */
export function _toString(value: string): string {
  return value == null ? "" : value.toString();
}
/**
 * 简易深拷贝
 *
 * @param {any} source
 * @return {Object}
 */
export function cloneDeep<T>(source: T): T {
  if (!(isObject(source) || isArray(source) || isSet(source))) return source;

  const target = isArray(source) ? [] : isObject(source) ? {} : new Set();

  if (isSet(source)) {
    source.forEach((val) => {
      (<Set<any>>target).add(cloneDeep(val));
    });
  } else {
    for (const key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        if (isObject(source[key]) || isArray(source[key])) {
          (target as T)[key] = cloneDeep(source[key]);
        } else {
          (target as T)[key] = source[key];
        }
      }
    }
  }

  return target as T;
}
/**
 * 生成文档片段
 *
 * @param {HTMLElement} element
 * @return {DocumentFragment}
 */
export function nodeToFragment(element: HTMLElement): DocumentFragment {
  let child: ChildNode | null;
  const fragment: DocumentFragment = document.createDocumentFragment();
  while ((child = element.firstChild)) {
    fragment.appendChild(child);
  }
  return fragment;
}
/**
 * 处理 styleObject, 批量更新元素 style
 * @param  {HTMLElement}  element
 * @param  {any}   styleObject
 */
export function updateStyle(element: HTMLElement, styleObject: Record<string, any>): void {
  const style = element.style;

  if (!isObject(styleObject)) {
    return;
  }
  const styleList = Object.keys(styleObject);
  styleList.forEach(function (item: any): void {
    if (style[item] !== styleObject[item]) {
      style[item] = styleObject[item];
    }
  });
}
/**
 * 判断是否为PC
 *
 * @return {Boolean}
 */
export function isPC(): boolean {
  const u = navigator.userAgent;
  const Agents = ["Android", "iPhone", "webOS", "BlackBerry", "SymbianOS", "Windows Phone", "iPad", "iPod"];
  let flag = true;
  for (let i = 0; i < Agents.length; i++) {
    if (u.indexOf(Agents[i]) > 0) {
      flag = false;
      break;
    }
  }
  return flag;
}
