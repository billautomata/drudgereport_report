var fs = require('fs')

module.exports = function(docs, filename){

  var data = []
  docs.forEach(function(d){
    data.push({
      href: d.href,
      capture_time: d.capture_time,
      text: d.text,
      raw_line: d.raw_line
    })
  })

  fs.writeFileSync('./local_data/'+filename, JSON.stringify(data))
  console.log('done writing '+filename)
}
