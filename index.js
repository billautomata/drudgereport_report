var fs = require('fs')
var moment = require('moment')

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
// var dirs = fs.readdirSync('./output/').filter(function(o){return o.includes('UTC')})
dirs.sort()
dirs.forEach(function(dir){

  // convert time to UTC
  console.log('--')
  var dir_string = dir.split('-')
  // console.log(dir_string)
  var date = dir_string.slice(0,3).join('-')
  date += ' ' + dir_string[3].substring(0,2) + ':' + dir_string[3].substring(2,4)
  date += ':00.000'

  var time
  if(dir.includes('UTC')){
  } else {
    date+= '-04:00'
  }
  time = moment.utc(date)
  console.log([dir,date,time.toString(), time.valueOf()].join('\t\t'))

  var links = parse_date(dir)

  links.forEach(function(link){
    if(link.section==='headline'){
      console.log(link.text)
    }
  })
})
