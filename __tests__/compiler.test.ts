import MVVM from "../src/core/mvvm";

describe("Test Compiler", () => {
  test("test option.methods and option.mounted not exist", () => {
    expect(() => {
      new MVVM({
        view: document.createElement("div"),
        model: {}
      });
    }).not.toThrowError();
  });
});
