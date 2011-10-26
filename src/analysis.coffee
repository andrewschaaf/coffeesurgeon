
fs = require 'fs'
assert = require 'assert'
cs = require 'coffee-script'
_ = require 'underscore'


parseImportsExports = (coffee) ->
  {exported_names, remaining_coffee} = _extractExports coffee
  {imports, remaining_coffee} = _extractImports remaining_coffee
  {
    exported_names: exported_names
    imports: imports
    body: remaining_coffee
  }


_extractExports = (coffee) ->
  i = coffee.indexOf 'module.exports'
  if i == -1
    {
      remaining_coffee: coffee
      exported_names: []
    }
  else
    remaining_coffee = coffee.substr 0, i
    exports_coffee = coffee.substr i
    {expressions} = cs.nodes exports_coffee
    [assignment] = expressions
    {value} = assignment
    x = value
    keys = (y.variable.base.value for y in x.base.properties)
    values = (y.value.base.value for y in x.base.properties)
    assert.equal JSON.stringify(keys), JSON.stringify(values)
    {
      remaining_coffee: remaining_coffee
      exported_names: keys
    }


_extractImports = (coffee) ->
  {expressions} = cs.nodes coffee
  imports = []
  for x in expressions
    break if x.value?.variable?.base?.value != 'require'
    names = (y.base.value for y in x.variable.base.properties)
    mod = x.value.args[0].base.value
    imports.push [names, mod]
  
  if imports.length == 0
    return {import:[], remaining_coffee:coffee}
  
  # TODO do this properly when line numbers arrive in coffee-script
  [names, mod] = _.last(imports)
  m = coffee.match ".*=.*require.*#{mod}.*\n"
  i = m.index + m[0].length + 1
  remaining_coffee = coffee.substr i
  
  {
    imports: imports
    remaining_coffee: remaining_coffee
  }


if not module.parent
  coffee = fs.readFileSync("../test/example/main.coffee").toString()
  info = parseImportsExports coffee
  console.log JSON.stringify(info)


module.exports =
  parseImportsExports: parseImportsExports
