(function() {
  var bodystitch, findSourceFile, parseImportsExports;
  parseImportsExports = require('./parseImportsExports').parseImportsExports;
  findSourceFile = require('./findSourceFile').findSourceFile;
  bodystitch = require('./bodystitch').bodystitch;
  module.exports = {
    parseImportsExports: parseImportsExports,
    findSourceFile: findSourceFile,
    bodystitch: bodystitch
  };
}).call(this);
