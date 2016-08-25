var http = require('http')
var express = require('express')
var mongojs = require('mongojs')
var async = require('async')
var natural = require('natural')
var cluster = require('cluster')

var db = mongojs('drudge', ['links', 'classifications', 'nets'])

db.on('connect', function () {
  console.log('database connected')
})
db.on('error', function (err) {
  console.log('database error', err)
})

if(cluster.isMaster){
  for(var i = 0; i < 12; i++){
    cluster.fork()
  }
  cluster.on('exit', function (worker, code, signal) {
    console.log(`worker ${worker.process.pid} died`)
  })

  // build a list of docs to send to workers
  var docs_to_send = []
  var current_doc_to_send = 0
  db.classifications.find({}, function(err, docs){
    console.log(docs.length)
    docs_to_send = docs
    docs.forEach(function(c){
      if(c.machine_tags === undefined){
        docs_to_send.push(c)
      }
    })
  })

  function send_doc(worker_id){
    if(current_doc_to_send < docs_to_send.length){
      cluster.workers[worker_id].send({
        type: 'work',
        doc: docs_to_send[current_doc_to_send]
      })
      current_doc_to_send += 1
    } else {
      console.log('done!')
    }
  }

  Object.keys(cluster.workers).forEach(function(id){
    console.log('sending init job to worker', id)
    send_doc(id)
  })

  cluster.on('message', function(msg){
    // console.log('got message', msg)
    if(msg.type === 'work' && msg.id !== undefined){
      send_doc(msg.id)
    }
  })

} else {

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
    // console.log(nets.length)
    process.send({ type: 'work', id: cluster.worker.id })
  })

  process.on('message', function(msg){
    if(msg.type === 'work'){
      // console.log('no machine tags found')
      var machine_tags = []
      var c = msg.doc
      nets.forEach(function(net){
        if(net.classifier.classify(c.link+c.href) === 'true'){
          machine_tags.push(net.name)
        }
      })
      console.log(c.text, machine_tags.join(' '))
      process.send({ type: 'work', id: cluster.worker.id })
    }
  })

}


//
