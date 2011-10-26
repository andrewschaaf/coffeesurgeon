
# Status: needs some work

# Stuff

<pre>
{stitchBodies, findSourceFile, parseImportsExports} = require 'coffeesurgeon'
</pre>


## stitchBodies

* TODO: describe
* Makes **ASSUMPTION 1**

<pre>
{stitchBodies} = require 'coffeesurgeon'

stitchBodies {
  main: 'mymainfile'
  codepath: [
    '...'
    '...'
  ]
}, (e, {coffee}) ->

</pre>


## findSourceFile

<pre>
findSourceFile {query:"widgets/foo", fromDir:"...", codepath:[...]}, (e, path) ->
</pre>


## parseImportsExports

* Makes **ASSUMPTION 1**

<pre>
info = parseImportsExports coffee

# info:
{
  imports: [[["x", "y"], "misc"], ...]
  exported_names: ["foo", "bar"]
  body_coffee: "..."
}
</pre>


## ASSUMPTION 1

**ALL** of your imports and exports are of the form:

<pre>
{x, y} = require 'misc'
{...} = require '...'

...body, wherein foo and bar are defined...

module.exports =
  foo: foo
  bar: bar
</pre>
