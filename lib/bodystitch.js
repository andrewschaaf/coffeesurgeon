(function() {
  var DepGraph, async, bodystitch, deepcopy, findSourceFile, fs, parentOf, parseImportsExports, _, _handlePathAndItsPrereqs, _ref;
  _ = require('underscore');
  fs = require('fs');
  async = require('async');
  DepGraph = require('dep-graph');
  findSourceFile = require('./findSourceFile').findSourceFile;
  parseImportsExports = require('./parseImportsExports').parseImportsExports;
  _ref = require('./util'), deepcopy = _ref.deepcopy, parentOf = _ref.parentOf;
  _handlePathAndItsPrereqs = function(path, codepath, deps, parseds, willHaveBeenParsed, cb) {
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
          if (!dependee) {
            throw new Error("Couldn't find " + fromQuery + " from " + path);
          }
          deps.add(path, dependee);
          if (willHaveBeenParsed[dependee] != null) {
            return cb2(null);
          } else {
            willHaveBeenParsed[dependee] = true;
            return _handlePathAndItsPrereqs(dependee, codepath, deps, parseds, willHaveBeenParsed, cb2);
          }
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
      var deps, parseds, willHaveBeenParsed;
      if (e) {
        return cb(e);
      }
      deps = new DepGraph;
      parseds = {};
      willHaveBeenParsed = {};
      return _handlePathAndItsPrereqs(mainPath, codepath, deps, parseds, willHaveBeenParsed, function(e) {
        var arr, coffee, deps_chain, deps_map, path, _i, _len;
        if (e) {
          return cb(e);
        }
        deps_chain = deps.getChain(mainPath);
        deps_map = deps.map;
        arr = [];
        for (_i = 0, _len = deps_chain.length; _i < _len; _i++) {
          path = deps_chain[_i];
          arr.push("### " + path + " ####\n\n");
          arr.push(parseds[path].body);
          arr.push('\n\n');
        }
        coffee = arr.join('');
        return cb(null, {
          coffee: coffee,
          deps_map: deps_map,
          deps_chain: deps_chain
        });
      });
    });
  };
  module.exports = {
    bodystitch: bodystitch
  };
}).call(this);
