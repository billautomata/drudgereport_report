var mongojs = require('mongojs')
var db = mongojs('drudge', ['links', 'classifications', 'nets'])
db.on('connect', function () {
  console.log('database connected')
})
db.on('error', function (err) {
  console.log('database error', err)
})
db.links.find({}, function(err, docs){
  console.log('found ', docs.length, ' docs')
  var reduced = []
  docs.forEach(function(d){

  })
  require('fs').writeFileSync('./local_data/docs.json', JSON.stringify(docs))
})
