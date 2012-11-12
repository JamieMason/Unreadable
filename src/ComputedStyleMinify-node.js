var cleanCSS = require('clean-css');
var uglify = require('uglify-js');
var uglifyProcessor = uglify.uglify;
var uglifyConfig;

function minifyJs(data) {
  var ast = uglify.parser.parse(data, uglifyConfig.strict_semicolons);
  if (uglifyConfig.lift_variables) {
    ast = uglifyProcessor.ast_lift_variables(ast);
  }
  if (!uglifyConfig.no_mangle) {
    ast = uglifyProcessor.ast_mangle(ast, uglifyConfig.mangle);
  }
  if (!uglifyConfig.no_squeeze) {
    ast = uglifyProcessor.ast_squeeze(ast, uglifyConfig.squeeze);
  }
  return uglifyProcessor.gen_code(ast, uglifyConfig.gen_code);
}

exports.processBrowserOutput = function (stdout, config) {

  var json = JSON.parse(stdout);

  uglifyConfig = config.uglify_js;

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
