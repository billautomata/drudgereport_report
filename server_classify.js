var http = require('http')
var express = require('express')
var mongojs = require('mongojs')

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

app.post('/classify', function(req, res){
  console.log('body', req.body)


  db.classifications.findAndModify({
      query: { _id: mongojs.ObjectId(req.body._id) },
      update: { $set: { tags: req.body.tags, who: req.body.who, where: req.body.where, sentiment: req.body.sentiment } },
  }, function (err, doc, lastErrorObject) {
    res.status(200).json(doc)
  })
})


// app.post link

app.use(express.static(__dirname + '/public'))
