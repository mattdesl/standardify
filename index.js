var through = require('through2')
var standard = require('standard')
var path = require('path')
var cssFile = path.join(__dirname, 'style.css')
var stylesheet = require('fs').readFileSync(cssFile, 'utf8')

function template (data, stylesheet, opt) {
  if (typeof document === 'undefined') return
  print()
  if (opt.dom !== false) {
    if (!document.body) {
      document.addEventListener('DOMContentLoaded', print)
    } else {
      insertCSS(stylesheet)
      render()
    }
  }
  function insertCSS (css) {
    var elem = document.createElement('style')
    elem.setAttribute('type', 'text/css')

    if ('textContent' in elem) {
      elem.textContent = css
    } else {
      elem.styleSheet.cssText = css
    }

    var head = document.getElementsByTagName('head')[0]
    head.appendChild(elem)
  }
  function print () {
    console.log('Use JavaScript Standard Style (https://github.com/feross/standard)')
    data.results.forEach(function (result) {
      var messages = result.messages
      if (messages.length === 0) {
        return
      }
      messages.forEach(function (message) {
        var line = message.line || 0
        var column = message.column || 0
        var msg = message.message.replace(/\.$/, '')
        console.log('  ' + result.filePath + ':' + line + ':' + column + ':', msg)
      })
    })
  }
  function render () {
    var total
    var container = document.createElement('div')
    container.className = '__standardify-container'
    var intro = document.createElement('div')
    intro.className = '__standardify-intro'
    intro.textContent = 'Use JavaScript Standard Style '

    var linkStr = 'https://github.com/feross/standard'
    var link = document.createElement('a')
    link.textContent = '(' + linkStr + ')'
    link.className = '__standardify-link'
    link.setAttribute('href', linkStr)
    intro.appendChild(link)
    container.appendChild(intro)
    insert(container)

    data.results.forEach(function (result) {
      var messages = result.messages
      if (messages.length === 0) {
        return
      }

      total += messages.length
      var file = document.createElement('div')
      file.className = '__standardify-file'
      file.textContent = result.filePath
      messages.map(function (message) {
        var line = message.line || 0
        var column = message.column || 0
        var msg = message.message.replace(/\.$/, '')
        var id = message.ruleId || ''
        var spans = [
          [ 'location', line + ':' + column ],
          [ 'type', 'error' ],
          [ 'message', msg ],
          [ 'rule', id ]
        ]
        var block = document.createElement('div')
        block.className = '__standardify-message'
        file.appendChild(block)
        spans.forEach(appendSpans(block))
      })

      container.appendChild(file)
    })
  }
  function appendSpans (parent) {
    return function (info) {
      var name = info[0]
      var text = info[1]
      var span = document.createElement('span')
      span.className = '__standardify-' + name
      span.textContent = text
      parent.appendChild(span)
    }
  }
  function insert (elem) {
    if (document.body.firstChild) {
      document.body.insertBefore(elem, document.body.firstChild)
    } else {
      document.body.appendChild(elem)
    }
  }
}

function replace (result, opt) {
  return '!' + template + '(' + JSON.stringify(result) + ', ' +
    JSON.stringify(stylesheet) + ', ' +
    JSON.stringify(opt) + ')'
}

module.exports = standardify
function standardify (b, opt) {
  opt = opt || {}
  var bundle = b.bundle.bind(b)
  b.bundle = function (cb) {
    var output = through()
    standard.lintFiles([], {
      cwd: b.argv.basedir || process.cwd()
    }, function (err, data) {
      if (err) {
        return output.emit('error', err)
      }

      var pipeline = bundle(cb)
      if (data.errorCount > 0) {
        output.push(replace(data, opt))
        output.push(null)
        pipeline.unpipe(output)
      } else {
        pipeline.pipe(output)
      }
    })
    return output
  }
}
