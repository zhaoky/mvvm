/* eslint-disable */
import MVVM from "../src/core/mvvm";

describe("Test MVVM", () => {
  test("generate an MVVM instance correctly and completely", done => {
    expect(() => {
      document.body.innerHTML = `
      <div id='app'>
        <div v-text='title'></div>
        <div>{{title}}</div>
        <div v-show='isShow'></div>
        <div v-hide='isShow'></div>
        <div>
          <div v-if='isShow'></div>
          <div v-if='!isShow'>123</div>
        </div>
        <div v-class='main'></div>
        <div v-style='styleObj'></div>
        <div v-on:click='getIndex($event)' id='on'></div>
        <div v-on:click='getIndex'></div>
        <div v-on:click='getIndex(title)'></div>
        <div>
          <div v-for='item in list' v-link='title'>
            <div v-text='item'></div>
          </div>
        </div>
        <div>
          <div v-for='(item,index) in list'>
            <div v-text='item'></div>
            <div v-text='index'></div>
          </div>
        </div>
        <div>
          <div v-for='(item,index) in list2'>
            <div v-for='i in item'>
              <div v-text='i'></div>
            </div>
          </div>
        </div>
        <!-- comment -->
        <input type='text' v-model='input.title' id="input" />
        <div>
          <input type="radio" value='me' v-model="radio" id='radioMe'>我
          <input type="radio" value='you' v-model="radio">你
        </div>
        <div>
          <input type="checkbox" value='apple' v-model='checkboxBool' id="checkboxBool">苹果
        </div>
        <div>
          <input type="checkbox" value='apple' v-model='checkboxArray' id='checkboxArray'>苹果
          <input type="checkbox" value='orange' v-model='checkboxArray'>橘子
          <input type="checkbox" value='banana' v-model='checkboxArray'>香蕉
        </div>
        <select v-model="selected" id='selected'>
          <option value="apple">苹果</option>
          <option value="orange">橘子</option>
          <option value="banana">香蕉</option>
        </select>
        <select v-model="selectedMult" multiple id='selectedMult'>
          <option value="apple">苹果</option>
          <option value="orange">橘子</option>
          <option value="banana">香蕉</option>
        </select>
      </div>
      `;

      const data = {
        view: document.getElementById("app"),
        methods: {
          getIndex: () => {}
        },
        model: {
          title: "title",
          isShow: true,
          main: "main",
          styleObj: { color: "red" },
          list: [1, 2, 3],
          list2: [[1], [2], [3]],
          input: {
            text: ""
          },
          newInput: {
            text: ""
          },
          radio: "",
          checkboxBool: false,
          checkboxArray: [],
          selected: "",
          selectedMult: []
        },
        mounted() {}
      };

      new MVVM(data);

      const $ = document.getElementById.bind(document);

      $("on").dispatchEvent(new Event("click"));
      $("input").dispatchEvent(new Event("input"));
      $("radioMe").dispatchEvent(new Event("change"));
      $("checkboxBool").dispatchEvent(new Event("change"));
      $("checkboxArray").dispatchEvent(new Event("click"));
      $("selected").dispatchEvent(new Event("change"));
      $("selectedMult").dispatchEvent(new Event("change"));

      setTimeout(() => {
        data.model.title = "newTitle";
        data.model.isShow = false;
        data.model.main = "main1";
        data.model.styleObj = { color: "#fff" };
        data.model.styleObj.color = "#eee";
        data.model.list = [2, 3, 4];
        data.model.list.push(1);
        data.model.list[2] = 5;
        data.model.list.length = 1;
        data.model.list2[2].push(3);
        data.model.input = data.model.newInput;
        data.model.radio = "me";
        data.model.checkboxBool = true;
        $("checkboxArray").dispatchEvent(new Event("click"));
        data.model.selectedMult = ["apple"];
        $("selectedMult").dispatchEvent(new Event("change"));
        done();
      }, 1000);
    }).not.toThrowError();
  });
  test("throw the error correctly when MVVM constructed", () => {
    expect(() => {
      // @ts-ignore
      new MVVM();
    }).toThrowError();
    expect(() => {
      // @ts-ignore
      new MVVM({ a: 1 });
    }).toThrowError();
    expect(() => {
      // @ts-ignore
      new MVVM({ view: document.createElement("div"), model: 1 });
    }).toThrowError();
  });
});
