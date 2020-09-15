import MVVM from "../src/index";

describe("Test ModelCheckbox", () => {
  test("throw the error correctly when Checkbox v-model must be type of Boolean or Array", () => {
    expect(() => {
      const view = document.createElement("div");
      view.innerHTML = "<input type='checkbox' v-model='box' />";
      new MVVM({
        view,
        model: {
          box: 123,
        },
      });
    }).toThrowError();
  });
});

describe("Test ModelParser", () => {
  test("throw the error correctly when v-model used for other tag", () => {
    expect(() => {
      const view = document.createElement("div");
      view.innerHTML = "<div v-model='show'><div>";
      new MVVM({
        view,
        model: {},
      });
    }).toThrowError();
  });
});

describe("Test ModelSelect", () => {
  test("throw the error correctly when Select v-model is it an array according to the attribute 'multi'", () => {
    expect(() => {
      const view = document.createElement("div");
      view.innerHTML = "<select v-model='fruit'></select>";
      new MVVM({
        view,
        model: {
          fruit: [],
        },
      });
    }).toThrowError();
    expect(() => {
      const view = document.createElement("div");
      view.innerHTML = "<select v-model='fruit' multiple></select>";
      new MVVM({
        view,
        model: {
          fruit: "",
        },
      });
    }).toThrowError();
  });
});
