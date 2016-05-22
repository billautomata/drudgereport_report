var http = require('http')
var express = require('express')
var mongojs = require('mongojs')
var async = require('async')
var natural = require('natural')

var db = mongojs('drudge', ['links', 'classifications', 'classifiers'])

db.on('connect', function () {
  console.log('database connected')
})
db.on('error', function (err) {
  console.log('database error', err)
})

// db.links.find({}).toArray(function(err,docs){
//   console.log(docs.length)
//   docs = docs.sort(function(a,b){
//     return b.capture_time > a.capture_time
//   })
//   console.log(docs[0])
//   console.log(docs[docs.length-1])
//   var hrs = docs[0].capture_time - docs[docs.length-1].capture_time
//   hrs = hrs / 1000  // seconds
//   hrs = hrs / 60    // minutes
//   hrs = hrs / 60    // hours
//   console.log(hrs.toFixed(0), 'hrs')
//
//   var unique_hrefs = {}
//   docs.forEach(function(doc){
//     if(unique_hrefs[doc.href] === undefined){
//       unique_hrefs[doc.href] = []
//     }
//     unique_hrefs[doc.href].push(doc.index)
//   })
//   Object.keys(unique_hrefs).forEach(function(href){
//     console.log(unique_hrefs[href].join(' '))
//   })
//   // console.log(unique_hrefs[docs[80].href])
// })

function create_binary_classifier(docs, tag){
  console.log('creating', tag)
  var classifier = new natural.LogisticRegressionClassifier()
  classifier.events.on('trainedWithDocument', function (obj) {
  //  console.log(obj)
   /* {
   *   total: 23 // There are 23 total documents being trained against
   *   index: 12 // The index/number of the document that's just been trained against
   *   doc: {...} // The document that has just been indexed
   *  }
   */
  })
  docs.forEach(function(doc){
    var t = doc.tags.concat(doc.who.concat(doc.where))
    var tag_applies = false
    if(t.indexOf(tag) !== -1){
      tag_applies = true
    }
    classifier.addDocument(doc.text + doc.href, String(tag_applies))
  })
  classifier.train()
  return classifier
}
function test_binary_classifier(docs, tag, classifier){
  console.log('testing', tag)
  var correct_hits = 0
  docs.forEach(function(doc){
    var t = doc.tags.concat(doc.who.concat(doc.where))
    var found = t.indexOf(tag) !== -1
    if(classifier.classify(doc.text + doc.href) === String(found)){
      correct_hits = correct_hits + 1
    }
  })
  console.log(correct_hits, docs.length, (correct_hits/docs.length).toFixed(4))
  return Number(correct_hits/docs.length)
}


db.classifications.find({ sentiment: { $regex: 'e' }}, function(err,docs){
  var tags = {}

  docs.forEach(function(doc){
    doc.who.forEach(add_tags)
    doc.where.forEach(add_tags)
    doc.tags.forEach(add_tags)
    function add_tags(tag){
      if(tags[tag] === undefined){
        tags[tag] = 0
      }
      tags[tag] += 1
    }
  })
  var tags_array = []
  Object.keys(tags).forEach(function(tag){
    var count = tags[tag]
    tags_array.push({name: tag, v: count})
  })
  tags_array.sort(function(a,b){ return b.v - a.v })
  console.log(tags_array)
  tags_array.forEach(function(tag){
    console.log(tag.name,tag.v)
    if(tag.v >= 10){
      var c = create_binary_classifier(docs, tag.name)
      var score = test_binary_classifier(docs, tag.name, c)
      db.classifiers.save({
        tag: tag,
        classifier: JSON.stringify(c),
        score: score
      }, function(err, doc){
        console.log('done saving', doc.tag)
      })
    }
  })
})


// // sentiment
// db.classifications.find({sentiment:{$regex: 'e'}}).toArray(function(err,docs){
//   console.log(docs.length)
//   // var classifier = new natural.BayesClassifier()
//   var classifier = new natural.LogisticRegressionClassifier()
//   docs.forEach(function(doc){
//     console.log([doc.sentiment,doc.text].join('\t'))
//     if(doc.sentiment === 'negative' || doc.sentiment === 'positive'){
//       classifier.addDocument(doc.text, doc.sentiment)
//     }
//   })
//   console.log('training classifier')
//   classifier.train()
//   console.log('done.')
//   var hits = 0
//   var counts = 0
//   docs.forEach(function(doc){
//     if(doc.sentiment === 'neutral'){
//       return
//     }
//     counts += 1
//     if(classifier.classify(doc.text) === doc.sentiment){
//       hits += 1
//     } else {
//       console.log(classifier.classify(doc.text),doc.sentiment)
//     }
//   })
//   console.log(hits,counts,((hits/counts)*100).toFixed(2)+'% accuracy')
// })


// us or world news
// db.classifications.find({sentiment:{$regex: 'e'}}).toArray(function(err,docs){
//   console.log(docs.length)
//   var classifier = new natural.LogisticRegressionClassifier()
//   docs.forEach(function(doc){
//     var text = doc.text
//     if(doc.tags.indexOf('world news') !== -1){
//       doc.type = 'world'
//       classifier.addDocument(text, 'world')
//     } else if(doc.tags.indexOf('us news') !== -1){
//       doc.type = 'us'
//       classifier.addDocument(text, 'us')
//     } else {
//       console.log(doc)
//     }
//
//   })
//   console.log('training classifier')
//   classifier.train()
//   console.log('done.')
//   var hits = 0
//   var counts = 0
//   docs.forEach(function(doc){
//     if(doc.type === undefined){
//       return
//     }
//     counts += 1
//     if(classifier.classify(doc.text) === doc.type){
//       hits += 1
//     } else {
//       console.log(classifier.classify(doc.text),doc.type)
//     }
//   })
//   console.log(hits,counts,((hits/counts)*100).toFixed(2)+'% accuracy')
// })
