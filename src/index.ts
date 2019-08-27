import MVVM from "./core/mvvm";

const data = {
  view: document.getElementById("app"),
  model: {
    title: "hello mvvm!"
  },
  mounted(): void {
    console.log("主程编译完成");
  }
};

new MVVM(data);
