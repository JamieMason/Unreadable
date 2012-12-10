var cleanCSS = require('clean-css');
var uglify = require('../node_modules/uglify-js');
var uglifyProcessor = uglify.uglify;
var uglifyConfig;

/**
 * Run JavaScript source code through Uglify-JS
 * @param  {String} jsCode
 * @return {String}
 */
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

/**
 * Iterate over each `<script>` element containing inline source code
 * @param  {Object} output
 * @return {Object}
 */
exports.readScriptElements = function(output) {
  output.iScripts.forEach(function(lineNumber) {
    for (var i = lineNumber + 1; output.html[i] !== '</script>'; i++) {
      output.html[lineNumber] = output.html[lineNumber] + output.html[i];
      output.html[i] = '';
    }
    try {
      output.html[lineNumber] = exports.minifyJs(output.html[lineNumber].replace(/<!\-\-|\-\->/g, ''));
    } catch(e) {
      exports.failMessage('Some scripts could not be minified');
    }
  });
  return output;
};

/**
 * Iterate over each `<style>` element containing inline source code
 * @param  {Object} output
 * @return {Object}
 */
exports.readStyleElements = function(output) {
  output.iStyles.forEach(function(lineNumber) {
    output.html[lineNumber] = cleanCSS.process(output.html[lineNumber]);
  });
  return output;
};

/**
 * A defensive wrapper for JSON.parse of the output returned by PhantomJS
 * @param  {String} output
 * @return {Object}
 */
exports.parseOutput = function(output) {
  var json;
  try {
    json = JSON.parse(output);
  } catch(err) {
    json = null;
  }
  if(!json) {
    exports.failMessage('Invalid JSON returned from Browser');
    process.exit(1);
  }
  return json;
};

/**
 * Write a coloured log with a symbol and message
 * @param  {Number} colour  ANSI colour code
 * @param  {String} symbol  Prefix message with a symbol
 * @param  {String} msg
 */
exports.report = function(colour, symbol, msg) {
  console.log('\u001b[0;' + colour + 'm' + symbol + ' ' + msg + '\u001b[0;0m');
};

/**
 * Write a green log prefixed with a tick symbol
 * @param  {String} msg
 */
exports.successMessage = exports.report.bind(exports, 32, '✔');

/**
 * Write a red log prefixed with a cross
 * @param  {String} msg
 */
exports.failMessage = function(msg) {
  exports.report(31, '✘', msg + '\n  Please report this URL via the issues page at \033[4mhttps://github.com/JamieMason/Unreadable/issues/new\033[0m');
};

/**
 * [reportOnInspection description]
 * @param  {[type]} output [description]
 * @return {[type]}        [description]
 */
exports.reportOnInspection = function(output) {
  var msg = (output.contentLength.before - output.contentLength.after) + ' characters removed, ' + output.intact + '/' + output.count + ' elements with layout unaffected by minification';
  if(exports.layoutIsIntact(output)) {
    exports.successMessage(msg);
  } else {
    exports.failMessage(msg);
  }
};

/**
 * Was --inspect set when running this session?
 * @param  {Object} output
 * @return {Boolean}
 */
exports.inspectionWasTaken = function(output) {
  return output.count > 0;
};

/**
 * Is the size and position of every element identical as before we processed it?
 * @param  {Object} output
 * @return {Boolean}
 */
exports.layoutIsIntact = function(output) {
  return output.count > 0 && output.count === output.intact;
};

/**
 * When PhantomJS has finished, run further optimisations on the source and return the markup
 * @param  {String} output
 * @param  {Object} config
 * @return {Object}
 */
exports.processBrowserOutput = function(output, config) {
  uglifyConfig = config.uglify_js;
  output = exports.readStyleElements(exports.readScriptElements(exports.parseOutput(output)));
  if(exports.inspectionWasTaken(output)) {
    exports.reportOnInspection(output);
  }
  return {
    isIntact: !exports.inspectionWasTaken(output) || exports.layoutIsIntact(output),
    markup: output.html.join('')
  };
};
