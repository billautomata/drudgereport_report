var http = require('http')
var express = require('express')
var mongojs = require('mongojs')
var async = require('async')
var natural = require('natural')

var db = mongojs('drudge', ['links', 'classifications', 'nets'])

db.on('connect', function () {
  console.log('database connected')
})
db.on('error', function (err) {
  console.log('database error', err)
})

var nets = []
db.nets.find({}, function(err,docs){
  console.log(docs.length)
  console.log(Object.keys(docs[0]))
  docs.forEach(function(doc){
    nets.push({
      name: doc.tag,
      classifier: natural.LogisticRegressionClassifier.restore(JSON.parse(doc.classifier))
    })
  })
  console.log(nets.length)

  var fns = []

  db.classifications.find({}, function(err, docs){
    console.log(docs.length)
    docs.forEach(function(c){
        if(c.machine_tags === undefined){
          // console.log('no machine tags found')
          var machine_tags = []
          nets.forEach(function(net){
            if(net.classifier.classify(c.link+c.href) === 'true'){
              machine_tags.push(net.name)
            }
          })
          console.log(c.text, machine_tags.join(' '))
        }
      })
  })

})
//
