/**
 * 是否为数组
 * @param {*} array
 * @return {Boolean}
 */
function isArray(array) {
  return Array.isArray(array);
}
/**
 * 是否为对象
 * @param {*} obj
 * @return {Boolean}
 */
function isObject(obj) {
  return Object.prototype.toString.call(obj) === "[object Object]";
}
/**
 * 是否是元素节点
 *
 * @param {*} element
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
 * @return {undefined}
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
 * @return {undefined}
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
 * @return {undefined}
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
 * @return {undefined}
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
 * @param {attribute} directive
 * @return {Boolean}
 */
function isDirective(directive) {
  return directive.indexOf("v-") === 0;
}
/**
 * 节点是否含有指令
 *
 * @param {node} node
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
 * @param {*} node
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
 * @param {*} obj
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
 * @param {node} element
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
 * @return {Object}
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
   *Creates an instance of MVVM.
   * @param {*} option
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
    new Compiler(option); // 进入编译主程序
  }
}
/**
 *
 *
 * @class Compiler
 */
class Compiler {
  /**
   *Creates an instance of Compiler.
   * @param {*} option
   * @memberof Compiler
   */
  constructor(option) {
    this.$queue = []; // 指令缓存队列
    this.$element = option.view; // 缓存根节点
    this.$data = option.model; // 数据模型对象
    this.$context = this; // 保存当前环境
    this.$done = false; // 是否完成标记位

    Observer.createObserver(this.$data); //* ** 这里进入数据监听模块 ***/

    this.$fragment = nodeToFragment(this.$element);
    this.collectDir(this.$fragment, true);
  }

  /**
   * 收集节点所有需要编译的指令
   * 并在收集完成后编译指令列表
   * @param {Object} element [要收集指令的dom节点]
   * @param {*} root [是否是根节点]
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
      this.$queue.map(item => {
        this.compileNode(item);
      });
      this.completed();
    }
  }

  /**
   * 编译收集到的每一个节点
   * 提取指令交给不同的编译器编译
   * @param {*} item
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
    // args: undefined attr: "v-text" directive: "v-text" expression: "title"
    const { name, value: dirValue } = attr;
    const dir = name.substr(2);

    removeAttr(node, name);

    const parser = this.selectParsers(dir, node, dirValue, this);

    const watcher = new Watcher(parser, scope);

    parser.update(watcher.value);
  }

  /**
   * 解析指令为文本节点
   *
   * @param {Element} node
   * @param {Object} scope
   * @memberof Compiler
   * @return {undefined}
   */
  parseText(node, scope) {
    // TODO
  }

  /**
   * 根据dir不同选择不同的解析器
   *
   * @param {*} dir
   * @param {*} node
   * @param {*} dirValue
   * @param {*} compilerScope
   * @memberof Compiler
   * @return {object}
   */
  selectParsers(dir, node, dirValue, compilerScope) {
    let parser;

    switch (dir) {
      case "text":
        parser = new TextParser(node, dirValue, compilerScope);
        break;
      case "style":
        parser = new StyleParser(node, dirValue, compilerScope);
        break;
      case "class":
        parser = new ClassParser(node, dirValue, compilerScope);
        break;
      case "for":
        parser = new ForParser(node, dirValue, compilerScope);
        break;
      default:
        parser = new OtherParser(node, dirValue, compilerScope);
    }

    return parser;
  }

  /**
   * 收集、编译，解析完成后
   *
   * @memberof Compiler
   * @return {undefined}
   */
  completed() {
    if (this.$done) {
      return;
    }

    this.$done = true;
    this.$element.appendChild(this.$fragment);
    delete this.$fragment;
  }
}
/**
 *
 *
 * @class BaseParser
 */
class BaseParser {
  /**
   *Creates an instance of BaseParser.
   * @param {*} node
   * @param {*} dirValue
   * @param {*} compilerScope
   * @memberof BaseParser
   */
  constructor(node, dirValue, compilerScope) {
    this.el = node;
    this.vm = compilerScope;
    this.dirValue = dirValue;
  }
  /**
   *
   *
   * @memberof BaseParser
   */
  update() {
    // TODO
  }
}
/**
 *
 *
 * @class TextParser
 * @extends {BaseParser}
 */
class TextParser extends BaseParser {
  /**
   *Creates an instance of TextParser.
   * @param {*} node
   * @param {*} dirValue
   * @param {*} compilerScope
   * @memberof TextParser
   */
  constructor(node, dirValue, compilerScope) {
    super(node, dirValue, compilerScope);
  }
  /**
   *
   *
   * @param {*} newValue
   * @memberof TextParser
   */
  update(newValue) {
    this.el.textContent = _toString(newValue);
  }
}
/**
 *
 *
 * @class StyleParser
 * @extends {BaseParser}
 */
class StyleParser extends BaseParser {
  /**
   *Creates an instance of StyleParser.
   * @param {*} node
   * @param {*} dirValue
   * @param {*} compilerScope
   * @memberof StyleParser
   */
  constructor(node, dirValue, compilerScope) {
    super(node, dirValue, compilerScope);
  }
  /**
   *
   *
   * @param {*} newValue
   * @param {*} oldValue
   * @return {undefined}
   * @memberof StyleParser
   */
  update(newValue, oldValue) {
    if (oldValue) {
      const keys = Object.keys(oldValue);
      keys.map(item => {
        keys[item] = "";
      });
      updateStyle(this.el, newValue);
      return;
    }
    updateStyle(this.el, newValue);
  }
}
/**
 *
 *
 * @class ClassParser
 * @extends {BaseParser}
 */
class ClassParser extends BaseParser {
  /**
   *Creates an instance of ClassParser.
   * @param {*} node
   * @param {*} dirValue
   * @param {*} compilerScope
   * @memberof ClassParser
   */
  constructor(node, dirValue, compilerScope) {
    super(node, dirValue, compilerScope);
  }
  /**
   *
   *
   * @param {*} newValue
   * @param {*} oldValue
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
 *
 *
 * @class ForParser
 * @extends {BaseParser}
 */
class ForParser extends BaseParser {
  /**
   *Creates an instance of ForParser.
   * @param {*} node
   * @param {*} dirValue
   * @param {*} compilerScope
   * @memberof ForParser
   */
  constructor(node, dirValue, compilerScope) {
    super(node, dirValue, compilerScope);
    this.init = true;
    this.parent = node.parentNode;
    this.end = node.nextSibling;
    this.start = node.previousSibling;
    const match = dirValue.match(/(.*) (?:in|of) (.*)/);
    this.alias = match[1];
    this.dirValue = match[2];
  }
  /**
   *
   *
   * @param {*} newValue
   * @param {*} oldValue
   * @param {*} args
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
   *
   *
   * @param {*} newArray
   * @param {*} startIndex
   * @return {object}
   * @memberof ForParser
   */
  buildList(newArray, startIndex) {
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
      this.vm.collectDir(frag, true, scope);
      listFragment.appendChild(frag);
    });
    return listFragment;
  }
  /**
   *
   *
   * @param {*} newArray
   * @param {*} args
   * @memberof ForParser
   */
  updatePartly(newArray, args) {
    // 更新处理 DOM 片段
    this[args.method].call(this, newArray, args.args);
  }
  /**
   *
   *
   * @param {*} newArray
   * @memberof ForParser
   */
  recompileList(newArray) {
    const parent = this.parent;
    const childs = parent.childNodes;
    for (let i = 0; i < childs.length; i++) {
      parent.removeChild(childs[i]);
      i--;
    }
    const listFragment = this.buildList(newArray);
    parent.insertBefore(listFragment, this.end);
  }
  /**
   *
   *
   * @param {*} newArray
   * @param {*} args
   * @memberof ForParser
   */
  push(newArray, args) {
    const item = this.buildList(args, newArray.length - 1);
    this.parent.insertBefore(item, this.end);
  }
  /**
   *
   *
   * @param {*} newArray
   * @param {*} args
   * @memberof ForParser
   */
  unshift(newArray, args) {
    const item = this.buildList(args, 0);
    this.parent.insertBefore(item, this.start);
  }
  /**
   *
   *
   * @memberof ForParser
   */
  pop() {
    this.removeChild(this.end.previousSibling);
  }
  /**
   *
   *
   * @memberof ForParser
   */
  shift() {
    this.removeChild(this.start.nextSibling);
  }
  /**
   *
   *
   * @memberof ForParser
   */
  spilce() {
    // todo
  }
}
/**
 *
 *
 * @class OtherParser
 * @extends {BaseParser}
 */
class OtherParser extends BaseParser {
  /**
   *Creates an instance of OtherParser.
   * @param {*} node
   * @param {*} dirValue
   * @param {*} compilerScope
   * @memberof OtherParser
   */
  constructor(node, dirValue, compilerScope) {
    super(node, dirValue, compilerScope);
  }
  /**
   *
   *
   * @param {*} newValue
   * @memberof OtherParser
   */
  update(newValue) {
    setAttr(this.el, this.dirValue, newValue);
  }
}
/**
 *
 *
 * @class Watcher
 */
class Watcher {
  /**
   *Creates an instance of Watcher.
   * @param {*} parser
   * @param {*} scope
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
   *
   *
   * @return {*}
   * @memberof Watcher
   */
  get() {
    curWatcher = this;
    const value = this._getter(this.dirValue)(this.scope || this.vm.$data);
    curWatcher = null;
    return value;
  }
  /**
   *
   *
   * @param {*} expression
   * @return {*}
   * @memberof Watcher
   */
  _getter(expression) {
    return new Function("scope", "return scope." + expression + ";");
  }
  /**
   *
   *
   * @memberof Watcher
   */
  beforeUpdate() {
    this.oldVal = structuralClone(this.value);
  }
  /**
   *
   *
   * @param {*} args
   * @memberof Watcher
   */
  update(args) {
    const newVal = (this.value = this.get());
    this.callback.call(this.parser, newVal, this.oldVal, args);
  }
}
/**
 *
 *
 * @class Observer
 */
class Observer {
  /**
   *Creates an instance of Observer.
   * @param {*} target
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
   *
   *
   * @param {*} obj
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
   *
   *
   * @param {*} arr
   * @memberof Observer
   */
  observeArray(arr) {
    this.extendArrayProto(arr);
    arr.map(item => {
      Observer.createObserver(item);
    });
  }
  /**
   *
   *
   * @param {*} arr
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
   *
   *
   * @static
   * @param {*} obj
   * @param {*} key
   * @param {*} value
   * @memberof Observer
   */
  static observe(obj, key, value) {
    const dependList = [];
    const curId = dependId++;
    const childOb = Observer.createObserver(value);
    Object.defineProperty(obj, key, {
      get: () => {
        if (curWatcher && curWatcher.depIds.indexOf(curId) < 0) {
          curWatcher.depIds.push(curId);
          dependList.push(curWatcher);
          if (childOb) {
            childOb.dependList.push(curWatcher);
          }
        }
        return value;
      },
      set: newValue => {
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
   *
   *
   * @static
   * @param {*} target
   * @return {*}
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
