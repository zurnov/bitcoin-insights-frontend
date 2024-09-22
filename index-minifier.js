var fs = require("fs");
var minify = require("html-minifier").minify;

var filePath = "dist/btc-insights/index.html";

fs.readFile(filePath, function (err, buf) {
  if (err) {
    console.log(err);
  } else {
    var originalValue = buf.toString();
    var minifiedValue = minify(originalValue, {
      collapseWhitespace: true,
      removeComments: true,
      minifyCSS: true,
      minifyJS: true,
    });

    fs.writeFile(filePath, minifiedValue, function (err) {
      if (err) {
        console.log(err);
      } else {
        console.log("Successfully minified '" + filePath + "'");
      }
    });
  }
});
