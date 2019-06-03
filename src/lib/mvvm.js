/**
 * 是否为数组
 * @param {Array} array
 * @return {Boolean}
 */
function isArray(array) {
  return Array.isArray(array);
}
/**
 * 是否为对象
 * @param {Obejct} obj
 * @return {Boolean}
 */
function isObject(obj) {
  return Object.prototype.toString.call(obj) === "[object Object]";
}
/**
 * 是否为函数
 * @param {Obejct} obj
 * @return {Boolean}
 */
function isFunction(obj) {
  return Object.prototype.toString.call(obj) === "[object Function]";
}
/**
 * 是否是元素节点
 *
 * @param {Element} element
 * @return {Boolean}
 */
function isElement(element) {
  return element.nodeType === 1;
}
/**
 * 是否是文本节点
 *
 * @param {*} element
 * @return {Boolean}
 */
function isTextNode(element) {
  return element.nodeType === 3;
}
/**
 * 节点是否存在属性
 * @param   {Element}  node
 * @param   {String}   name
 * @return  {Boolean}
 */
function hasAttr(node, name) {
  return node.hasAttribute(name);
}
/**
 * 获取节点属性值
 * @param   {Element}  node
 * @param   {String}   name
 * @return  {String}
 */
function getAttr(node, name) {
  return node.getAttribute(name) || "";
}
/**
 * 设置节点属性
 * @param  {Element}  node
 * @param  {String}   name
 * @param  {String}   value
 * @return {*}
 */
function setAttr(node, name, value) {
  // 设为 null/undefined 和 false 移除该属性
  if (value == null || value === false) {
    return removeAttr(node, name);
  }

  if (value === true) {
    node[name] = value;

    // 有些浏览器/情况下用 node[name] = true
    // 是无法添加自定义属性的，此时设置一个空字符串
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
 * @param {Element} node
 * @param {String} name
 */
function removeAttr(node, name) {
  node.removeAttribute(name);
}
/**
 * 节点是否存在 classname
 * @param   {Element}  node
 * @param   {String}   classname
 * @return  {Boolean}
 */
function hasClass(node, classname) {
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
 * @param  {Element}  node
 * @param  {String}   classname
 */
function addClass(node, classname) {
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
 * @param  {Element}  node
 * @param  {String}   classname
 */
function removeClass(node, classname) {
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
 * 属性值是否是指令
 *
 * @param {Attribute} directive
 * @return {Boolean}
 */
function isDirective(directive) {
  return directive.indexOf("v-") === 0;
}
/**
 * 节点是否含有指令
 *
 * @param {Element} node
 * @return {Boolean}
 */
function hasDirective(node) {
  if (isElement(node) && node.hasAttributes()) {
    const nodeAttrs = node.attributes;

    for (let i = 0; i < nodeAttrs.length; i++) {
      if (isDirective(nodeAttrs[i].name)) {
        return true;
      }
    }
  } else if (isTextNode(node) && /(\{\{.*\}\})/.test(node.textContent)) {
    return true;
  }
}
/**
 * 是否含有延迟编译的节点
 *
 * @param {Element} node
 * @return {Boolean}
 */
function hasLateCompileChilds(node) {
  return hasAttr(node, "v-if") || hasAttr(node, "v-for");
}
/**
 * 转换成字符串，null转换为空字符串
 * @param {*} value
 * @return {String}
 */
function _toString(value) {
  return value == null ? "" : value.toString();
}
/**
 * 结构化克隆算法
 *
 * @param {Object} obj
 * @return {Object}
 */
function structuralClone(obj) {
  const oldState = history.state;
  history.replaceState(obj, document.title);
  const copy = history.state;
  history.replaceState(oldState, document.title);
  return copy;
}
/**
 * 生成文档片段
 *
 * @param {Element} element
 * @return {Object}
 */
function nodeToFragment(element) {
  let child;
  const fragment = document.createDocumentFragment();
  while ((child = element.firstChild)) {
    fragment.appendChild(child);
  }
  return fragment;
}
/**
 * 处理 styleObject, 批量更新元素 style
 * @param  {Element}  element
 * @param  {String}   styleObject
 * @return {*}
 */
function updateStyle(element, styleObject) {
  const style = element.style;

  if (!isObject(styleObject)) {
    return warn("v-style for style must be a type of Object", styleObject);
  }
  const styleList = Object.keys(styleObject);
  styleList.forEach(function(item) {
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
function isPC() {
  const u = navigator.userAgent;
  const Agents = [
    "Android",
    "iPhone",
    "webOS",
    "BlackBerry",
    "SymbianOS",
    "Windows Phone",
    "iPad",
    "iPod"
  ];
  let flag = true;
  for (let i = 0; i < Agents.length; i++) {
    if (u.indexOf(Agents[i]) > 0) {
      flag = false;
      break;
    }
  }
  return flag;
}
// --------------------------------------
// --------------------------------------

let curWatcher = null;
let dependId = 0;
/**
 * MVVM入口
 *
 * @export
 * @param {object} option
 */
export class MVVM {
  /**
   * Creates an instance of MVVM.
   * @param {Obejct} option
   * @memberof MVVM
   */
  constructor(option) {
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
/**
 *
 *
 * @class Compiler
 */
class Compiler {
  /**
   * Creates an instance of Compiler.
   * @param {Object} option
   * @memberof Compiler
   */
  constructor(option) {
    this.$queue = []; // 指令缓存队列
    this.$element = option.view; // 缓存根节点
    this.$data = option.model; // 数据模型对象
    this.$context = this; // 保存当前环境
    this.$done = false; // 是否完成编译标记位
    this.$mounted = option.mounted;

    Observer.createObserver(this.$data); //* ** 这里进入数据监听模块 ***/

    if (isObject(option.methods)) {
      const _eventHandler = (option.model["_eventHandler"] = {});
      const methods = option.methods;

      const keys = Object.keys(methods);

      keys.forEach(key => {
        _eventHandler[key] = methods[key];
      });
    }

    this.$fragment = nodeToFragment(this.$element);
    this.collectDir(this.$fragment, true);
  }

  /**
   * 收集节点所有需要编译的指令
   * 并在收集完成后编译指令列表
   * @param {Object} element [要收集指令的dom节点]
   * @param {Boolean} root [是否是根节点]
   * @param {Object} scope [v-for作用域]
   * @memberof Compiler
   */
  collectDir(element, root, scope) {
    if (root && hasDirective(element)) {
      this.$queue.push([element, scope]);
    }

    const children = element.childNodes;
    const childrenLen = children.length;

    for (let i = 0; i < childrenLen; i++) {
      const node = children[i];
      const nodeType = node.nodeType;

      if (nodeType !== 1 && nodeType !== 3) {
        continue;
      }
      if (hasDirective(node)) {
        this.$queue.push([node, scope]);
      }
      if (node.hasChildNodes() && !hasLateCompileChilds(node)) {
        this.collectDir(node, false, scope);
      }
    }

    if (root) {
      for (let i = 0; i < this.$queue.length; i++) {
        this.compileNode(this.$queue[i]);
        this.$queue.splice(i, 1);
        i--;
      }
      this.completed(scope);
    }
  }

  /**
   * 编译收集到的每一个节点
   * 提取指令交给不同的编译器编译
   * @param {Array} item
   * @memberof Compiler
   */
  compileNode(item) {
    const node = item[0];
    const scope = item[1];

    if (isElement(node)) {
      let attrs = [];
      const nodeAttrs = node.attributes;
      const nodeAttrsLen = nodeAttrs.length;

      for (let i = 0; i < nodeAttrsLen; i++) {
        const attr = nodeAttrs[i];
        if (!isDirective(attr.name)) {
          continue;
        }
        if (attr.name === "v-for") {
          attrs = [attr];
          break;
        }
        attrs.push(attr);
      }

      attrs.map(at => {
        this.parseAttr(node, at, scope);
      });
    } else if (isTextNode(node)) {
      this.parseText(node, scope);
    }
  }

  /**
   * 解析元素节点收集到的每个指令
   * 解析器只做好两件事：1.将刷新函数订阅到 Model 的变化监测中；2.初始状态更新
   * @param {Element} node
   * @param {Object} attr
   * @param {Object} scope
   * @memberof Compiler
   */
  parseAttr(node, attr, scope) {
    const { name, value: dirValue } = attr;
    const dirName = name.substr(2);

    removeAttr(node, name);

    const parser = this.selectParsers(dirName, node, dirValue, this);

    if (/^on:.+$/.test(dirName)) {
      parser.parseEvent(scope);
      return;
    }
    const watcher = new Watcher(parser, scope);

    parser.update(watcher.value);
  }

  /**
   * 解析指令为文本节点
   *
   * @param {Element} node
   * @param {Object} scope
   * @memberof Compiler
   */
  parseText(node, scope) {
    // TODO
  }

  /**
   * 根据dir不同选择不同的解析器
   *
   * @param {String} dirName
   * @param {Element} node
   * @param {String} dirValue
   * @param {Object} compilerScope
   * @memberof Compiler
   * @return {Object}
   */
  selectParsers(dirName, node, dirValue, compilerScope) {
    let parser;
    let name = dirName;
    if (/^on:.+$/.test(name)) {
      name = "on";
    }
    switch (name) {
      case "text":
        parser = new TextParser({ node, dirValue, compilerScope });
        break;
      case "style":
        parser = new StyleParser({ node, dirValue, compilerScope });
        break;
      case "class":
        parser = new ClassParser({ node, dirValue, compilerScope });
        break;
      case "for":
        parser = new ForParser({ node, dirValue, compilerScope });
        break;
      case "on":
        parser = new OnParser({ node, dirName, dirValue, compilerScope });
        break;
      default:
        parser = new OtherParser({ node, dirName, dirValue, compilerScope });
    }

    return parser;
  }

  /**
   * 收集、编译，解析完成后
   *
   * @param {Object} scope
   * @memberof Compiler
   */
  completed(scope) {
    if (this.$done) {
      return;
    }

    this.$done = true;
    this.$element.appendChild(this.$fragment);
    delete this.$fragment;

    if (!scope && isFunction(this.$mounted)) {
      this.$mounted();
    }
  }
}
/**
 * 基类
 *
 * @class BaseParser
 */
class BaseParser {
  /**
   * Creates an instance of BaseParser.
   * @param {Element} node
   * @param {String} dirName
   * @param {String} dirValue
   * @param {Obejct} compilerScope
   * @memberof BaseParser
   */
  constructor({ node, dirName, dirValue, compilerScope }) {
    this.el = node;
    if (dirName) {
      this.dirName = dirName;
    }
    if (dirValue) {
      this.dirValue = dirValue;
    }
    if (compilerScope) {
      this.vm = compilerScope;
    }
  }
}
/**
 * 派生类 TextParser
 *
 * @class TextParser
 * @extends {BaseParser}
 */
class TextParser extends BaseParser {
  /**
   * Creates an instance of TextParser.
   * @param {Element} node
   * @param {String} dirValue
   * @param {Obejct} compilerScope
   * @memberof TextParser
   */
  constructor({ node, dirValue, compilerScope }) {
    super({ node, dirValue, compilerScope });
  }
  /**
   * text刷新视图函数
   *
   * @param {String} newValue
   * @memberof TextParser
   */
  update(newValue) {
    this.el.textContent = _toString(newValue);
  }
}
/**
 * 派生类 StyleParser
 *
 * @class StyleParser
 * @extends {BaseParser}
 */
class StyleParser extends BaseParser {
  /**
   * Creates an instance of StyleParser.
   * @param {Element} node
   * @param {String} dirValue
   * @param {Object} compilerScope
   * @memberof StyleParser
   */
  constructor({ node, dirValue, compilerScope }) {
    super({ node, dirValue, compilerScope });
  }
  /**
   * style刷新视图函数
   *
   * @param {Object} newValue
   * @param {Object} oldValue
   * @memberof StyleParser
   */
  update(newValue, oldValue) {
    if (oldValue) {
      const keys = Object.keys(oldValue);
      keys.map(item => {
        keys[item] = "";
      });
    }
    updateStyle(this.el, newValue);
  }
}
/**
 * 派生类 ClassParser
 *
 * @class ClassParser
 * @extends {BaseParser}
 */
class ClassParser extends BaseParser {
  /**
   * Creates an instance of ClassParser.
   * @param {Element} node
   * @param {String} dirValue
   * @param {Object} compilerScope
   * @memberof ClassParser
   */
  constructor({ node, dirValue, compilerScope }) {
    super({ node, dirValue, compilerScope });
  }
  /**
   * class刷新视图函数
   *
   * @param {String} newValue
   * @param {String} oldValue
   * @memberof ClassParser
   */
  update(newValue, oldValue) {
    if (oldValue) {
      const oldClassList = oldValue.split(" ");
      oldClassList.map(item => {
        removeClass(this.el, item);
      });
    }
    const classList = newValue.split(" ");
    classList.map(item => {
      addClass(this.el, item);
    });
  }
}
/**
 * 派生类 ForParser
 *
 * @class ForParser
 * @extends {BaseParser}
 */
class ForParser extends BaseParser {
  /**
   * Creates an instance of ForParser.
   * @param {Element} node
   * @param {String} dirValue
   * @param {Object} compilerScope
   * @memberof ForParser
   */
  constructor({ node, dirValue, compilerScope }) {
    super({ node, dirValue, compilerScope });
    this.init = true;
    this.parent = node.parentNode;
    this.end = node.nextSibling;
    this.start = node.previousSibling;
    const match = dirValue.match(/(.*) (?:in|of) (.*)/);
    this.alias = match[1];
    this.dirValue = match[2];
    this.scopes = [];
    this.partlyNewArray = [];
  }
  /**
   * for刷新视图函数
   *
   * @param {Array} newValue
   * @param {Array} oldValue
   * @param {Object} args
   * @memberof ForParser
   */
  update(newValue, oldValue, args) {
    if (this.init) {
      const parentNode = this.el.parentNode;
      parentNode.replaceChild(this.buildList(newValue), this.el);
      this.init = false;
    } else {
      const partlyMethods = "push|pop|shift|unshift|splice".split("|");
      if (args && partlyMethods.indexOf(args.method) > -1) {
        this.updatePartly(newValue, args);
      } else {
        this.recompileList(newValue);
      }
    }
  }
  /**
   * 构建数组
   *
   * @param {Array} newArray
   * @param {Number} startIndex
   * @param {Boolean} isPartly 是否是部分更新
   * @return {Object}
   * @memberof ForParser
   */
  buildList(newArray, startIndex, isPartly) {
    const listFragment = document.createDocumentFragment();
    const start = startIndex || 0;
    const tpl = this.el.cloneNode(true);

    newArray.map((item, i) => {
      const frag = tpl.cloneNode(true);
      const index = start + i;
      const scope = Object.create(this.vm.$data);
      const alias = this.alias;

      Observer.observe(scope, alias, item);
      Observer.observe(scope, "$index", index);

      if (isPartly) {
        this.partlyNewArray.push(scope);
      } else {
        this.scopes.push(scope);
      }

      if (this.init) {
        const $queue = this.vm.$queue;
        $queue.find((item, index) => {
          if (item[0] === this.el) {
            $queue.splice(index, 1);
            return true;
          }
        });
      }

      Object.defineProperty(frag, "__vfor__", {
        value: alias,
        writable: true,
        enumerable: false,
        configurable: true
      });

      this.vm.collectDir(frag, true, scope);
      listFragment.appendChild(frag);
    });
    return listFragment;
  }
  /**
   * 数组部分更新
   *
   * @param {Array} newArray
   * @param {Object} args
   * @memberof ForParser
   */
  updatePartly(newArray, args) {
    // 更新处理 DOM 片段
    this[args.method].call(this, newArray, args.args);

    this.scopes[args.method](...this.partlyNewArray);
    this.partlyNewArray.length = 0;

    this.scopes.map((item, index) => {
      item.$index = index;
    });
  }
  /**
   * 整体重建数组
   *
   * @param {Array} newArray
   * @memberof ForParser
   */
  recompileList(newArray) {
    const parent = this.parent;
    const childs = parent.childNodes;

    for (let i = 0; i < childs.length; i++) {
      if (childs[i]["__vfor__"] == this.alias) {
        parent.removeChild(childs[i]);
        i--;
      }
    }

    this.scopes.length = 0;

    const listFragment = this.buildList(newArray);
    parent.insertBefore(listFragment, this.end);
  }
  /**
   * 列表数组操作 push
   *
   * @param {Array} newArray
   * @param {Object} args
   * @memberof ForParser
   */
  push(newArray, args) {
    const newPartArray = this.buildList(args, newArray.length - 1, true);

    this.parent.insertBefore(newPartArray, this.end);
  }
  /**
   * 列表数组操作 unshift
   *
   * @param {Array} newArray
   * @param {Object} args
   * @memberof ForParser
   */
  unshift(newArray, args) {
    const newPartArray = this.buildList(args, 0, true);
    this.parent.insertBefore(newPartArray, this.start);
  }
  /**
   * 列表数组操作 pop
   *
   * @memberof ForParser
   */
  pop() {
    this.removeChild(this.end.previousSibling);
  }
  /**
   * 列表数组操作 shift
   *
   * @memberof ForParser
   */
  shift() {
    this.removeChild(this.start.nextSibling);
  }
  /**
   * 列表数组操作 spilce
   *
   * @memberof ForParser
   */
  spilce() {
    // TODO
  }
}
/**
 * 派生类 OnParser
 *
 * @class OnParser
 * @extends {BaseParser}
 */
class OnParser extends BaseParser {
  /**
   *Creates an instance of OnParser.
   * @param {Element} node
   * @param {String} dirName
   * @memberof OnParser
   */
  constructor({ node, dirName, dirValue, compilerScope }) {
    super({ node, dirName, dirValue, compilerScope });
  }
  /**
   *  解析事件绑定函数
   *
   * @param {Object} scope
   * @memberof OnParser
   */
  parseEvent(scope) {
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
  getHandler(expression) {
    expression = expression.trim();

    if (/^(\S+?)\(.*\)$/g.test(expression)) {
      expression = expression.replace(
        /^(\S+?)(?=\()/,
        "scope._eventHandler.$1"
      );
    } else {
      expression = `scope._eventHandler.${expression}()`;
    }

    expression = expression.replace(/(?<=[(,])(\S+?)(?=[,)])/g, (match, $1) => {
      if ($1 === "$event") {
        return $1;
      }
      return `scope.${$1}`;
    });

    try {
      return new Function("scope,$event", `${expression}`);
    } catch {
      throw Error(`Check the expression for errors`);
    }
  }
  /**
   * 绑定事件
   *
   * @memberof OnParser
   */
  addEvent() {
    const el = this.el;
    const handlerType = this.handlerType;
    const handlerFn = this.handlerFn;
    const scope = this.scope || this.vm.$data;

    el.addEventListener(handlerType, e => {
      handlerFn(scope, e);
    });
  }
}
/**
 * 派生类 OtherParser
 *
 * @class OtherParser
 * @extends {BaseParser}
 */
class OtherParser extends BaseParser {
  /**
   *Creates an instance of OtherParser.
   * @param {Element} node
   * @param {String} dirName
   * @memberof OtherParser
   */
  constructor({ node, dirName, dirValue, compilerScope }) {
    super({ node, dirName, dirValue, compilerScope });
  }
  /**
   *  other更新函数
   *
   * @param {String} newValue
   * @memberof OtherParser
   */
  update(newValue) {
    setAttr(this.el, this.dirName, newValue);
  }
}
/**
 * 给监听属性添加watcher
 *
 * @class Watcher
 */
class Watcher {
  /**
   *Creates an instance of Watcher.
   * @param {Object} parser
   * @param {Object} scope
   * @memberof Watcher
   */
  constructor(parser, scope) {
    this.watchers = [];
    this.vm = parser.vm;
    this.el = parser.el;
    this.dirValue = parser.dirValue;
    this.callback = parser.update;
    this.depIds = []; // 依赖列表的id群
    this.oldVal = null;
    this.parser = parser;
    this.scope = scope;
    this.value = this.get();
  }
  /**
   * 获取当前属性值
   *
   * @return {*}
   * @memberof Watcher
   */
  get() {
    curWatcher = this; // 当前节点装到watcher里,然后放到对应属性的通知列表里。

    const value = this._getter(this.dirValue)(this.scope || this.vm.$data);

    curWatcher = null;
    return value;
  }
  /**
   * _getter实现
   *
   * @param {String} expression
   * @return {Function}
   * @memberof Watcher
   */
  _getter(expression) {
    try {
      return new Function("scope", `with(scope){return ${expression}};`);
    } catch {
      throw Error(`The attribute value:'${expression}' must be not keyword.`);
    }
  }
  /**
   * 更新值之前
   *
   * @memberof Watcher
   */
  beforeUpdate() {
    this.oldVal = structuralClone(this.value);
  }
  /**
   * 更新值之后
   * 触发回调列表
   * @param {Obejct} args
   * @memberof Watcher
   */
  update(args) {
    const newVal = (this.value = this.get());

    this.callback.call(this.parser, newVal, this.oldVal, args);
  }
}
/**
 * 监测数据模型
 *
 * @class Observer
 */
class Observer {
  /**
   * Creates an instance of Observer.
   * @param {Object} target
   * @memberof Observer
   */
  constructor(target) {
    this.dependList = [];

    isArray(target) ? this.observeArray(target) : this.observeObject(target);

    Object.defineProperty(target, "__ob__", {
      value: this,
      writable: true,
      enumerable: false,
      configurable: true
    });
  }
  /**
   * 监测对象
   *
   * @param {Object} obj
   * @memberof Observer
   */
  observeObject(obj) {
    const keys = Object.keys(obj);

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      Observer.observe(obj, key, obj[key]);
    }
  }
  /**
   * 监测数组
   *
   * @param {Array} arr
   * @memberof Observer
   */
  observeArray(arr) {
    this.extendArrayProto(arr);

    arr.map(item => {
      Observer.createObserver(item);
    });
  }
  /**
   * 数组方法扩展
   *
   * @param {Array} arr
   * @memberof Observer
   */
  extendArrayProto(arr) {
    const arrayMethods = [
      "pop",
      "push",
      "sort",
      "shift",
      "splice",
      "unshift",
      "reverse"
    ];
    const arrayProto = Array.prototype;
    const extendProto = Object.create(arrayProto);
    const _this = this;

    arrayMethods.map(method => {
      Object.defineProperty(extendProto, method, {
        value(...args) {
          const ob = this.__ob__;
          ob.dependList.map(item => {
            item.beforeUpdate();
          });
          const original = arrayProto[method];
          const result = original.apply(this, ...args);
          let inserts;
          switch (method) {
            case "push":
            case "unshift":
              inserts = args;
              break;
            case "splice":
              inserts = args.slice(2);
              break;
          }

          if (inserts && inserts.length) {
            _this.observeArray(inserts);
          }

          ob.dependList.map(item => {
            item.update({ method, args, source: this });
          });
          return result;
        },
        writable: true,
        enumerable: false,
        configurable: true
      });
    });

    arr.__proto__ = extendProto;
  }
  /**
   * 监测对象
   *
   * @static
   * @param {Object} obj
   * @param {String} key
   * @param {String} value
   * @memberof Observer
   */
  static observe(obj, key, value) {
    const dependList = []; // 该属性收集到的需要通知的watcher（节点）列表
    const curId = ++dependId;
    const childOb = Observer.createObserver(value);

    Object.defineProperty(obj, key, {
      get: () => {
        console.log(obj, key);
        if (curWatcher && curWatcher.depIds.indexOf(curId) < 0) {
          curWatcher.depIds.push(curId); // 一个节点被xx个属性同时监听
          dependList.push(curWatcher);
          if (childOb) {
            childOb.dependList.push(curWatcher);
          }
        }

        return value;
      },

      set: newValue => {
        console.log(obj, key);
        if (newValue === value) {
          return;
        }
        dependList.map(item => {
          item.beforeUpdate();
        });
        value = newValue;

        Observer.createObserver(newValue);

        dependList.map(item => {
          item.update();
        });
      }
    });
  }
  /**
   * 创建监测对象
   *
   * @static
   * @param {Object} target
   * @return {Object}
   * @memberof Observer
   */
  static createObserver(target) {
    if (isArray(target) || isObject(target)) {
      return target.hasOwnProperty("__ob__")
        ? target.__ob__
        : new Observer(target);
    }
  }
}
