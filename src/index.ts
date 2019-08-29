import MVVM from "@mvvm";

const data = {
  view: document.getElementById("app"),
  model: {
    title: "hello mvvm!"
  },
  mounted(): void {
    console.log("------------------------------");
    console.log("主程编译完成,欢迎使用MVVM！");
    console.log("项目介绍及API查阅(https://github.com/zhaoky/mvvm)");
    console.log("项目仅供学习交流使用，请勿用于生产环境！");
    console.log("正在持续完善中，欢迎提issue(https://github.com/zhaoky/mvvm/issues) ^ ^");
    console.log("------------------------------");
  }
};

new MVVM(data);
