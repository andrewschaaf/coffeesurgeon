
fs = require 'fs'
async = require 'async'
DepGraph = require 'dep-graph'
{findSourceFile} = require './findSourceFile'
{parseImportsExports} = require './parseImportsExports'
{deepcopy, parentOf} = require './util'



_handlePathAndItsPrereqs = (path, codepath, deps, parseds, cb) ->
  fs.readFile path, (e, data) ->
    parsed = parseImportsExports data.toString 'utf-8'
    parseds[path] = parsed
    {exported_names, imports, body} = parsed
    f = ([names, fromQuery], cb2) ->
      findSourceFile query:fromQuery, fromDir:parentOf(path), codepath:codepath, (e, dependee) ->
        throw new Error "Couldn't find #{fromQuery}" if not path
        deps.add path, dependee
        _handlePathAndItsPrereqs dependee, codepath, deps, parseds, cb2
    async.forEach imports, f, cb


bodystitch = ({codepath, main}, cb) ->
  findSourceFile codepath:codepath, query:main, (e, mainPath) ->
    return cb e if e
    deps = new DepGraph
    parseds = {}
    _handlePathAndItsPrereqs mainPath, codepath, deps, parseds, (e) ->
      return cb e if e
      
      chain = deps.getChain mainPath
      chain.push mainPath
      
      # TODO more validation (name DNE, collisions, ...)
      
      arr = []
      for path in chain
        arr.push "### #{path} ####\n\n"
        arr.push parseds[path].body
        arr.push '\n\n'
      coffee = arr.join ''
      
      cb null, {coffee:coffee}


module.exports =
  bodystitch: bodystitch
