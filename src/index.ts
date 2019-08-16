import MVVM from "./core/mvvm";

const data = {
  view: document.getElementById("app"),
  model: {
    isCheck: true,
    // a: {
    //   b: {
    //     style: {
    //       h: {
    //         color: "yellow"
    //       }
    //     }
    //   }
    // }
    // info: {
    //   list: [{ name: "li", age: "12" }, { name: "wang", age: "24" }]
    //   // list1: [1, 2, 3]
    // }
    // v: false,
    title: "标题"
    // title: {
    // info: [1, 2, 3]
    // }
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
    // pageIndex: 1,
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
    // L: [
    //   {
    //     name: "zky",
    //     class: [[11], [33]]
    //   },
    //   {
    //     name: "lr",
    //     class: [[111], [333]]
    //   }
    // ]
    // radio: "",
    // radio1: "",
    // checkbox: [],
    // checkbox1: false
    // selected: []
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
  mounted(): void {
    console.log("主程编译完成");
  }
};
new MVVM(data);

setTimeout((): void => {
  // data.model.title.info = "新标题";
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
  // setTimeout((): void => {
  //   data.model.info.list[4].name = "zky1";
  //   setTimeout((): void => {
  //     data.model.info.list.splice(2, 2);
  //     setTimeout((): void => {
  //       data.model.info.list[2].name = "lr";
  //     }, 5000);
  //   }, 5000);
  // }, 5000);
  // console.log(1);
  // data.model.info = {
  //   list: [
  //     { name: "li", age: "12" },
  //     { name: "wang", age: "24" },
  //     { name: "wang", age: "25" }
  //   ],
  //   list1: [1, 2, 3, 4]
  // };
  // data.model.info.list.push(1);
  // data.model.v = true;
  // data.model.info.list.push({ name: "tr", age: "20" }, { name: "tr1", age: "200" }, { name: "tr2", age: "201" });
  // data.model.a = {
  //   color: {
  //     color: "red"
  //   }
  // };
  // data.model.a.b.style.h.color = "#333";
  // data.model.info.list[1].name = "zky";
  // data.model.info.list = [{ name: "tr", age: "20" }, { name: "tr1", age: "200" }];
  // data.model.L[0].class = [[555], [666]];
  // data.model.L[0].class.unshift([44]);
  // data.model.title.info[2] = 666;
}, 8000);
