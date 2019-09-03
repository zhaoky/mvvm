import MVVM from "../src/core/mvvm";

describe("Test ModelParser", () => {
  test("throw the error correctly when v-model used for other tag", () => {
    expect(() => {
      const view = document.createElement("div");
      view.innerHTML = "<div v-model='show'><div>";
      new MVVM({
        view,
        model: {}
      });
    }).toThrowError();
  });
});
