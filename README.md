
# coffeesurgeon

Static {analysis,slicing,dicing} of your .coffee

<pre>
{
  bodystitch,
  parseImportsExports,
  findSourceFile

} = require 'coffeesurgeon'
</pre>


## Def: prop 1

A <code>.coffee</code> satisfies "Property 1" if ALL of its imports and exports are of the form:

<pre>
{x, y} = require 'misc'
{...} = require '...'

...body, wherein foo and bar are defined...

module.exports =
  foo: foo
  bar: bar
</pre>


## bodystitch

Like [stitch](https://github.com/sstephenson/stitch), but

- assumes prop 1
- stitches bodies directly together in a dependency-satisfying ordering, discarding import/export statements
  - *...thereby being hella minification-friendly*
  - *...and letting you expose your stuff (with <code>coffee --bare</code>) to your REPL and unit tests*

<pre>
stitchBodies {
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
<pre>
info = parseImportsExports coffee
# info:
{
  imports: [[["x", "y"], "misc"], ...]
  exported_names: ["foo", "bar"]
  body_coffee: "..."
}
</pre>


## findSourceFile
<pre>
findSourceFile {query:"widgets/foo", fromDir:"...", codepath:[...]}, (e, path) ->
  # not found => path is null
  # FS error  => e is not null
</pre>
