var fs = require('fs')

function parse_date(date_string){
  var html = fs.readFileSync('./' + date_string + '/www.drudgereport.com/index.html')
  var parse_index_html = require('./parse_index_html.js')
  var links = parse_index_html(html)
  links.forEach(function(link){
    link.capture_time = date_string
  })
  console.log(date_string,links.length)
}
var dirs = fs.readdirSync('./').filter(function(o){return o.includes('2016-')})
dirs.forEach(function(dir){
  parse_date(dir)
})
