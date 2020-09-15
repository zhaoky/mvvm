import MVVM from "../src/index";

describe("Test Watcher", () => {
  test("throw the error correctly when expression is keyword in _getter in Watcher", () => {
    expect(() => {
      const view = document.createElement("div");
      view.innerHTML = "<div v-class='class'><div>";
      new MVVM({
        view,
        model: {},
      });
    }).toThrowError();
  });
});
