module.exports = {
  presets: [
    [
      "@babel/env",
      {
        targets: "> 1%, not dead"
      }
    ]
  ],
  plugins: [
    [
      "@babel/plugin-transform-runtime",
      {
        corejs: 2
      }
    ]
  ]
};
