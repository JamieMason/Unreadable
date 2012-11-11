/**
 * @fileOverview
 * @author Jamie Mason, <a href="http://twitter.com/gotnosugarbaby">@GotNoSugarBaby</a>, <a href="https://github.com/JamieMason">https://github.com/JamieMason</a>
 */

exports.processBrowserOutput = function (stdout) {
  console.log(JSON.parse(stdout).join(''));
};
