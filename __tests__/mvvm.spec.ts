// @ts-nocheck
import MVVM from "../src/index";

describe("Test MVVM", () => {
  test("generate an MVVM instance correctly and completely", (done) => {
    expect(() => {
      document.body.innerHTML = `
      <div id='app'>
        <div v-text='title'></div>
        <div>{{title}}</div>
        <div v-show='isShow'>show</div>
        <div v-show='isShow' style='display:none'>show</div>
        <div v-show='isShow' style='display:"inline-block"'>show</div>
        <div v-hide='isShow'>hide</div>
        <div v-hide='isShow' style='display:"inline-block"'>hide</div>
        <div v-hide='isShow' style='display:none'>hide</div>
        <div>
          <div v-if='isShow'>if</div>
          <div v-if='!isShow'>noif</div>
        </div>
        <div v-class='main'>main</div>
        <div v-style='styleObj'>styleObj</div>
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
          <input type="checkbox" value='orange' checked="true" v-model='checkboxArray'>橘子
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
          getIndex: () => {
            console.log("test");
          },
        },
        model: {
          title: "标题",
          isShow: true,
          main: "main",
          styleObj: { color: "red" },
          list: [1, 2, 3],
          list2: [
            [{ name: "zz" }, { age: 11 }],
            [{ name: "kk" }, { age: 22 }],
            [{ name: "yy" }, { age: 33 }],
          ],
          input: {
            title: "",
          },
          newInput: {
            text: "",
          },
          radio: "",
          checkboxBool: false,
          checkboxArray: [],
          selected: "",
          selectedMult: [],
        },
        mounted() {
          setTimeout(() => {
            this.title = "newTitle1";
            this.title = "newTitle";
            this.isShow = false;
            this.main = "main1";
            this.styleObj = { color: "#fff" };
            this.styleObj.color = "#eee";
            this.list = [2, 3, 4];
            this.list = [2, 3, 4, 5];
            this.list.push(1);
            this.list[2] = 5;
            this.list.length = 1;
            this.list2[2].push(3);
            this.input = this.newInput;
            this.radio = "me";
            this.checkboxBool = true;
            this.checkboxArray = ["apple"];
            $("checkboxArray").dispatchEvent(new Event("change"));
            this.selectedMult = ["apple"];
            $("selectedMult").dispatchEvent(new Event("change"));
            done();
          }, 1000);
        },
      };
      new MVVM(data);
      const $ = document.getElementById.bind(document);
      $("on").dispatchEvent(new Event("click"));
      $("input").dispatchEvent(new Event("input"));
      $("radioMe").dispatchEvent(new Event("change"));
      $("checkboxBool").dispatchEvent(new Event("change"));
      $("checkboxArray").dispatchEvent(new Event("change"));
      $("selected").dispatchEvent(new Event("change"));
      $("selectedMult").dispatchEvent(new Event("change"));
    }).not.toThrowError();
  });
  test("throw the error correctly when MVVM constructed", () => {
    expect(() => {
      new MVVM();
    }).toThrowError();
    expect(() => {
      new MVVM({ a: 1 });
    }).toThrowError();
    expect(() => {
      new MVVM({ view: document.createElement("div"), model: 1 });
    }).toThrowError();
  });
});
