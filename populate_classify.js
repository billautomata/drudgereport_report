console.log('starting populate classify')
var mongojs = require('mongojs')
var async = require('async')

// initialize database
var db = mongojs('drudge', ['links', 'classifications'], { connectionTimeout: 5000 })

db.on('connect', function () {
  console.log('database connected')

})
db.on('error', function (err) {
  console.log('database error', err)
})

var repeats = 0
db.links.find({}, function(err,data){
  if(err){
    console.log('error!')
    console.log(err)
  } else {
    console.log(data.length, 'elements found.')

    var fns = []

    data.forEach(function(doc){
      fns.push(function(callback){
        db.classifications.find({
          href: doc.href
        }, function(err, docs){
          if(docs.length === 0){
            db.classifications.save({
              href: doc.href,
              text: doc.text,
              img: doc.associated_iamge,
              tags: [],
              who: [],
              where: [],
              sentiment: ''
            }, function(err,d){
              callback()
              console.log(repeats)
            })
          } else {
            repeats = repeats + 1
            console.log(repeats)
            callback()
          }
        })
      })
    })
    async.series(fns)
  }
})
