var fs = require('fs')

module.exports = function(docs, filename){

  var delineator = '\t'

  var csv_lines = []
  csv_lines.push([ 'id', 'href', 'text', 'story_group', 'section', 'index', 'capture_time' ].join(delineator))

  docs.forEach(function(d){
    csv_lines.push([
      d._id,
      d.href,
      d.text,
      d.story_group,
      d.section,
      d.index,
      d.capture_time
    ].join(delineator))
  })

  fs.writeFileSync('./local_data/'+filename, csv_lines.join('\n'))
  console.log('done!')
}
