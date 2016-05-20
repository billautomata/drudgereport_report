var http = require('http')
var express = require('express')
var mongojs = require('mongojs')
var async = require('async')

var db = mongojs('drudge', ['links', 'classifications'])

db.on('connect', function () {
  console.log('database connected')
})
db.on('error', function (err) {
  console.log('database error', err)
})

// start express server
var port = 60000

var app = express()
app.use(require('body-parser').json())

var server = http.createServer(app).listen(port, function(){
  console.log('listening on', port)
})

// app.get link
app.get('/one_to_classify', function(req,res){
  db.classifications.find({ sentiment: '' }).limit(1)
    .toArray(function(err,docs){
      console.log(docs)
      var doc = {}
      if(docs.length > 0){
        doc = docs[0]
        db.classifications.count({ sentiment: '' }, function(err,result){
          doc.remaining = result
          res.status(200).json(doc)
        })
      } else {
        res.status(200).json({done: true})
      }
    })
})

app.get('/many_to_classify', function(req,res){
  db.classifications.find({ sentiment: '' }).limit(1)
    .toArray(function(err,docs){
      console.log(docs)
      var doc = {}
      if(docs.length > 0){
        doc = docs[0]
        db.links.find({href: doc.href}, function(err, docs){
          var story_groups = []
          docs.forEach(function(doc){
            console.log(doc.story_group)
            if(story_groups.indexOf(doc.story_group) === -1){
              story_groups.push(doc.story_group)
            }
          })
          // get the hrefs for each story group
          var related_link_fns = []
          var related_links = []
          var classifications_to_send_back = []

          story_groups.forEach(function(story_group){
            related_link_fns.push(function(callback){
              db.links.find({ story_group: story_group }, function(err, docs){
                docs.forEach(function(doc){
                  if(related_links.indexOf(doc.href) === -1){
                    related_links.push(doc.href)
                  }
                })
                callback()
              })
            })
          })
          related_link_fns.push(function(callback){
            console.log(related_links)
            var fns_find_classifications = []
            related_links.forEach(function(href){
              console.log('related link', href)
              fns_find_classifications.push(function(cb){
                db.classifications.find({ href: href }, function(err, docs){
                  console.log(docs)
                  docs.forEach(function(doc){
                    console.log(doc.tags.length)
                    if(doc.tags.length === 0){
                      console.log('sending', doc)
                      classifications_to_send_back.push(doc)
                    } else {
                      console.log('not sending', doc)
                    }
                  })
                  cb()
                })
              })
            })
            fns_find_classifications.push(function(cb){
              callback()
              cb()
            })
            async.series(fns_find_classifications)
          })
          related_link_fns.push(function(callback){
            console.log('all end')
            console.log(classifications_to_send_back)
            res.status(200).json(classifications_to_send_back)
            callback()
          })
          async.series(related_link_fns)
        })
      } else {
        res.status(200).json({done: true})
      }
    })
})

// app.post link
app.post('/classify', function(req, res){
  console.log('body', req.body)
  db.classifications.findAndModify({
      query: { _id: mongojs.ObjectId(req.body._id) },
      update: { $set: { tags: req.body.tags, who: req.body.who, where: req.body.where, sentiment: req.body.sentiment } },
  }, function (err, doc, lastErrorObject) {
    res.status(200).json(doc)
  })
})

// stats
app.get('/stats', function(req,res){
  db.classifications.find({
    query: { sentiment: {'$regex': 'e' }}
  }, function(err, docs){
    if(err){
      console.log(err)
    }
    console.log(docs.length)
    res.status(200).json(docs)
  })
})


app.get('/tags', function(req, res){
  var tags = {}
  db.classifications.find({ sentiment: { $regex: 'e' }}, function(err,docs){
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
    res.status(200).json(tags_array)
  })

})

app.use(express.static(__dirname + '/public'))
