exports.processBrowserOutput = function (stdout) {
  console.log(JSON.parse(stdout).join(''));
};
