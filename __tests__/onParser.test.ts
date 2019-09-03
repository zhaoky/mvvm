import MVVM from "../src/core/mvvm";

describe("Test OnParser", () => {
  test("throw the error correctly when v-on used for other tag", () => {
    expect(() => {
      const view = document.createElement("div");
      view.innerHTML = "<div v-on:click='show('><div>";
      new MVVM({
        view,
        model: {}
      });
    }).toThrowError();
  });
  test("click is converted to touchstart in a mobile environment", () => {
    Reflect.defineProperty(window.navigator, "userAgent", {
      value: "Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1",
      writable: true,
      enumerable: false,
      configurable: true
    });
    expect(() => {
      const view = document.createElement("div");
      view.innerHTML = "<div v-on:click='show'><div>";
      new MVVM({
        view,
        model: {}
      });
    }).not.toThrowError();
  });
});
