import MVVM from "../src/core/mvvm";

describe("Test IfParser", () => {
  test("throw the error correctly when v-if used in the root element", () => {
    expect(() => {
      const view = document.createElement("div");
      view.innerHTML = "<div v-if='show'><div>";
      new MVVM({
        view,
        model: {}
      });
    }).toThrowError();
  });
});
