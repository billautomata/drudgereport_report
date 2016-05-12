var fs = require('fs')

function parse_date(date_string){
  var html = fs.readFileSync('./output/' + date_string + '/www.drudgereport.com/index.html')
  var parse_index_html = require('./parse_index_html.js')
  var links = parse_index_html(html)
  links.forEach(function(link){
    link.capture_time = date_string
  })
  // console.log(date_string,links.length)
  return links
}
var dirs = fs.readdirSync('./output/').filter(function(o){return o.includes('2016-')})
dirs.sort()
dirs.forEach(function(dir){
  var links = parse_date(dir)
  console.log('--')
  links.forEach(function(link){
    if(link.section==='headline'){
      console.log(link.text)
    }
  })
})
