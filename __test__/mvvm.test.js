import { MVVM } from "./../dist/mvvm";

test("666", () => {
  expect(() => {
    const data = {
      view: document.createElement("div"),
      model: {
        a: {}
      }
    };
    new MVVM(data);
  }).not.toThrowError();
});
