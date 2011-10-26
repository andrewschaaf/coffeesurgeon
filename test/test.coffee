
{stitchBodies, parseImportsExports} = require '../src/coffeesurgeon'


stitchBodies {
  main: 'main'
  codepath: [
    "#{__dirname}/example"
  ]
}, (e, {coffee}) ->
  throw e if e
  console.log '-----'
  console.log coffee
  console.log '-----'
