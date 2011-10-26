
assert = require 'assert'
path = require 'path'
fs = require 'fs'
async = require 'async'
{startswith} = require 'moof'
{parseImportsExports} = require './analysis'


stitchBodies = ({codepath, main}, callback) ->
  throw new Error "TODO"
  callback null, {
    coffee: coffee
  }


findSourceFile = ({query, fromDir, codepath}, callback) ->
  if startswith query, "/"
    callback null, query + ".coffee"
  else if startswith query, "."
    assert.ok fromDir
    callback null, path.join(fromDir, query)
  else
    f = (dir, cb) ->
      p = path.join(dir, query)
      fs.stat p, (e) ->
        cb null, (if e then null else p)
    async.map codepath, f, (e, paths) ->
      for p in paths
        if p
          return callback null, p
      callback "couldn't find #{JSON.stringify query} on codepath #{JSON.stringify codepath}"


module.exports =
  #stitchBodies: stitchBodies
  parseImportsExports: parseImportsExports
  findSourceFile: findSourceFile
