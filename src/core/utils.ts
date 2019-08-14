/**
 * 是否为数组
 * @param {any} value
 * @return {Boolean}
 */
export function isArray(value: any): boolean {
  return Array.isArray(value);
}
/**
 * 是否为对象
 * @param {any} value
 * @return {Boolean}
 */
export function isObject(value: any): boolean {
  return Reflect.apply(Object.prototype.toString, value, []) === "[object Object]";
}
/**
 * 是否为函数
 * @param {any} value
 * @return {Boolean}
 */
export function isFunction(value: any): boolean {
  return Reflect.apply(Object.prototype.toString, value, []) === "[object Function]";
}
/**
 * 是否是元素节点
 *
 * @param {(HTMLElement|DocumentFragment)} value
 * @return {boolean}
 */
export function isElement(value: HTMLElement | DocumentFragment): boolean {
  return value.nodeType === 1;
}
/**
 * 是否是文本节点
 *
 * @param {any} value
 * @return {Boolean}
 */
export function isTextNode(value: HTMLElement): boolean {
  return value.nodeType === 3;
}
/**
 * 节点是否存在属性
 * @param   {HTMLElement}  node
 * @param   {String}   name
 * @return  {Boolean}
 */
function hasAttr(node: HTMLElement, name: string): boolean {
  return node.hasAttribute(name);
}
/**
 * 获取节点属性值
 * @param   {HTMLElement}  node
 * @param   {String}   name
 * @return  {String}
 */
export function getAttr(node: HTMLElement, name: string): string {
  return node.getAttribute(name) || "";
}
/**
 * 设置节点属性
 * @param  {HTMLElement}  node
 * @param  {String}   name
 * @param  {any}   value
 */
export function setAttr(node: HTMLElement, name: string, value: any): void {
  // 设为 null/undefined 和 false 移除该属性
  if (value == null || value === false) {
    removeAttr(node, name);
    return;
  }

  if (value === true) {
    (node as any)[name] = value;

    // 有些浏览器/情况下用 node[name] = true 是无法添加自定义属性的，此时设置一个空字符串
    if (!hasAttr(node, name)) {
      node.setAttribute(name, "");
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
export function removeAttr(node: HTMLElement, name: string): void {
  node.removeAttribute(name);
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
    current = " " + getAttr(node, "class") + " ";
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
 * @param {HTMLElement|DocumentFragment} node
 * @return {Boolean}
 */
export function hasDirective(node: HTMLElement | DocumentFragment | Node): boolean {
  if (isElement(node as HTMLElement | DocumentFragment) && (node as HTMLElement).hasAttributes()) {
    const nodeAttrs = (node as HTMLElement).attributes;

    for (let i = 0; i < nodeAttrs.length; i++) {
      if (isDirective(nodeAttrs[i].name)) {
        return true;
      }
    }
  } else if (isTextNode(node as HTMLElement) && /\{\{.*\}\}/.test(node.textContent)) {
    return true;
  }
}
/**
 * 是否含有延迟编译的节点(该节点及其后代节点延迟编译)
 *
 * @param {HTMLElement} node
 * @return {Boolean}
 */
export function hasLateCompileChilds(node: HTMLElement): boolean {
  return hasAttr(node, "v-if") || hasAttr(node, "v-for");
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
  if (!(isObject(source) || isArray(source))) return source;

  const target = isArray(source) ? [] : {};

  for (const key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      if (isObject(source[key]) || isArray(source[key])) {
        (target as T)[key] = cloneDeep(source[key]);
      } else {
        (target as T)[key] = source[key];
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
  let child;
  const fragment = document.createDocumentFragment();
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
  styleList.forEach(function(item: any): void {
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
