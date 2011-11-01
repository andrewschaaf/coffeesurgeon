(function() {
  var DepGraph, async, bodystitch, deepcopy, findSourceFile, fs, parentOf, parseImportsExports, _handlePathAndItsPrereqs, _ref;
  fs = require('fs');
  async = require('async');
  DepGraph = require('dep-graph');
  findSourceFile = require('./findSourceFile').findSourceFile;
  parseImportsExports = require('./parseImportsExports').parseImportsExports;
  _ref = require('./util'), deepcopy = _ref.deepcopy, parentOf = _ref.parentOf;
  _handlePathAndItsPrereqs = function(path, codepath, deps, parseds, cb) {
    return fs.readFile(path, function(e, data) {
      var body, exported_names, f, imports, parsed;
      parsed = parseImportsExports(data.toString('utf-8'));
      parseds[path] = parsed;
      exported_names = parsed.exported_names, imports = parsed.imports, body = parsed.body;
      f = function(_arg, cb2) {
        var fromQuery, names;
        names = _arg[0], fromQuery = _arg[1];
        return findSourceFile({
          query: fromQuery,
          fromDir: parentOf(path),
          codepath: codepath
        }, function(e, dependee) {
          if (!path) {
            throw new Error("Couldn't find " + fromQuery);
          }
          deps.add(path, dependee);
          return _handlePathAndItsPrereqs(dependee, codepath, deps, parseds, cb2);
        });
      };
      return async.forEach(imports, f, cb);
    });
  };
  bodystitch = function(_arg, cb) {
    var codepath, main;
    codepath = _arg.codepath, main = _arg.main;
    return findSourceFile({
      codepath: codepath,
      query: main
    }, function(e, mainPath) {
      var deps, parseds;
      if (e) {
        return cb(e);
      }
      deps = new DepGraph;
      parseds = {};
      return _handlePathAndItsPrereqs(mainPath, codepath, deps, parseds, function(e) {
        var arr, chain, coffee, path, _i, _len;
        if (e) {
          return cb(e);
        }
        chain = deps.getChain(mainPath);
        chain.push(mainPath);
        arr = [];
        for (_i = 0, _len = chain.length; _i < _len; _i++) {
          path = chain[_i];
          arr.push("### " + path + " ####\n\n");
          arr.push(parseds[path].body);
          arr.push('\n\n');
        }
        coffee = arr.join('');
        return cb(null, {
          coffee: coffee
        });
      });
    });
  };
  module.exports = {
    bodystitch: bodystitch
  };
}).call(this);
