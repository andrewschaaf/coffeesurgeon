[![build status](https://secure.travis-ci.org/andrewschaaf/coffeesurgeon.png)](http://travis-ci.org/andrewschaaf/coffeesurgeon)

# coffeesurgeon

Static {analysis,slicing,dicing} of your .coffee

    {
      bodystitch,
      parseImportsExports,
      findSourceFile

    } = require 'coffeesurgeon'


## Def: prop 1

A `.coffee` satisfies "Property 1" if ALL of its imports and exports are of the form:

    {x, y} = require 'misc'
    {...} = require '...'

    ...body, wherein foo and bar are defined...

    module.exports = {foo, bar}


## bodystitch

Like [stitch](https://github.com/sstephenson/stitch), but

- assumes prop 1
- stitches bodies directly together in a dependency-satisfying ordering, discarding import/export statements
  - *...thereby being hella minification-friendly*
  - *...and letting you expose your stuff (with `coffee --bare`) to your REPL and unit tests*

<pre>
bodystitch {
  main: 'mymainfile'
  codepath: [
    '...'
    '...'
  ]
}, (e, {coffee, deps_map, deps_chain}) ->
</pre>

#### FAQ

* What about name conflicts?
  - TODO: error when they exist

## parseImportsExports (assumes prop 1)

    info = parseImportsExports coffee
    # info:
    {
      imports: [[["x", "y"], "misc"], ...]
      exported_names: ["foo", "bar"]
      body_coffee: "..."
    }


## findSourceFile

    findSourceFile {query:"widgets/foo", fromDir:"...", codepath:[...]}, (e, path) ->
      # not found => path is null
      # FS error  => e is not null
