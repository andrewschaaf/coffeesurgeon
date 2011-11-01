(function() {
  var assert, cs, parseImportsExports, _, _extractExports, _extractImports;
  assert = require('assert');
  cs = require('coffee-script');
  _ = require('underscore');
  parseImportsExports = function(coffee) {
    var exported_names, imports, remaining_coffee, _ref, _ref2;
    _ref = _extractExports(coffee), exported_names = _ref.exported_names, remaining_coffee = _ref.remaining_coffee;
    _ref2 = _extractImports(remaining_coffee), imports = _ref2.imports, remaining_coffee = _ref2.remaining_coffee;
    return {
      exported_names: exported_names,
      imports: imports,
      body: remaining_coffee
    };
  };
  _extractExports = function(coffee) {
    var assignment, exports_coffee, expressions, i, keys, remaining_coffee, value, values, x, y;
    i = coffee.indexOf('module.exports');
    if (i === -1) {
      return {
        remaining_coffee: coffee,
        exported_names: []
      };
    } else {
      remaining_coffee = coffee.substr(0, i);
      exports_coffee = coffee.substr(i);
      expressions = cs.nodes(exports_coffee).expressions;
      assignment = expressions[0];
      value = assignment.value;
      x = value;
      keys = (function() {
        var _i, _len, _ref, _results;
        _ref = x.base.properties;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          y = _ref[_i];
          _results.push(y.variable.base.value);
        }
        return _results;
      })();
      values = (function() {
        var _i, _len, _ref, _results;
        _ref = x.base.properties;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          y = _ref[_i];
          _results.push(y.value.base.value);
        }
        return _results;
      })();
      assert.equal(JSON.stringify(keys), JSON.stringify(values));
      return {
        remaining_coffee: remaining_coffee,
        exported_names: keys
      };
    }
  };
  _extractImports = function(coffee) {
    var expressions, i, imports, m, mod, names, remaining_coffee, x, y, _i, _len, _ref, _ref2, _ref3, _ref4;
    expressions = cs.nodes(coffee).expressions;
    imports = [];
    for (_i = 0, _len = expressions.length; _i < _len; _i++) {
      x = expressions[_i];
      if (((_ref = x.value) != null ? (_ref2 = _ref.variable) != null ? (_ref3 = _ref2.base) != null ? _ref3.value : void 0 : void 0 : void 0) !== 'require') {
        break;
      }
      names = (function() {
        var _j, _len2, _ref4, _results;
        _ref4 = x.variable.base.properties;
        _results = [];
        for (_j = 0, _len2 = _ref4.length; _j < _len2; _j++) {
          y = _ref4[_j];
          _results.push(y.base.value);
        }
        return _results;
      })();
      mod = x.value.args[0].base.value;
      mod = mod.match(/.(.+)./)[1];
      imports.push([names, mod]);
    }
    if (imports.length === 0) {
      return {
        imports: [],
        remaining_coffee: coffee
      };
    }
    _ref4 = _.last(imports), names = _ref4[0], mod = _ref4[1];
    m = coffee.match(".*=.*require.*" + mod + ".*\n");
    i = m.index + m[0].length + 1;
    remaining_coffee = coffee.substr(i);
    return {
      imports: imports,
      remaining_coffee: remaining_coffee
    };
  };
  module.exports = {
    parseImportsExports: parseImportsExports
  };
}).call(this);
