import MVVM from "../src/core/mvvm";

describe("Test ModelSelect", () => {
  test("throw the error correctly when Select v-model is it an array according to the attribute 'multi'", () => {
    expect(() => {
      const view = document.createElement("div");
      view.innerHTML = "<select v-model='fruit'></select>";
      new MVVM({
        view,
        model: {
          fruit: []
        }
      });
    }).toThrowError();
    expect(() => {
      const view = document.createElement("div");
      view.innerHTML = "<select v-model='fruit' multiple></select>";
      new MVVM({
        view,
        model: {
          fruit: ""
        }
      });
    }).toThrowError();
  });
});
