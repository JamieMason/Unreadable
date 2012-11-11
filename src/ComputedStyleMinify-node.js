var cleanCSS = require('clean-css');
var uglify = require('uglify-js');

function minifyJs(data) {
  var ast = uglify.parser.parse(data);
  ast = uglify.uglify.ast_mangle(ast);
  ast = uglify.uglify.ast_squeeze(ast);
  return uglify.uglify.gen_code(ast, {
    inline_script: true
  });
}

exports.processBrowserOutput = function (stdout) {

  var json = JSON.parse(stdout);

  if (json === null) {
    console.error('null output');
  }

  if (json.iStyles.length) {
    json.iStyles.forEach(function(lineNumber){
      json.html[lineNumber] = cleanCSS.process(json.html[lineNumber]);
    });
  }

  if (json.iScripts.length) {
    json.iScripts.forEach(function(lineNumber){
      json.html[lineNumber] = minifyJs(json.html[lineNumber].replace(/^\s*<!\-\-|\/*\-\->\s*$/g, ''));
    });
  }

  console.log(json.html.join(''));

};
