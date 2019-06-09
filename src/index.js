import { MVVM } from "./lib/mvvm";

const data = {
  view: document.getElementById("app"),
  model: {
    a: {},
    info: {}
    // v: false,
    // title: "标题",
    // styleObj: {
    //   "font-size": "24px",
    //   color: "#999"
    // },
    // styleObj1: {
    //   color: "red"
    // },
    // class1: "main",
    // src1: "www.baidu.com",
    // img: "666.png",
    // infoList: [{ name: "li", age: "12" }, { name: "wang", age: "24" }]
    // // pageIndex: 1,
    // info: {
    //   he: {
    //     body: {
    //       name: "好好啊"
    //     }
    //   },
    //   she: {
    //     body: {
    //       name: "好好额"
    //     }
    //   }
    // }
  },
  methods: {
    // handler: function(e, title) {
    //   console.log(e, title);
    // },
    // getIndex: function(index, e) {
    //   console.log(index, e);
    // },
    // test: function() {
    //   console.log(666);
    // }
  },
  mounted() {
    console.log("主程编译完成");
  }
};
new MVVM(data);

setTimeout(() => {
  // data.model.title = "新标题";
  // data.model.style = {
  //   color: "red"
  // };
  // data.model.info = {
  //   he: {
  //     asd: "哈哈哈哈"
  //   }
  // };
  // data.model.info.he = {
  //   asd: "哈哈哈哈"
  // };
  // setTimeout(() => {
  //   data.model.info.he = {
  //     asd: "哈哈哈哈1"
  //   };
  // }, 4000);
  // data.model.info = {
  //   he: {
  //     body: {
  //       name: 111
  //     }
  //   }
  // };
  setTimeout(() => {
    // data.model.v = false;
  }, 5000);
  data.model.info = {
    list: [{ name: "li", age: "12" }, { name: "wang", age: "24" }]
  };
  // data.model.v = true;
  // data.model.infoList.push(
  //   { name: "tr", age: "20" },
  //   { name: "tr1", age: "200" },
  //   { name: "tr2", age: "201" }
  // );
  // data.model.a = {
  //   color: {
  //     color: "red"
  //   }
  // };
}, 3000);
