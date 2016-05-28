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

if (cluster.isMaster) {
  for (var i = 0; i < 12; i++) {
    cluster.fork()
  }
  cluster.on('exit', function (worker, code, signal) {
    console.log(`worker ${worker.process.pid} died`)
  })


  db.classifications.find({
    sentiment: {
      $regex: 'e'
    }
  }, function (err, docs) {
      var tags = {}

      docs.forEach(function (doc) {
        doc.who.forEach(add_tags)
        doc.where.forEach(add_tags)
        doc.tags.forEach(add_tags)

        function add_tags(tag) {
          if (tags[tag] === undefined) {
            tags[tag] = 0
          }
          tags[tag] += 1
        }
      })
      var tags_array = []
      Object.keys(tags).forEach(function (tag) {
        var count = tags[tag]
        tags_array.push({
          name: tag,
          v: count
        })
      })
      tags_array.sort(function (a, b) {
        return b.v - a.v
      })
      console.log('pre filter length', tags_array.length)
      tags_array = tags_array.filter(function(o){ return o.v > 10 })
      console.log('post filter length', tags_array.length)

      var tags_to_process = []
      var fns_verify_tags = []
      tags_array.forEach(function(tag){
        fns_verify_tags.push(function(cb){
          db.nets.find({
            tag: tag.name
          }, function(err, docs){
            if(docs.length === 0){
              // not found
              tags_to_process.push(tag)
            }
            cb()
          })
        })
      })
      fns_verify_tags.push(function(cb){

        // last function
        console.log('processing tags...')
        console.log(tags_to_process.join(' '))
        var which_tag_to_send = 0

        function send_tag(worker_id){
          if(which_tag_to_send < tags_array.length){
            console.log('sending tag', tags_array[which_tag_to_send])
            cluster.workers[worker_id].send({
              docs: docs,
              tag: tags_array[which_tag_to_send].name
            })
            which_tag_to_send += 1
          }
        }

        Object.keys(cluster.workers).forEach(function(id){
          console.log('sending init job to worker', id)
          send_tag(id)
        })

        cluster.on('message', function(msg){
          // msg = JSON.parse(msg)
          console.log('cluster master got message from', msg.id, msg.type)
          if(msg.type === 'gimme'){

          } else if(msg.type === 'done'){
            console.log('got done message')
            db.nets.save({
              tag: msg.tag_name,
              classifier: msg.classifier,
              score: msg.score
            }, function (err, doc) {
              if (err) {
                console.log('error saving', doc.tag, err)
              }
              console.log('\t\t\t\t\t\t\tdone saving', doc.tag, doc.score)
              send_tag(msg.id)
            })
          }
        })

        cb()
      })
      async.series(fns_verify_tags)

  })


} else {
  console.log('worker online')
  process.send({ type: 'gimme', id: cluster.worker.id })

  process.on('message', function(msg){
    // msg = JSON.parse(msg)
    console.log('worker got message', msg.tag)
    var docs = msg.docs
    var t = msg.tag
    var c = create_binary_classifier(docs, t)
    var score = test_binary_classifier(docs, t, c)
    process.send({ type: 'done', id: cluster.worker.id, classifier: JSON.stringify(c), tag_name: t, score: score })
  })
}

function create_binary_classifier (docs, tag) {
  console.log('creating', tag)
  // var classifier = new natural.BayesClassifier()
  var classifier = new natural.LogisticRegressionClassifier()
  // classifier.events.on('trainedWithDocument', function (obj) {})
  docs.forEach(function (doc) {
    var t = doc.tags.concat(doc.who.concat(doc.where))
    var tag_applies = false
    if (t.indexOf(tag) !== -1) {
      tag_applies = true
    }
    classifier.addDocument(doc.text + doc.href, String(tag_applies))
  })
  console.log('done creating... now training', tag)
  classifier.train()
  console.log('done training', tag)
  return classifier
}

function test_binary_classifier (docs, tag, classifier) {
  console.log('testing', tag)
  var correct_hits = 0
  docs.forEach(function (doc) {
    var t = doc.tags.concat(doc.who.concat(doc.where))
    var found = t.indexOf(tag) !== -1
    if (classifier.classify(doc.text + doc.href) === String(found)) {
      correct_hits = correct_hits + 1
    }
  })
  console.log(correct_hits, docs.length, (correct_hits / docs.length).toFixed(4))
  return Number(correct_hits / docs.length)
}
