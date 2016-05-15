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
      res.status(200).json(docs)
    })
})


// app.post link

app.use(express.static(__dirname + '/public'))
