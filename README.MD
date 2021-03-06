<h2 align="center">A Simple MVVM Library</h2>
<p align="center">
  <a href='https://github.com/zhaoky/mvvm'><img src='https://img.shields.io/github/last-commit/zhaoky/mvvm' alt='GitHub last commit' /></a>
  <a href='https://www.npmjs.com/package/@fe_korey/mvvm'><img src='https://img.shields.io/npm/l/@fe_korey/mvvm' alt='NPM' /></a>
  <a href='https://github.com/zhaoky/mvvm/blob/master/dist/mvvm.esm.prod.js'><img src='https://img.shields.io/github/size/zhaoky/mvvm/dist/mvvm.esm.prod.js' alt='GitHub file size in bytes' /></a>
  <a href='https://www.npmjs.com/package/@fe_korey/mvvm'><img src='https://img.shields.io/npm/v/@fe_korey/mvvm' alt='npm (scoped)' /></a>
  <a href="https://github.com/zhaoky/mvvm/actions"><img src="https://github.com/zhaoky/mvvm/workflows/Action CI/badge.svg" alt="Actions Status"></a>
  <a href="https://codecov.io/gh/zhaoky/mvvm"><img src="https://codecov.io/gh/zhaoky/mvvm/branch/master/graph/badge.svg" /></a>
<p>

---

## Introduction

`mvvm.js` is inspired by the implementation of [vue.js](https://github.com/vuejs/vue), on my own idea to implement the simple mvvm library, it is only for learning and communication. Please do not use it in production environment.

`mvvm.js` uses `proxy` for data hijacking, used `defineproperty` [click here](https://github.com/zhaoky/mvvm/tree/v1.0.0).

`mvvm.js` currently only implements data-binding and view-refresh, and more features are still being updated.

![mvvm.js](http://cdn.flqin.com/mvvm.jpeg)

## Install

mvvm.js uses node and npm/yarn. Go check them out if you don't have them locally installed.

```bash
yarn add @fe_korey/mvvm
```

## Usage

both support `UMD` (Universal Module Definition),`ESM` (ES6 module),`CJS` (common JS)，

### UMD

```html
<html>
  <script src="dist/mvvm.umd.js"></script>
  <body>
    <div id="app">
      <div>{{title}}</div>
    </div>
  </body>
  <script>
    new MVVM({
      view: document.getElementById("app"),
      model: {
        title: "hello mvvm!",
      },
      mounted() {
        console.log("主程编译完成,欢迎使用MVVM！");
      },
    });
  </script>
</html>
```

### ESM

```html
<body>
  <div id="app">{{title}}</div>
</body>
<script type="module">
  import MVVM from "../../dist/mvvm.esm.js";
  const data = {
    view: document.getElementById("app"),
    model: {
      title: "标题",
    },
  };
  new MVVM(data);
</script>
```

### CJS

```js
const MVVM = require("../../dist/mvvm.cjs");

const data = {
  view: document.getElementById("app"),
  model: {
    title: "标题",
  },
};
new MVVM(data);
```

Refer to [DEMO](https://github.com/zhaoky/mvvm/demo/) for more usage.

## Related Tech

- typescript
- rollup
- jest & codecov
- babel
- prettier
- eslint & stylelint
- action

## Npm Scripts

- `build`: create an all package
- `dev`: create a test server that can be hot updated
- `release`: publish mvvm to npm
- `lint`: code review
- `fix`: fix code errors and format
- `test`: unit testing by jest
- `codecov`: test coverage

## Documentation

### Instantiate MVVM

```javascript
/*
 * <必选>  view      接受一个 DOM 元素作为编译的目标元素
 * <必选>  model     接受一个对象作为数据模型
 * <可选>  methods   接受一个对象作为 v-on 事件函数的声明
 * <可选>  mounted   接受一个函数作为MVVM编译完成后的回调
 */
new MVVM({
  view: el,
  model: {
    title: "hello mvvm!",
  },
  methods: {
    getIndex: () => {},
  },
  mounted() {
    console.log("主程编译完成,欢迎使用MVVM！");
  },
});
```

### Directive System

List of supported directive

- [v-text](#v-text)
- [v-class](#v-class)
- [v-show](#v-show)
- [v-if](#v-if)
- [v-style](#v-style)
- [v-on](#v-on)
- [v-model](#v-model)
- [v-for](#v-for)
- [v-&#91;other&#93;](#v-other)

#### v-text

- text interpolation, support `{{}}`
- model type：`string`
- eg:

  ```html
  <h1 v-text="title"></h1>
  <h1>The title is {{ title }}</h1>
  ```

  ```javascript
  model: {
    title: "hello mvvm!";
  }
  ```

#### v-class

- switch class
- model type：`string`
- eg:

  ```html
  <h1 v-class="main"></h1>
  ```

  ```javascript
  model: {
    main: "a b";
  }
  ```

#### v-show

- switch display(dom is not deleted)
- model type：`boolean`
- eg:

  ```html
  <h1 v-show="show"></h1>
  ```

  ```javascript
  model: {
    show: true;
  }
  ```

#### v-if

- control dom loading and deleting
- model type：`boolean`
- eg:

  ```html
  <h1 v-if="show"></h1>
  ```

  ```javascript
  model: {
    show: true;
  }
  ```

#### v-style

- control dom style
- model type: `object`
- eg:

  ```html
  <h1 v-style="styleObj"></h1>
  ```

  ```javascript
  model: {
    styleObj: {
      color: "red";
    }
  }
  ```

#### v-for

- array list rendering
- directive syntax:

  ```html
  <p v-for="item in list"></p>
  <p v-for="item of list"></p>
  <p v-for="(item,index) in list"></p>
  <!-- item为数组项，index为数组项的索引 -->
  ```

- model type: `array`
- eg:

  ```html
  <div v-for="(item,index) in list">
    <div>{{item}}</div>
    <div>{{index}}</div>
  </div>
  ```

  ```javascript
  model: {
    list: [1, 2, 3];
  }
  ```

#### v-on:event

- event binding,`event` can be any event name, such as `click`
- model type: Event functions in the `methods` attribute,function `$event` parameter is `Event interface`
- eg:

  ```html
  <div v-on:click="getIndex"></div>
  <div v-on:click="getIndex($event,title)"></div>
  ```

  ```javascript
  model:{
    title: "hello mvvm!"
  },
  methods: {
    getIndex: (e,title) => {
      console.log(e,title);
    }
  }
  ```

#### v-model

- two-way binding on form controls
- scope: `input[type=text, password, radio, checkbox]`,`select` and `textarea`

##### input[type=text,password] & textarea

- model type: `string`
- eg:

  ```html
  <input type="text" v-model="title" />
  <textarea v-model="title" />
  <p>{{title}}</p>
  ```

  ```javascript
  model: {
    title: "title";
  }
  ```

##### input[type=radio]

- model type: `string` (value)
- eg:

  ```html
  <div><input type="radio" value="me" v-model="radio" />我 <input type="radio" value="you" v-model="radio" />你</div>
  ```

  ```javascript
  model: {
    radio: "";
  }
  ```

##### input[type=checkbox]

- model type: `boolean`(single) or `array`(multiple) (value)
- eg:

  ```html
  <div><input type="checkbox" value="apple" v-model="checkboxBool" />苹果</div>
  <div>
    <input type="checkbox" value="apple" v-model="checkboxArray" />苹果 <input type="checkbox" value="orange" v-model="checkboxArray" />橘子
    <input type="checkbox" value="banana" v-model="checkboxArray" />香蕉
  </div>
  ```

  ```javascript
  model:{
    checkboxBool: true,
    checkboxArray:['apple','orange']
  }
  ```

##### select

- model type: `string`(radio) or `array`(multiple) (value)
- eg:

  ```html
  <select v-model="selected">
    <option value="apple">苹果</option>
    <option value="orange">橘子</option>
    <option value="banana">香蕉</option>
  </select>
  <select v-model="selectedMult" multiple>
    <option value="apple">苹果</option>
    <option value="orange">橘子</option>
    <option value="banana">香蕉</option>
  </select>
  ```

  ```javascript
  model:{
    selected: "apple",
    selectedMult: ['apple']
  }
  ```

#### v-[other]

- render other attributes on the dom node
- model type: `string`
- eg:

  ```html
  <div v-link="link">hello!</div>
  ```

  ```javascript
  model: {
    link: "https://www.flqin.com";
  }
  ```

  Render result:

  ```html
  <div link="https://www.flqin.com">hello!</div>
  ```

## Maintainers

[@korey](https://github.com/zhaoky)

## License

[MIT](http://opensource.org/licenses/MIT)

Copyright (c) 2019-present, keyu (korey) Zhao
