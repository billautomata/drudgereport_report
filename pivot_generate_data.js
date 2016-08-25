// var http = require('http')
// var express = require('express')
// var mongojs = require('mongojs')
// var async = require('async')
// var natural = require('natural')
var moment = require('moment')

// var db = mongojs('drudge', ['links', 'classifications', 'nets'])
// db.on('connect', function () {
//   console.log('database connected')
// })
// db.on('error', function (err) {
//   console.log('database error', err)
// })
// db.links.find({}, function(err, docs){
//   console.log('found ', docs.length, ' docs')
//   require('fs').writeFileSync('./local_data/docs.json', JSON.stringify(docs))
// })

var documents = JSON.parse(require('fs').readFileSync('./local_data/docs.json'))
console.log(documents.length)

console.log(documents[documents.length-1])

documents = documents.sort(function(a,b){
  return a.capture_time - b.capture_time
})

var known = {}
var fdocs = documents.filter(function(a){
  var k
  if(known[a.href] === undefined){
    known[a.href] = 1
    k = true
  } else {
    k = false
  }
  return k
})

console.log(fdocs.length)

var parse_hosts = require('./data_tools/parse_hosts.js')
// require('./data_tools/link_date_stats.js')(fdocs)
// require('./data_tools/link_age.js')(documents)
// require('./data_tools/dvr.js')(documents)
// require('./data_tools/image_search.js')(documents)
