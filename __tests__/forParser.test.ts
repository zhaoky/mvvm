import MVVM from "../src/core/mvvm";

describe("Test ForParser", () => {
  test("throw the error correctly when v-for used in the root element", () => {
    expect(() => {
      const view = document.createElement("div");
      view.innerHTML = "<div v-for='item in list'><div>";
      new MVVM({
        view,
        model: {}
      });
    }).toThrowError();
  });
  test("exit correctly when v-for model is empty", () => {
    expect(() => {
      const view = document.createElement("div");
      view.innerHTML = "<div><div v-for='item in list'><div><div>";
      new MVVM({
        view,
        model: {
          list: ""
        }
      });
    }).not.toThrowError();
  });
  test("throw the error correctly when v-for model not array", () => {
    expect(() => {
      const view = document.createElement("div");
      view.innerHTML = "<div><div v-for='item in list'><div><div>";
      new MVVM({
        view,
        model: {
          list: "123"
        }
      });
    }).toThrowError();
  });
});
