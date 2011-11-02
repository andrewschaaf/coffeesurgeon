
_ = require 'underscore'
fs = require 'fs'
async = require 'async'
DepGraph = require 'dep-graph'
{findSourceFile} = require './findSourceFile'
{parseImportsExports} = require './parseImportsExports'
{deepcopy, parentOf} = require './util'



_handlePathAndItsPrereqs = (path, codepath, deps, parseds, willHaveBeenParsed, cb) ->
  fs.readFile path, (e, data) ->
    parsed = parseImportsExports data.toString 'utf-8'
    parseds[path] = parsed
    {exported_names, imports, body} = parsed
    f = ([names, fromQuery], cb2) ->
      findSourceFile query:fromQuery, fromDir:parentOf(path), codepath:codepath, (e, dependee) ->
        throw new Error "Couldn't find #{fromQuery} from #{path}" if not dependee
        deps.add path, dependee
        if willHaveBeenParsed[dependee]?
          cb2 null
        else
          willHaveBeenParsed[dependee] = true
          _handlePathAndItsPrereqs dependee, codepath, deps, parseds, willHaveBeenParsed, cb2
    async.forEach imports, f, cb


bodystitch = ({codepath, main}, cb) ->
  findSourceFile codepath:codepath, query:main, (e, mainPath) ->
    return cb e if e
    deps = new DepGraph
    parseds = {}
    willHaveBeenParsed = {}
    _handlePathAndItsPrereqs mainPath, codepath, deps, parseds, willHaveBeenParsed, (e) ->
      return cb e if e
      
      deps_chain = deps.getChain mainPath
      deps_map = deps.map
      
      # TODO more validation (name DNE, collisions, ...)
      
      arr = []
      for path in deps_chain
        arr.push "### #{path} ####\n\n"
        arr.push parseds[path].body
        arr.push '\n\n'
      coffee = arr.join ''
      
      cb null, {
        coffee: coffee
        deps_map: deps_map
        deps_chain: deps_chain
      }


module.exports =
  bodystitch: bodystitch
