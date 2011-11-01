
fs = require 'fs'
assert = require 'assert'
{parseImportsExports, findSourceFile, bodystitch} = require '../src/coffeesurgeon'

ae = (x, y) ->
  assert.equal JSON.stringify(x), JSON.stringify(y)

aeDict = (x, y) ->
  for k of x
    ae x[k], y[k]
  for k of y
    ae x[k], y[k]

readTextSync = (path) ->
  fs.readFileSync(path).toString 'utf-8'

MISC = readTextSync "#{__dirname}/files/misc.coffee"
MAIN = readTextSync "#{__dirname}/files/main.coffee"

#### parseImportsExports

x = parseImportsExports MISC
aeDict x, {
  exported_names: ['f', 'g']
  imports: []
  body: '\n\nf = () ->\n\ng = () ->\n\n\n\n'
}

x = parseImportsExports MAIN
aeDict x, {
  exported_names: []
  imports: [
    [["foo","bar"], "spam"]
    [["f", "g"], "./misc"]
    [["NinjaCheckbox"], "./widgets/NinjaCheckbox"]
  ]
  body: 'console.log 2\nconsole.log 3\n\n'
}

#### findSourceFile

# so we can test that findSourceFile handles relative paths
assert.equal fs.realpathSync(__dirname), fs.realpathSync(".")

f = (query, expectedPath, cb) ->
  findSourceFile {
    query: query
    fromDir: "./files"
    codepath: [
      "./files"
      "./files/some-other-dir"
    ]
  }, (e, path) ->
      throw e if e
      assert.equal path, expectedPath
      cb()

FILES = fs.realpathSync "#{__dirname}/files"

f './misc', "#{FILES}/misc.coffee", () ->
  f './../files/misc', "#{FILES}/misc.coffee", () ->
    f './widgets/NinjaCheckbox', "#{FILES}/widgets/NinjaCheckbox.coffee", () ->
      f 'spam', "#{FILES}/some-other-dir/spam.coffee", () ->
        
        #### bodystitch
        bodystitch {
          main: 'main'
          codepath: [
            "./files"
            "./files/some-other-dir"
          ]
        }, (e, {coffee}) ->
          throw e if e
          console.log 'OK'

