import { MVVM } from "./lib/mvvm";

const data = {
  view: document.getElementById("app"),
  model: {
    title: "标题",
    style: {
      "font-size": "24px",
      color: "#999"
    },
    class1: "main",
    src1: "www.baidu.com",
    img: "666.png",
    infoList: [{ name: "li", age: "12" }, { name: "wang", age: "24" }],
    pageIndex: 1,
    info: {
      title: "title的标题",
      he: {
        asd: "好好"
      }
    }
  },
  methods: {
    handler: function(e, title) {
      console.log(e, title);
    },
    getIndex: function(index, e) {
      console.log(index, e);
    }
  }
};
new MVVM(data);

setTimeout(() => {
  data.model.infoList.push(
    { name: "tr", age: "20" },
    { name: "tr1", age: "200" },
    { name: "tr2", age: "201" }
  );
  data.model.title = "新标题";
  data.model.info.he = {
    asd: "哈哈哈哈"
  };
  data.model.style = {
    color: "red"
  };
}, 3000);
