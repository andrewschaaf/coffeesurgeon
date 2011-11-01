
assert = require 'assert'
path = require 'path'
fs = require 'fs'
async = require 'async'
{startswith} = require 'moof'


findSourceFile = ({query, fromDir, codepath}, cb) ->
  
  if startswith query, "/"
    cb null, query + ".coffee"
  
  else if startswith query, "."
    fs.realpath fromDir, (e, fromDirNormalized) ->
      cb e if e
      result = path.join(fromDirNormalized, query + '.coffee')
      fs.stat result, (e, stat) ->
        return cb e if e
        cb null, result
  
  else
    f = (dir, cb2) ->
      p = path.join(dir, query + '.coffee')
      fs.stat p, (e) ->
        cb2 null, (if e then null else p)
    async.map codepath, fs.realpath, (e, codepathNormalized) ->
      async.map codepathNormalized, f, (e, paths) ->
        for p in paths
          if p
            return cb null, p
        cb "couldn't find #{JSON.stringify query} on codepath #{JSON.stringify codepath}"


module.exports =
  findSourceFile: findSourceFile
