var fs = require('fs')
var find_links = require('./find_links.js')
var find_fontsize = require('./find_fontsize.js')

// find all images
// image collage

// parse index.html
// classify each headline with multiple tags
// sections
  // headline
  //   with image?  width of the image in the html
  // above the headline
  // siren?
  // all caps
  // italics
  // grouping by tags
  // different color
  // what is in scare quotes

var date_string = '2016-05-10-0658'
var html = fs.readFileSync('./' + date_string + '/www.drudgereport.com/index.html')
html = html.toString().split('\r\n')
html = html.filter(function(a){ return a.length !== 0 })
console.log(html)

// find top left
var top_left_index_begin = -1
var top_left_index_end = -1
html.forEach(function(line,line_idx){
  if(line.includes('TOP LEFT STARTS HERE')){
    top_left_index_begin = line_idx
  }
  if(line.includes('app_mainheadline')){
    top_left_index_end = line_idx
  }
})

console.log(top_left_index_begin, top_left_index_end)
console.log(html.slice(top_left_index_begin,top_left_index_end))
find_links(html.slice(top_left_index_begin,top_left_index_end))

// find headline
var headline_begin = top_left_index_end
var headline_end = -1
html.forEach(function(line, line_idx){
  if(line.includes('<!-- Main headlines links END --->')){
    headline_end = line_idx
  }
})

find_links(html.slice(headline_begin, headline_end))
find_fontsize(html.slice(headline_begin, headline_end))
