global.modules["os"] = {"state": 0, "fn": function(exports, require, module){exports = module.exports;
// https://github.com/defunctzombie/node-util/blob/master/os.js

'use strict';

//const binding = process.binding('os');
//const internalUtil = require('internal/util');
const isWindows = process.platform === 'win32';

exports.hostname = function(){return "hostname"};//binding.getHostname;
exports.loadavg = function(){return []};//binding.getLoadAvg;
exports.uptime = function(){return 0};//binding.getUptime;
exports.freemem = function(){return 0};//binding.getFreeMem;
exports.totalmem = function(){return 0};//binding.getTotalMem;
exports.cpus = function(){return []};//binding.getCPUs;
exports.type = function(){return "Windows_NT"};//binding.getOSType;
exports.release = function(){return "0.0.0"};//binding.getOSRelease;
exports.networkInterfaces = function(){return null};//binding.getInterfaceAddresses;
//exports.homedir = function(){return []};//binding.getHomeDirectory;


exports.arch = function() {
  return process.arch;
};

exports.platform = function() {
  return process.platform;
};

const trailingSlashRe = isWindows ? /[^:]\\$/
                                  : /.\/$/;

exports.tmpdir = function() {
  var path;
  if (isWindows) {
    path = process.env.TEMP ||
           process.env.TMP ||
           (process.env.SystemRoot || process.env.windir) + '\\temp';
  } else {
    path = process.env.TMPDIR ||
           process.env.TMP ||
           process.env.TEMP ||
           '/tmp';
  }
  if (trailingSlashRe.test(path))
    path = path.slice(0, -1);
  return path;
};

exports.tmpDir = exports.tmpdir;

/*exports.getNetworkInterfaces = internalUtil.deprecate(function() {
  return exports.networkInterfaces();
}, 'os.getNetworkInterfaces is deprecated. ' +
   'Use os.networkInterfaces instead.');*/

exports.EOL = isWindows ? '\r\n' : '\n';

/*if (binding.isBigEndian)
  exports.endianness = function() { return 'BE'; };
else*/
  exports.endianness = function() { return 'LE'; };

;return module.exports;}};