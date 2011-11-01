(function() {
  var assert, async, findSourceFile, fs, path, startswith;
  assert = require('assert');
  path = require('path');
  fs = require('fs');
  async = require('async');
  startswith = require('moof').startswith;
  findSourceFile = function(_arg, cb) {
    var codepath, f, fromDir, query;
    query = _arg.query, fromDir = _arg.fromDir, codepath = _arg.codepath;
    if (startswith(query, "/")) {
      return cb(null, query + ".coffee");
    } else if (startswith(query, ".")) {
      return fs.realpath(fromDir, function(e, fromDirNormalized) {
        var result;
        if (e) {
          cb(e);
        }
        result = path.join(fromDirNormalized, query + '.coffee');
        return fs.stat(result, function(e, stat) {
          if (e) {
            return cb(e);
          }
          return cb(null, result);
        });
      });
    } else {
      f = function(dir, cb2) {
        var p;
        p = path.join(dir, query + '.coffee');
        return fs.stat(p, function(e) {
          return cb2(null, (e ? null : p));
        });
      };
      return async.map(codepath, fs.realpath, function(e, codepathNormalized) {
        return async.map(codepathNormalized, f, function(e, paths) {
          var p, _i, _len;
          for (_i = 0, _len = paths.length; _i < _len; _i++) {
            p = paths[_i];
            if (p) {
              return cb(null, p);
            }
          }
          return cb("couldn't find " + (JSON.stringify(query)) + " on codepath " + (JSON.stringify(codepath)));
        });
      });
    }
  };
  module.exports = {
    findSourceFile: findSourceFile
  };
}).call(this);
