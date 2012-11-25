var cleanCSS = require('clean-css');
var uglify = require('uglify-js');
var uglifyProcessor = uglify.uglify;
var uglifyConfig;

exports.minifyJs = function(jsCode) {
  var ast = uglify.parser.parse(jsCode, uglifyConfig.strict_semicolons);
  if(uglifyConfig.lift_variables) {
    ast = uglifyProcessor.ast_lift_variables(ast);
  }
  if(!uglifyConfig.no_mangle) {
    ast = uglifyProcessor.ast_mangle(ast, uglifyConfig.mangle);
  }
  if(!uglifyConfig.no_squeeze) {
    ast = uglifyProcessor.ast_squeeze(ast, uglifyConfig.squeeze);
  }
  return uglifyProcessor.gen_code(ast, uglifyConfig.gen_code);
};

exports.minifyInlineJs = function(output) {
  output.iScripts.forEach(function(lineNumber) {
    try {
      output.html[lineNumber] = exports.minifyJs(output.html[lineNumber].replace(/<!\-\-|\-\->/g, ''));
    } catch(e) {
      output.msg = output.msg + '\nCould not minify\n----------------\n' + output.html[lineNumber] + '\n----------------';
    }
  });
  return output;
};

exports.minifyInlineCss = function(output) {
  output.iStyles.forEach(function(lineNumber) {
    output.html[lineNumber] = cleanCSS.process(output.html[lineNumber]);
  });
  return output;
};

exports.parseOutput = function(output) {
  try {
    output = JSON.parse(output);
  } catch(err) {
    output = null;
  }
  if(!output) {
    throw new Error('Invalid JSON returned from Browser');
  }
  return output;
};

exports.processBrowserOutput = function(output, config) {
  uglifyConfig = config.uglify_js;
  output = exports.minifyInlineCss(exports.minifyInlineJs(exports.parseOutput(output)));
  if(output.count > 0){
    if(output.count === output.intact){
      console.log('\u001b[0;32m' + '✔ ' + output.count + ' elements with layout unaffected after minification' + '\u001b[0;0m');
    } else {
      console.log('\u001b[0;31m' + '✘ ' + output.count + ' elements with layout unaffected after minification' + '\u001b[0;0m');
      console.log('Please report the issue with this URL via the issues page at https://github.com/JamieMason/Asterisk/issues/new');
    }
  }
  return output.html.join('');
};
