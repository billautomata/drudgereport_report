var assert = require('assert')
module.exports = function parse_hosts(docs){

  // console.log(Object.keys(docs[0]))
  var s

  var hosts = {}

  docs.forEach(function(d,idx){

    // process.stdout.write('\n')
    // process.stdout.write(String(idx))
    // process.stdout.write(' ')

    if(d.href.indexOf('http') === -1 || d.href === 'index.html'){
      d.href = 'http://drudgereport.com/index.html'
    }

    assert.equal(d.href !== undefined, true, 'href field found')
    assert.equal(d.href.indexOf('http') !== -1, true, 'http string found')

    var p = String(d.href)
    assert.equal(d.href.split('/').length > 0, true, 'can split the href field')
    var k = p.split('/')

    // process.stdout.write(String(k.length) + ' ')
    // process.stdout.write(JSON.stringify(k))

    assert.equal(k.length >= 2, true, 'can split the href field in a var ' + d.href)
    assert.equal(k[2] !== undefined, true, 'has a second field')
    // s = String(d.href).split('/')[2]
    // assert.equal(s !== undefined, true, 's is not undefined')
    s = k[2]
    s = s.replace('www.','')
    if(hosts[s] === undefined){
      hosts[s] = 0
    }
    hosts[s] += 1
    // console.log('s', s)
    // console.log('split', String(d.href).split('/').join('\t'))

  })
  // console.log(htoa(hosts).reverse())
  // console.log(hosts)
  return htoa(hosts)
}

function htoa(h){
  var a = []
  Object.keys(h).forEach(function(n){
    a.push({
      key: n,
      value: h[n]
    })
  })
  a = a.sort(function(a,b){ return b.value - a.value })
  return a
}
