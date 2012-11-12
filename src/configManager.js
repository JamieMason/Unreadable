var fs = require('fs');
var path = require('path');

exports.init = function(options) {
  exports.executionDir = options.executionDir;
  exports.binDir = options.binDir;
  exports.program = options.program;
};

exports.deepExtend = function(destination, source) {
  for(var property in source) {
    if(source[property] && source[property].constructor && source[property].constructor === Object) {
      destination[property] = destination[property] || {};
      exports.deepExtend(destination[property], source[property]);
    } else {
      destination[property] = source[property];
    }
  }
  return destination;
};

exports.hasUserConfig = function() {
  return !!exports.program.config;
};

exports.getPathToUserConfig = function(){
  return path.resolve(exports.executionDir, exports.program.config);
};

exports.userConfigFileExists = function() {
  return exports.hasUserConfig() && fs.existsSync(exports.getPathToUserConfig());
};

exports.userConfigIsValidJson = function() {
  var pathToUserConfig = exports.getPathToUserConfig();
  try {
    require(pathToUserConfig);
    return true;
  } catch(e) {
    console.error('Error parsing JSON config file at "' + pathToUserConfig + '"');
    return false;
  }
};

exports.getDefaultConfig = function() {
  return require(path.resolve(exports.binDir, 'defaults.json'));
};

exports.getUserConfig = function() {
  return exports.hasUserConfig() && exports.userConfigFileExists() && exports.userConfigIsValidJson() ? require(exports.getPathToUserConfig()) : {};
};

exports.getConfig = function() {
  return exports.deepExtend(exports.getDefaultConfig(), exports.getUserConfig());
};

exports.getPathToConfig = function() {
  return path.resolve(exports.binDir, 'config.json');
};

exports.writeConfig = function() {
  fs.writeFileSync(exports.getPathToConfig(), JSON.stringify(exports.getConfig()), 'utf8');
};
