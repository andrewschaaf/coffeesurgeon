(function() {
  var deepcopy, parentOf, rstrip;
  rstrip = require('tafa-misc-util').rstrip;
  deepcopy = function(x) {
    return JSON.parse(JSON.stringify(x));
  };
  parentOf = function(path) {
    var arr;
    arr = rstrip(path, '/').split('/');
    return arr.slice(0, arr.length - 1).join('/');
  };
  module.exports = {
    deepcopy: deepcopy,
    parentOf: parentOf
  };
}).call(this);
