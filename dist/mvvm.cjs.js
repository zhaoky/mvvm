/*!
  * MVVM v3.0.0-rc.3
  * https://github.com/zhaoky/mvvm
  * (c) 2019-present korey zhao
  * @license MIT
  */
'use strict';

/**
 * 是否为数组
 * @param {any} value
 * @return {Boolean}
 */
function isArray(value) {
    return Array.isArray(value);
}
/**
 * 是否是布尔值
 *
 * @export
 * @param {any} value
 * @return {boolean}
 */
function isBoolean(value) {
    return Reflect.apply(Object.prototype.toString, value, []) === "[object Boolean]";
}
/**
 * 是否为对象
 * @param {any} value
 * @return {Boolean}
 */
function isObject(value) {
    return Reflect.apply(Object.prototype.toString, value, []) === "[object Object]";
}
/**
 * 是否为Set类型
 * @param {any} value
 * @return {Boolean}
 */
function isSet(value) {
    return Reflect.apply(Object.prototype.toString, value, []) === "[object Set]";
}
/**
 * 是否为函数
 * @param {any} value
 * @return {Boolean}
 */
function isFunction(value) {
    return Reflect.apply(Object.prototype.toString, value, []) === "[object Function]";
}
/**
 * 是否是元素节点
 *
 * @param {HTMLElement | DocumentFragment} value
 * @return {boolean}
 */
function isElement(value) {
    return value.nodeType === 1;
}
/**
 * 是否是文本节点
 *
 * @param {HTMLElement | DocumentFragment} value
 * @return {Boolean}
 */
function isTextNode(value) {
    return value.nodeType === 3;
}
/**
 * 节点是否存在属性
 * @param   {K}   node
 * @param   {T}   name
 * @return  {Boolean}
 */
function hasAttr(node, name) {
    return node.hasAttribute(name);
}
/**
 * 获取节点属性值
 * @param   {T}   node
 * @param   {K}   name
 * @return  {String}
 */
function getAttr(node, name) {
    return node.getAttribute(name) || "";
}
/**
 * 设置节点属性
 * @param  {HTMLElement}  node
 * @param  {String}   name
 * @param  {any}   value
 */
function setAttr(node, name, value) {
    // 设为 null/undefined 和 false 移除该属性
    if (value == null || value === false) {
        removeAttr(node, name);
        return;
    }
    if (value === true) {
        node[name] = value;
        // 有些浏览器/情况下用 node[name] = true 是无法添加自定义属性的，此时设置一个空字符串
        if (!hasAttr(node, name)) {
            node.setAttribute(name, "");
        }
    }
    else if (value !== getAttr(node, name)) {
        node.setAttribute(name, value);
    }
}
/**
 * 删除节点属性值
 *
 * @param {HTMLElement} node
 * @param {String} name
 */
function removeAttr(node, name) {
    node.removeAttribute(name);
}
/**
 * 节点是否存在 classname
 * @param   {HTMLElement}  node
 * @param   {String}   classname
 * @return  {Boolean}
 */
function hasClass(node, classname) {
    let current;
    const list = node.classList;
    if (list) {
        return list.contains(classname);
    }
    else {
        current = ` ${getAttr(node, "class")} `;
        return current.indexOf(" " + classname + " ") > -1;
    }
}
/**
 * 节点添加 classname
 * @param  {HTMLElement}  node
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
    }
    else {
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
function removeClass(node, classname) {
    let current;
    let target;
    const list = node.classList;
    if (!classname || !hasClass(node, classname)) {
        return;
    }
    if (list) {
        list.remove(classname);
    }
    else {
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
function replaceNode(oldChild, newChild) {
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
function isDirective(directive) {
    return directive.indexOf("v-") === 0;
}
/**
 * 节点是否含有指令
 *
 * @param {ChildNode} node
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
        return false;
    }
    else if (isTextNode(node) && /\{\{.*\}\}/.test(node.textContent)) {
        return true;
    }
    else {
        return false;
    }
}
/**
 * 是否含有延迟编译的节点(该节点及其后代节点延迟编译)
 *
 * @param {HTMLElement} node
 * @return {Boolean}
 */
function hasLateCompileChilds(node) {
    return hasAttr(node, "v-if") || hasAttr(node, "v-for");
}
/**
 * 判断是否是 on 指令
 *
 * @export
 * @param {string} dirName
 * @return {*}  {boolean}
 */
function dirNameHasOn(dirName) {
    return /^on:.+$/.test(dirName);
}
/**
 * 转换成字符串，null转换为空字符串
 * @param {String} value
 * @return {String}
 */
function _toString(value) {
    return value == null ? "" : value.toString();
}
/**
 * 简易深拷贝
 *
 * @param {any} source
 * @return {Object}
 */
function cloneDeep(source) {
    if (!(isObject(source) || isArray(source) || isSet(source)))
        return source;
    const target = isArray(source) ? [] : isObject(source) ? {} : new Set();
    if (isSet(source)) {
        source.forEach((val) => {
            target.add(cloneDeep(val));
        });
    }
    else {
        for (const key in source) {
            if (Object.prototype.hasOwnProperty.call(source, key)) {
                if (isObject(source[key]) || isArray(source[key])) {
                    target[key] = cloneDeep(source[key]);
                }
                else {
                    target[key] = source[key];
                }
            }
        }
    }
    return target;
}
/**
 * 生成文档片段
 *
 * @param {HTMLElement} element
 * @return {DocumentFragment}
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
 * @param  {HTMLElement}  element
 * @param  {any}   styleObject
 */
function updateStyle(element, styleObject) {
    const style = element.style;
    if (!isObject(styleObject)) {
        return;
    }
    const styleList = Object.keys(styleObject);
    styleList.forEach(function (item) {
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

/**
 * 基类
 *
 * @class BaseParser
 */
class BaseParser {
    /**
     * Creates an instance of BaseParser.
     * @param {ParserOption} option
     * @param {HTMLElement} option.node [包含指令的 dom 节点]
     * @param {String} option.dirName [指令名称]
     * @param {String} option.dirValue [指令值]
     * @param {CompilerClass} option.cs [CompilerClass]
     * @memberof BaseParser
     */
    constructor({ node, dirName, dirValue, cs }) {
        /**
         * watcher 类
         *
         * @private
         * @type {(WatcherClass | null)}
         * @memberof ModelParser
         */
        this.watcher = null;
        node && (this.el = node);
        dirName && (this.dirName = dirName);
        dirValue && (this.dirValue = dirValue);
        cs && (this.cs = cs);
    }
}

/**
 * 派生类 TextParser
 *
 * @class TextParser
 * @extends {BaseParser}
 * @implements {ParserBaseClass}
 */
class TextParser extends BaseParser {
    /**
     * text刷新视图函数
     *
     * @param {any} newVal [新值]
     * @memberof TextParser
     */
    update({ newVal }) {
        this.el.textContent = _toString(newVal);
    }
}

/**
 * 派生类 StyleParser
 *
 * @class StyleParser
 * @extends {BaseParser}
 */
class StyleParser extends BaseParser {
    constructor() {
        super(...arguments);
        /**
         * 是否为深度依赖
         *
         * @type {boolean}
         * @memberof StyleParser
         */
        this.deep = true;
    }
    /**
     * style刷新视图函数
     *
     * @param {Record<string, any>} newVal [新的style对象]
     * @param {Record<string, any>} oldVal [旧的style对象]
     * @memberof StyleParser
     */
    update({ newVal, oldVal }) {
        if (oldVal) {
            const keys = Object.keys(oldVal);
            keys.map((item) => {
                oldVal[item] = "";
            });
            updateStyle(this.el, oldVal);
        }
        updateStyle(this.el, newVal);
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
     * class刷新视图函数
     *
     * @param {any} newVal [新的class类]
     * @param {any} oldVal [旧的class类]
     * @memberof ClassParser
     */
    update({ newVal, oldVal }) {
        if (oldVal) {
            const oldClassList = oldVal.split(" ");
            oldClassList.map((item) => {
                removeClass(this.el, item);
            });
        }
        const classList = newVal.split(" ");
        classList.map((item) => {
            addClass(this.el, item);
        });
    }
}

/**
 * 发布订阅中心
 *
 * @class Dep
 */
class Dep {
    constructor() {
        /**
         * 订阅中心(该对象收集到的需要通知 path 及对应 watcher（节点）列表)
         *
         * @type {Record<string, Set<WatcherClass>>}
         * @memberof Dep
         */
        this.depCenter = {};
    }
    /**
     * 为 watcher 收集订阅者
     *
     * @param {String} path
     * @param {WatcherClass} dep
     * @memberof Dep
     */
    collectDep(path) {
        if (!this.depCenter[path]) {
            this.depCenter[path] = new Set();
        }
        Dep.curWatcher.addDeps(path, this);
    }
    /**
     * 添加订阅者
     *
     * @param {String} path
     * @param {WatcherClass} dep
     * @memberof Dep
     */
    addDep(path, dep) {
        if (!this.depCenter[path]) {
            this.depCenter[path] = new Set();
        }
        this.depCenter[path].add(dep);
    }
    /**
     * 移除订阅者
     *
     * @param {String} path
     * @param {WatcherClass} dep
     * @memberof Dep
     */
    removeDep(path, dep) {
        this.depCenter[path].delete(dep);
    }
    /**
     * 通知订阅者（之前）
     *
     * @param {String} key
     * @return {void}
     * @memberof Dep
     */
    beforeNotfiy(key) {
        if (!this.depCenter[key]) {
            return;
        }
        this.depCenter[key].forEach((item) => {
            item.beforeUpdate();
        });
    }
    /**
     * 通知订阅者
     *
     * @param {string} key
     * @param {ArrArgs} arrArgs
     * @return {void}
     * @memberof Dep
     */
    notfiy(key, arrArgs) {
        if (!this.depCenter[key]) {
            return;
        }
        this.depCenter[key].forEach((item) => {
            item.update(arrArgs);
        });
    }
    /**
     * 复制订阅列表到数组的新子元素里
     *
     * @param {string} arrayPath [数组path]
     * @param {string} path [新子元素path]
     * @memberof Dep
     */
    copyDep(arrayPath, path) {
        const arrayDep = this.depCenter[`${arrayPath}____proxy`];
        if (arrayDep) {
            arrayDep.forEach((item) => {
                this.addDep(path, item);
            });
        }
    }
}
/**
 * 当前watcher
 *
 * @static
 * @type {WatcherClass}
 * @memberof Dep
 */
Dep.curWatcher = null;

/**
 * 监测数据模型
 *
 * @class Observer
 */
class Observer {
    /**
     *Creates an instance of Observer.
     * @param {any} data [需要监听的数据]
     * @param {string} path [订阅key(路径标识)]
     * @memberof Observer
     */
    constructor(data, path) {
        /**
         * 数据值
         *
         * @private
         * @type {any}
         * @memberof Observer
         */
        this.data = null;
        if (data.__proxy === 1) {
            this.data = data;
            return;
        }
        if (isObject(data) || isArray(data)) {
            this.data = this._observe(data, path);
            return;
        }
        this.data = data;
    }
    /**
     * 架设proxy拦截
     *
     * @private
     * @param {Record<string, any>} data [需要监听的数据]
     * @param {string} path [订阅key(路径标识)]
     * @return {Proxy}
     * @memberof Observer
     */
    _observe(data, path) {
        const dep = new Dep(); // 每一个对象就一个订阅中心
        const keys = Object.keys(data);
        keys.forEach((key) => {
            const value = data[key];
            data[key] = new Observer(value, `${path}__${key}`).getData();
        });
        const handler = {
            get(target, property) {
                if (!target.hasOwnProperty(property) && typeof property === "symbol") {
                    return Reflect.get(target, property);
                }
                // 订阅中心开始收集watcher依赖
                if (Dep.curWatcher) {
                    dep.collectDep(`${path}____proxy`);
                    dep.collectDep(`${path}__${String(property)}`);
                }
                return Reflect.get(target, property);
            },
            set(target, property, value, receiver) {
                if (target[property] === value) {
                    return true;
                }
                let arrArgs = {
                    receiver: null,
                    property: "",
                    value: null,
                };
                // 目标是数组的handler
                if (isArray(target)) {
                    arrArgs = { receiver, property, value };
                }
                // 如果元素是新加入的，就把所有订阅分发给新元素
                if (target[property] === undefined) {
                    dep.copyDep(`${path}`, `${path}__${property}`);
                }
                dep.beforeNotfiy(`${path}__${property}`);
                target[property] = new Observer(value, `${path}__${property}`).getData();
                Reflect.set(target, property, target[property]);
                dep.notfiy(`${path}__${property}`, arrArgs);
                return true;
            },
        };
        const proxy = new Proxy(data, handler);
        // 添加 proxy 对象标志属性 __proxy
        Reflect.defineProperty(data, "__proxy", {
            value: 1,
            writable: false,
            enumerable: false,
            configurable: false,
        });
        return proxy;
    }
    /**
     * 获取值
     *
     * @return {any}
     * @memberof Observer
     */
    getData() {
        return this.data;
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
     *Creates an instance of ForParser.
     * @param {ParserOption} options
     * @param {HTMLElement} option.node [包含指令的 dom 节点]
     * @param {String} option.dirName [指令名称]
     * @param {String} option.dirValue [指令值]
     * @memberof ForParser
     */
    constructor({ node, dirName, dirValue, cs }) {
        super({ node, dirName, dirValue, cs });
        /**
         * item别名
         *
         * @private
         * @memberof ForParser
         */
        this.alias = "";
        /**
         * 独特的__vfor__
         *
         * @private
         * @memberof ForParser
         */
        this.symbol = Symbol();
        /**
         * 含有alias,$index对象的数组
         *
         * @private
         * @type {Record<string, any>[]}
         * @memberof ForParser
         */
        this.scopes = [];
        /**
         * 父节点
         *
         * @private
         * @type {Node}
         * @memberof ForParser
         */
        this.parent = null;
        /**
         * 终止节点
         *
         * @private
         * @type {Node}
         * @memberof ForParser
         */
        this.end = null;
        /**
         * 是否是首次渲染
         *
         * @private
         * @memberof ForParser
         */
        this.isInit = true;
        /**
         * 位置索引
         *
         * @private
         * @memberof ForParser
         */
        this.$index = "";
        /**
         * 是否为深度依赖
         *
         * @memberof ForParser
         */
        this.deep = true;
        this.parseValue(dirValue);
        this.parent = node.parentNode;
        if (this.parent.nodeType !== 1) {
            throw Error("v-for can't used in the root element!");
        }
        this.end = node.nextSibling;
    }
    /**
     * for更新函数
     *
     * @param {ParseUpdateOption} option
     * @param {any} option.newVal newVal [新值]
     * @param {ArrArgs} option.arrArgs [数组参数]
     * @return {void}
     * @memberof ForParser
     */
    update({ newVal, arrArgs }) {
        // 如果没有值
        if (!newVal) {
            return;
        }
        // 如果有值但不是数组
        if (newVal && !isArray(newVal)) {
            throw Error("v-for item type must be array!");
        }
        // 如果是首次渲染
        if (this.isInit) {
            const parentNode = this.el.parentNode;
            parentNode.replaceChild(this.buildList(newVal), this.el);
            this.isInit = false;
            return;
        }
        // 如果雨女无瓜
        if (arrArgs.receiver && newVal !== arrArgs.receiver) {
            return;
        }
        // 如果是整体构建
        if (!arrArgs.property) {
            this.recompileList(newVal);
            return;
        }
        // 如果是某一项改变
        if (arrArgs.property !== "length") {
            const index = +arrArgs.property;
            const frag = this.buildItem(index, newVal);
            const children = this.getChlids();
            if (children.length < index + 1) {
                this.parent.insertBefore(frag, this.end);
            }
            else {
                this.parent.replaceChild(frag, children[index]);
            }
        }
        else {
            // 如果是长度改变
            this.recompileLength(arrArgs.value);
        }
    }
    /**
     * 解析value
     *
     * @private
     * @param {string} value
     * @memberof ForParser
     */
    parseValue(value) {
        if (/\(.*\)/.test(value)) {
            const match = value.match(/.*\((.*),(.*)\).*(?: in | of )(.*)/);
            this.alias = match[1].trim();
            this.$index = match[2].trim();
            this.dirValue = match[3].trim();
        }
        else {
            const match = value.match(/(.*)(?: in | of )(.*)/);
            this.alias = match[1].trim();
            this.dirValue = match[2].trim();
        }
    }
    /**
     * 得到强相关的节点列表
     *
     * @private
     * @return {any[]}
     * @memberof ForParser
     */
    getChlids() {
        const list = [];
        const childNodes = this.parent.childNodes;
        for (let i = 0; i < childNodes.length; i++) {
            const item = childNodes[i];
            if (item["__vfor__"] === this.symbol) {
                list.push(childNodes[i]);
            }
        }
        return list;
    }
    /**
     * 构建数组
     *
     * @private
     * @param {any[]} newArray
     * @return {DocumentFragment}
     * @memberof ForParser
     */
    buildList(newArray) {
        const listFragment = document.createDocumentFragment();
        const keys = Object.keys(newArray);
        for (let i = 0; i < keys.length; i++) {
            const frag = this.buildItem(i, newArray);
            listFragment.appendChild(frag);
        }
        return listFragment;
    }
    /**
     * 重建数组
     *
     * @private
     * @param {any[]} newArray
     * @memberof ForParser
     */
    recompileList(newArray) {
        const children = this.getChlids();
        for (let i = 0; i < children.length; i++) {
            this.parent.removeChild(children[i]);
        }
        this.scopes.length = 0;
        const listFragment = this.buildList(newArray);
        this.parent.insertBefore(listFragment, this.end);
    }
    /**
     * 重建数组长度
     *
     * @private
     * @param {number} length
     * @memberof ForParser
     */
    recompileLength(length) {
        const children = this.getChlids();
        for (let i = length; i < children.length; i++) {
            this.parent.removeChild(children[i]);
        }
        this.scopes.length = length;
        this.scopes.map((item, index) => {
            item[this.$index] = index;
        });
    }
    /**
     * 构建数组项
     *
     * @private
     * @param {number} i [数组索引]
     * @param {any[]} newArray [数组值]
     * @return {Node}
     * @memberof ForParser
     */
    buildItem(i, newArray) {
        const frag = this.el.cloneNode(true);
        const index = i;
        const alias = this.alias;
        let scope = {};
        scope[alias] = newArray[i];
        scope[this.$index] = index;
        scope = new Observer(scope, `__scope`).getData();
        Reflect.setPrototypeOf(scope, this.cs.ms.$data);
        this.scopes.push(scope);
        if (this.isInit) {
            const $queue = this.cs.$queue;
            $queue.splice(index, 1);
        }
        const symbol = this.symbol;
        Reflect.defineProperty(frag, "__vfor__", {
            value: symbol,
            writable: false,
            enumerable: false,
            configurable: false,
        });
        this.cs.collectDir({ element: frag, isRoot: true, scope });
        return frag;
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
     * 生成事件处理函数
     *
     * @private
     * @param {string} expression [表达式]
     * @return {OnHandler}
     * @memberof OnParser
     */
    getHandler(expression) {
        expression = expression.trim();
        if (/^(\S+?)\(.*\)$/g.test(expression)) {
            expression = expression.replace(/^(\S+?)(\()/, "scope.__eventHandler.$1.call(this,");
        }
        else {
            expression = `scope.__eventHandler.${expression}.call(this)`;
        }
        expression = expression.replace(/([(,])(\S+?)(?=[,)])/g, (_match, $1, $2) => {
            return /^(?:(['"`])\S+\1)|(\d+?)|(\$event)|(this)$/.test($2) ? `${$1}${$2}` : `${$1}scope['${$2}']`;
        });
        try {
            return new Function("scope,$event", `${expression}`);
        }
        catch {
            throw Error(`Check the expression for errors`);
        }
    }
    /**
     * 绑定事件
     *
     * @private
     * @memberof OnParser
     */
    addEvent() {
        const el = this.el;
        const handlerType = this.handlerType;
        const handlerFn = this.handlerFn;
        const scope = this.scope || this.cs.ms.$data;
        el.addEventListener(handlerType, (e) => {
            handlerFn.call(this.cs.ms, scope, e);
        });
    }
    /**
     * 解析事件绑定函数
     *
     * @param {Record<string, any> | null} scope
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
class ModelParser extends BaseParser {
    /**
     *Creates an instance of ModelParser.
     * @param {ParserOption} options
     * @param {HTMLElement} option.node [包含指令的 dom 节点]
     * @param {String} option.dirName [指令名称]
     * @param {String} option.dirValue [指令值]
     * @memberof ModelParser
     */
    constructor({ node, dirName, dirValue, cs }) {
        super({ node, dirName, dirValue, cs });
        /**
         * model中不同类型的解析器实例
         *
         * @private
         * @type {ModelClass} [modal 实例]
         * @memberof ModelParser
         */
        this.type = null;
        /**
         * 是否是多选
         *
         * @private
         * @type {boolean}
         * @memberof ModelSelect
         */
        this.multi = false;
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
    update({ newVal }) {
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
    selectType() {
        const tagName = this.el.tagName.toLowerCase();
        const type = tagName === "input" ? getAttr(this.el, "type") : tagName;
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
    addEvent() {
        if (this.type === "select") {
            this.multi = hasAttr(this.el, "multiple");
        }
        this.el.addEventListener(this.type === "text" ? "input" : "change", (e) => {
            if (this.type === "select") {
                const value = this.multi ? this.getSelectValue(e.target.options) : e.target.value;
                this.watcher.set(value);
            }
            else if (this.type === "checkbox") {
                const data = this.watcher.get();
                const { checked, value } = e.target;
                if (isBoolean(data)) {
                    this.watcher.set(checked);
                }
                else {
                    checked ? data.push(value) : data.splice(data.indexOf(value), 1);
                }
            }
            else {
                this.watcher.set(e.target.value);
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
    getSelectValue(options) {
        const list = [];
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
    textUpdate({ newVal }) {
        this.el.value = _toString(newVal);
    }
    /**
     * 复选框 更新方法
     *
     * @private
     * @param {*} newVal
     * @memberof ModelParser
     */
    checkboxUpdate({ newVal }) {
        if (!isArray(newVal) && !isBoolean(newVal)) {
            throw Error("Checkbox v-model value must be type of Boolean or Array");
        }
        const value = this.el.value;
        this.el.checked = isBoolean(newVal) ? newVal : newVal.includes(value);
    }
    /**
     * 单选框 更新方法
     *
     * @private
     * @param {*} newVal
     * @memberof ModelParser
     */
    radioUpdate({ newVal }) {
        this.el.checked = _toString(newVal) === this.el.value;
    }
    /**
     * select 更新方法
     *
     * @private
     * @param {*} newVal
     * @memberof ModelParser
     */
    selectUpdate({ newVal }) {
        const el = this.el;
        el.selectedIndex = -1;
        const optionList = el.options;
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
            option.selected = this.multi ? newVal.includes(option.value) : option.value === _toString(newVal);
        }
    }
}

/**
 * 派生类 DisplayParser
 *
 * @class DisplayParser
 * @extends {BaseParser}
 */
class DisplayParser extends BaseParser {
    /**
     *Creates an instance of DisplayParser.
     * @param {ParserOption} options
     * @param {HTMLElement} option.node [包含指令的 dom 节点]
     * @param {String} option.dirName [指令名称]
     * @param {String} option.dirValue [指令值]
     * @memberof DisplayParser
     */
    constructor({ node, dirName, dirValue, cs }) {
        super({ node, dirName, dirValue, cs });
        this.el.style.display = this.el.originalDisplay = this.el.style.display === "none" ? "" : this.el.style.display;
    }
    /**
     * display更新函数
     *
     * @param {any} newVal
     * @memberof DisplayParser
     */
    update({ newVal }) {
        if (this.dirName === "show") {
            if (newVal) {
                this.el.style.display = this.el.originalDisplay ? "block" : this.el.originalDisplay;
            }
            else {
                this.el.style.display = "none";
            }
        }
        else {
            if (newVal) {
                this.el.style.display = "none";
            }
            else {
                this.el.style.display = this.el.originalDisplay ? "block" : this.el.originalDisplay;
            }
        }
    }
}

/**
 * 派生类 IfParser
 *
 * @class IfParser
 * @extends {IfParser}
 * @implements {ParserBaseClass}
 */
class IfParser extends BaseParser {
    /**
     *Creates an instance of IfParser.
     * @param {ParserOption} options
     * @param {HTMLElement} option.node [包含指令的 dom 节点]
     * @param {String} option.dirName [指令名称]
     * @param {String} option.dirValue [指令值]
     * @memberof IfParser
     */
    constructor({ node, dirName, dirValue, cs }) {
        super({ node, dirName, dirValue, cs });
        /**
         * 指令父节点
         *
         * @private
         * @type {HTMLElement | null}
         * @memberof IfParser
         */
        this.$parent = null;
        /**
         * 克隆的节点
         *
         * @private
         * @type {HTMLElement | null}
         * @memberof IfParser
         */
        this.elTpl = null;
        this.$parent = this.el.parentNode;
        if (this.$parent.nodeType !== 1) {
            throw Error("v-if can't used in the root element!");
        }
        this.elTpl = this.el.cloneNode(true);
        this.emptyNode = document.createTextNode("");
        replaceNode(this.el, this.emptyNode);
    }
    /**
     * if更新函数
     *
     * @param {any} newVal [新值]
     * @param {Record<string, any> | null} scope [v-for 作用域]
     * @memberof IfParser
     */
    update({ newVal, scope }) {
        const tpl = this.elTpl.cloneNode(true);
        if (newVal) {
            this.cs.collectDir({ element: tpl, isRoot: true, scope });
            this.$parent.insertBefore(tpl, this.emptyNode);
            Reflect.defineProperty(tpl, "__vif__", {
                value: true,
                writable: true,
                enumerable: false,
                configurable: true,
            });
        }
        else {
            const el = this.emptyNode.previousSibling;
            if (el && el.__vif__) {
                this.$parent.removeChild(el);
            }
        }
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
     *  other更新函数
     *
     * @param {any} newVal [新值]
     * @memberof OtherParser
     */
    update({ newVal }) {
        setAttr(this.el, this.dirName, newVal);
    }
}

let id = 0;
/**
 * watcher 类
 * - 每一个 parser 对应一个 watcher
 * - 一个 dom 节点上可能不止一个 parser
 * - 意味着一个 dom 可能有多个订阅 watcher
 * - 一旦触发 watcher 更新，则会通知该 dom 进行更新操作
 *
 * @class Watcher
 */
class Watcher {
    /**
     *Creates an instance of Watcher.
     * @param {ParserBaseClass} parser [解析器]
     * @param {Record<string, any>} scope [item作用域]
     * @memberof Watcher
     */
    constructor(parser, scope) {
        /**
         * 数组item的作用域
         *
         * @private
         * @type {Record<string, any> | null}
         * @memberof Watcher
         */
        this.scope = null;
        /**
         * 旧值
         *
         * @private
         * @type {*}
         * @memberof Watcher
         */
        this.oldVal = null;
        /**
         * 通过getter获取到的最新值
         *
         * @type {any}
         * @memberof Watcher
         */
        this.value = null;
        /**
         * 老的依赖 deps 列表
         *
         * @private
         * @type {array}
         * @memberof path[]
         */
        this.deps = {
            depCenterList: new Set(),
            depMap: {},
        };
        /**
         * 新的依赖 deps 列表
         *
         * @private
         * @type {array}
         * @memberof path[]
         */
        this.newDeps = {
            depCenterList: new Set(),
            depMap: {},
        };
        this.id = 0;
        this.parser = parser;
        this.scope = scope;
        this.value = this.get();
        this.id = ++id;
    }
    /**
     * getter 函数
     *
     * @private
     * @param {string} expression
     * @return {Function}
     * @memberof Watcher
     */
    _getter(expression) {
        try {
            return new Function("scope", `with(scope){return ${expression}};`);
        }
        catch {
            throw Error(`The attribute value:'${expression}' error parsing.`);
        }
    }
    /**
     * 深度递归订阅遍历
     *
     * @private
     * @param {any} target
     * @return {void}
     * @memberof Watcher
     */
    _walkThrough(target) {
        if (target.__proxy !== 1) {
            return;
        }
        const keys = Object.getOwnPropertyNames(target);
        for (let i = 0; i < keys.length; i++) {
            this._walkThrough(target[keys[i]]);
        }
    }
    /**
     * 通过访问层级取值
     *
     * @param {*} target
     * @param {*} paths
     * @return {*}
     */
    _getDeepValue(target, paths) {
        while (paths.length) {
            target = target[paths.shift()];
        }
        return target;
    }
    /**
     * 更新前执行的函数（深拷贝得到原始值）
     *
     * @memberof Watcher
     */
    beforeUpdate() {
        this.oldVal = cloneDeep(this.value);
    }
    /**
     * 更新方法
     *
     * @param {ArrArgs} [arrArgs]
     * @memberof Watcher
     */
    update(arrArgs) {
        // 添加订阅列表
        const newVal = (this.value = this.get());
        this.parser.update.call(this.parser, { newVal, oldVal: this.oldVal, scope: this.scope, arrArgs });
    }
    /**
     * 1.获取最新值
     * 2.把watcher与值绑定,通知到每一个相关属性，加入到对应的订阅列表
     * @return {any}
     * @memberof Watcher
     */
    get() {
        Dep.curWatcher = this;
        const value = this._getter(this.parser.dirValue)(this.scope || this.parser.cs.ms.$data);
        // 深度订阅，将目标属性值的订阅列表递归分发给所有子元素
        if (value && this.parser.deep) {
            this._walkThrough(value);
        }
        Dep.curWatcher = null;
        // 清除无用依赖
        this.removeDeps();
        this.deps = cloneDeep(this.newDeps);
        this.newDeps = {
            depCenterList: new Set(),
            depMap: {},
        };
        return value;
    }
    /**
     * 设置双向绑定值
     *
     * @param {any} value
     * @memberof Watcher
     */
    set(value) {
        let pathList = this.parser.dirValue.split(/[\.\]\[]/g);
        pathList = pathList.filter((item) => {
            return item !== "";
        });
        const key = pathList.pop();
        const data = this._getDeepValue(this.parser.cs.ms.$data, pathList);
        data[key] = value;
    }
    /**
     * 添加依赖
     * @param {string} path [model路径]
     * @param {any} dep [依赖]
     */
    addDeps(path, dep) {
        this.newDeps.depCenterList.add(dep);
        if (!this.newDeps.depMap[path]) {
            this.newDeps.depMap[path] = new Set();
        }
        this.newDeps.depMap[path].add(dep.depCenter);
        dep.addDep(path, this);
        // if (!this.deps.depMap[path]) {
        //   dep.addDep(path, this);
        // }
    }
    /**
     * 移除依赖
     *
     * @memberof Watcher
     */
    removeDeps() {
        const paths = Object.keys(this.deps.depMap);
        const newPaths = Object.keys(this.newDeps.depMap);
        const depCenterList = this.deps.depCenterList;
        const removePath = paths.filter((i) => !newPaths.includes(i));
        removePath.forEach((path) => {
            depCenterList.forEach((center) => {
                const keys = Object.keys(center.depCenter);
                const values = Object.values(center.depCenter);
                if (keys.includes(path)) {
                    center.removeDep(path, this);
                    if (values.every((i) => i.size === 0)) {
                        depCenterList.delete(center);
                    }
                }
            });
        });
    }
}

/**
 * 编译器
 *
 * @class Compiler
 */
class Compiler {
    /**
     *Creates an instance of Compiler.
     * @param {MVVMOption} option
     * @param {MVVMClass} ms
     * @memberof Compiler
     */
    constructor(option, ms) {
        /**
         * 编译根节点
         *
         * @private
         * @type {HTMLElement}
         * @memberof Compiler
         */
        this.$rootElement = null;
        /**
         * document缓存片段节点
         *
         * @private
         * @type {DocumentFragment}
         * @memberof Compiler
         */
        this.$fragment = null;
        /**
         * mvvm作用域
         *
         * @private
         * @type {Record<string, any>}
         * @memberof Compiler
         */
        this.ms = null;
        /**
         * 指令缓存队列
         *
         * @type {queueItem[]}
         * @memberof Compiler
         */
        this.$queue = [];
        this.$rootElement = option.view;
        this.$mounted = option.mounted;
        this.ms = ms;
        if (isObject(option.methods)) {
            const __eventHandler = (option.model["__eventHandler"] = {});
            const methods = option.methods;
            const keys = Object.keys(methods);
            keys.forEach((key) => {
                ms[key] = __eventHandler[key] = methods[key];
            });
        }
        this.$fragment = nodeToFragment(this.$rootElement);
        this.collectDir({ element: this.$fragment, isRoot: true, isInit: true });
    }
    /**
     * 解析元素节点收集到的每个指令
     *
     * @private
     * @param {CompilerParseOption} options
     * @param {HTMLElement} options.node [dom 节点]
     * @param {Attr} options.attr [dom 属性]
     * @param {Record<string, any> | null} options.scope [数组 item 作用域]
     * @return {void}
     * @memberof Compiler
     */
    parseAttr({ node, attr, scope }) {
        const name = attr.name;
        const dirName = name.substr(2);
        const dirValue = attr.value.trim();
        removeAttr(node, name);
        this.parseHandler({ node, dirName, dirValue, scope });
    }
    /**
     * 解析指令为文本节点
     *
     * @private
     * @param {CompilerParseOption} options
     * @param {HTMLElement} options.node [dom 节点]
     * @param {Record<string, any> | null} options.scope [数组 item 作用域]
     * @memberof Compiler
     */
    parseText({ node, scope }) {
        const reg = /(\{\{.*?(?=\}\})\}\})/g;
        const text = node.textContent;
        let dirValue = "";
        !(function parse(preIndex) {
            const result = reg.exec(text);
            if (result === null) {
                dirValue = `${dirValue}'${text.substr(preIndex)}'`;
                return;
            }
            const index = result.index;
            const slot = result[1].substr(2, result[1].length - 4);
            const str = text.substring(preIndex, index);
            const lastIndex = index + result[1].length;
            dirValue = `${dirValue}'${str}'+( ${slot} )+`;
            parse(lastIndex);
        })(0);
        dirValue = dirValue.replace(/\n/g, "");
        this.parseHandler({ node, dirName: "text", dirValue, scope });
    }
    /**
     * - 编译收集到的每一个节点
     * - 提取指令交给不同的编译器编译
     *
     * @private
     * @param {queueItem} queueItem 指令
     * @memberof Compiler
     */
    compileNode(queueItem) {
        const [node, scope] = queueItem;
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
            attrs.map((attr) => {
                this.parseAttr({ node, attr, scope });
            });
        }
        else {
            this.parseText({ node, scope });
        }
    }
    /**
     * 处理解析后的指令
     *
     * @private
     * @param {CompilerParseOption} options
     * @param {HTMLElement} options.node [dom 节点]
     * @param {string} options.dirName [指令名称]
     * @param {string} options.dirValue [dom 属性]
     * @param {Record<string, any> | null} options.scope [数组 item 作用域]
     * @memberof Compiler
     */
    parseHandler({ node, dirName, dirValue, scope }) {
        // 根据不同指令选择不同的解析器
        const parser = this.selectParsers({ node, dirName, dirValue });
        if (dirNameHasOn(dirName)) {
            parser.parseEvent(scope);
            return;
        }
        // 建立解析器与数据模型的关系
        const watcher = new Watcher(parser, scope);
        parser.watcher = watcher;
        // 初始化视图更新
        parser.update({ newVal: watcher.value, scope });
    }
    /**
     * 根据不同指令选择不同的解析器
     *
     * @private
     * @param {CompilerParseOption} options
     * @param {HTMLElement} options.node [dom 节点]
     * @param {string} options.dirName [指令名称]
     * @param {string} options.dirValue [dom 属性]
     * @return {ParserBaseClass}  [对应 parser 实例]
     * @memberof Compiler
     */
    selectParsers({ node, dirName, dirValue }) {
        let name = dirName;
        if (/^on:.+$/.test(name)) {
            name = "on";
        }
        if (~["show", "hide"].indexOf(name)) {
            name = "display";
        }
        if (!["text", "style", "class", "for", "on", "display", "if", "model"].includes(name)) {
            name = "other";
        }
        const parserMap = {
            text: TextParser,
            style: StyleParser,
            class: ClassParser,
            for: ForParser,
            on: OnParser,
            model: ModelParser,
            display: DisplayParser,
            if: IfParser,
            other: OtherParser,
        };
        return new parserMap[name]({ node, dirName, dirValue, cs: this });
    }
    /**
     * 收集、编译，解析完成后
     *
     * @private
     * @param {Boolean} isInit [首次加载]
     * @memberof Compiler
     */
    completed(isInit) {
        if (!isInit) {
            return;
        }
        this.$rootElement.appendChild(this.$fragment);
        this.$fragment = null;
        if (isFunction(this.$mounted)) {
            this.$mounted.call(this.ms);
        }
    }
    /**
     * - 收集节点所有需要编译的指令
     * - 并在收集完成后编译指令列表
     * @param {CollectDirOption} options
     * @param {HTMLElement} options.element [要收集指令的dom节点]
     * @param {Boolean} options.isRoot [是否是根节点]
     * @param {Object|null} options.scope [v-for作用域]
     * @param {Boolean} options.isInit [首次加载]
     * @memberof Compiler
     */
    collectDir({ element, isRoot, scope = null, isInit }) {
        if (isRoot && hasDirective(element)) {
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
                this.collectDir({ element: node, isRoot: false, scope });
            }
        }
        if (isRoot) {
            for (let i = 0; i < this.$queue.length; i++) {
                this.compileNode(this.$queue[i]);
                this.$queue.splice(i, 1);
                i--;
            }
            this.completed(isInit);
        }
    }
}

/**
 * MVVM入口
 *
 * @export
 * @class MVVM
 */
class MVVM {
    /**
     *Creates an instance of MVVM.
     * @param {MvvmOptionInterface} option
     * @memberof MVVM
     */
    constructor(option) {
        /**
         * 数据模型对象
         *
         * @type {any}
         * @memberof MVVM
         */
        this.$data = {};
        if (!isObject(option)) {
            throw Error("data must be object.");
        }
        if (!option.view || (!!option.view && !isElement(option.view))) {
            throw Error("data.view must be HTMLDivElement.");
        }
        if (!option.model || (!!option.model && !isObject(option.model))) {
            throw Error("data.model must be object.");
        }
        //* ** 这里进入数据监听模块 ***/
        this.$data = option.model = new Observer(option.model, `__data`).getData();
        this._proxy();
        new Compiler(option, this);
    }
    /**
     * _proxy 函数
     *
     * @private
     * @return {void}
     * @memberof Compiler
     */
    _proxy() {
        const keys = Object.keys(this.$data);
        let i = keys.length;
        while (i--) {
            const key = keys[i];
            Object.defineProperty(this, key, {
                enumerable: true,
                configurable: true,
                get: () => {
                    return this.$data[key];
                },
                set: (val) => {
                    this.$data[key] = val;
                },
            });
        }
    }
}

// Public API ------------------------------------------------------------------
// Types -----------------------------------------------------------------------
// export { MVVMClass, MVVMOption } from "./mvvm";
// export { DepClass } from "./dep";
// export { CompilerClass, CompilerParseOption, ParserMaps } from "./compiler";

module.exports = MVVM;
