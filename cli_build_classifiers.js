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

  var fns = []
  var classifiction_fns = []

  var tags_to_classify = []
  tags_array.forEach(function(tag){
    // console.log(tag.name,tag.v)
    if(tag.v >= 10){
      fns.push(function(cb){db.nets.find({
        tag: tag.name
      }, function(err, docs){
        if(docs.length === 0){
          console.log(tag.name,'not found in nets.')
          tags_to_classify.push(tag.name)
        } else {
          console.log(tag.name,'found in nets.')
        }
        cb()
      })})
    }
    // if(tag.v >= 10){
    //   first_fns.push(function(_first_callback){
    //     db.nets.find({
    //       tag: tag.name
    //     }).toArray(function(err,_docs){
    //       console.log(_docs.length)
    //       if(_docs.length === 0){
    //         fns_to_run.push(function(cb){
    //           console.log('training', tag.name)
    //           var c = create_binary_classifier(docs, tag.name)
    //           var score = test_binary_classifier(docs, tag.name, c)
    //           db.nets.save({
    //             tag: tag.name,
    //             classifier: JSON.stringify(c),
    //             score: score
    //           }, function(err, doc){
    //             if(err){
    //               console.log('error', err)
    //             }
    //             console.log('\t\t\t\t\t\t\tdone saving', doc.tag, doc.score)
    //             return cb()
    //           })
    //         })
    //       } else {
    //         console.log('already found', tag, 'skipping')
    //       }
    //       return _first_callback()
    //     })
    //   })
    //   first_fns.push(function(_cb){
    //     async.series(fns_to_run)
    //     _cb()
    //   })
    // }
  })
  fns.push(function(cb){
    console.log(tags_to_classify)
    tags_to_classify.forEach(function(t){
      classifiction_fns.push(function(_cb){
        var c = create_binary_classifier(docs, t)
        var score = test_binary_classifier(docs, t, c)
        db.nets.save({
          tag: t,
          classifier: JSON.stringify(c),
          score: score
        }, function(err, doc){
          if(err){
            console.log('error saving', doc.tag, err)
          }
          console.log('\t\t\t\t\t\t\tdone saving', doc.tag, doc.score)
          return _cb()
        })
      })
    })
    cb()
  })
  fns.push(function(cb){
    async.series(classifiction_fns)
    cb()
  })
  async.series(fns)
})



function create_binary_classifier(docs, tag){
  console.log('creating', tag)
  // var classifier = new natural.BayesClassifier()
  var classifier = new natural.LogisticRegressionClassifier()
  classifier.events.on('trainedWithDocument', function (obj) {
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
