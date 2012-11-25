var cleanCSS = require('clean-css');
var uglify = require('uglify-js');
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
    try {
      output.html[lineNumber] = exports.minifyJs(output.html[lineNumber].replace(/<!\-\-|\-\->/g, ''));
    } catch(e) {
      output.msg = output.msg + '\nCould not minify\n----------------\n' + output.html[lineNumber] + '\n----------------';
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
exports.failMessage = exports.report.bind(exports, 31, '✘');

/**
 * [reportOnInspection description]
 * @param  {[type]} output [description]
 * @return {[type]}        [description]
 */
exports.reportOnInspection = function(output) {
  var msg = (output.original.length - output.html.join('').length) + ' characters removed, ' + output.count + ' elements with layout unaffected by minification';
  if(exports.layoutIsIntact(output)) {
    exports.successMessage(msg);
  } else {
    exports.failMessage(msg + '\n- Please report the issue with this URL via the issues page at https://github.com/JamieMason/Asterisk/issues/new');
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
