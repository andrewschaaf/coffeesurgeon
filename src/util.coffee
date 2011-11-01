
{rstrip} = require 'tafa-misc-util'


deepcopy = (x) ->
  JSON.parse JSON.stringify x


parentOf = (path) ->
  arr = rstrip(path, '/').split('/')
  arr.slice(0, arr.length - 1).join('/')


module.exports =
  deepcopy: deepcopy
  parentOf: parentOf
