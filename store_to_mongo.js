var fs = require('fs')
var moment = require('moment')

var mongojs = require('mongojs')

// initialize database
var db = mongojs('drudge', ['links'])
db.on('error', function (err) {
  console.log('database error', err)
})
db.on('connect', function () {
  console.log('database connected')
})

// read directories to parse
var dirs = fs.readdirSync('./output/').filter(function(o){return o.includes('2016-')})
dirs.sort()

var link_count = 0
var links_found = 0

dirs.forEach(function(dir){
  // convert time to UTC
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


  var links = parse_date(dir)

  links.forEach(function(link){
    link_count += 1
    link.capture_time = time.valueOf()

    db.links.find({
      capture_time: link.capture_time,
      href: link.href
    }, function(err,data){
      if(err){
        console.log('err', err)
      } else {
        if(data.length === 0){
          console.log('saving', link.capture_time, link.href)
          db.links.save(link)
        } else {
          links_found += 1
          console.log(links_found, link_count)
        }
      }
    })
  })
})

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