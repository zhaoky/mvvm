/* eslint-disable */
import MVVM from "../src/core/mvvm";

describe("Test ModelCheckbox", () => {
  test("throw the error correctly when Checkbox v-model must be type of Boolean or Array", () => {
    expect(() => {
      const view = document.createElement("div");
      view.innerHTML = "<input type='checkbox' v-model='box' />";
      new MVVM({
        view,
        model: {
          box: 123
        }
      });
    }).toThrowError();
  });
});
