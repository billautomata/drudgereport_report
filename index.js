var fs = require('fs')
var find_links = require('./find_links.js')
var find_fontsize = require('./find_fontsize.js')


var date_string = '2016-05-11-0728'
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

// console.log(top_left_index_begin, top_left_index_end)
// console.log(html.slice(top_left_index_begin,top_left_index_end))
console.log('top left')
find_links(html.slice(top_left_index_begin,top_left_index_end))

// find headline
var headline_begin = top_left_index_end
var headline_end = -1
html.forEach(function(line, line_idx){
  if(line.includes('<!-- Main headlines links END --->')){
    headline_end = line_idx
  }
})

console.log('headline')
find_links(html.slice(headline_begin, headline_end))
find_fontsize(html.slice(headline_begin, headline_end))

// left column
var left_column_index_begin = -1
var left_column_index_end = -1

html.forEach(function(line, line_idx){
  if(line.includes('FIRST COLUMN STARTS HERE')){
    left_column_index_begin = line_idx
  }
  if(line.includes('L I N K S    F I R S T    C O L U M N')){
    left_column_index_end = line_idx
  }
})

console.log('left column links')
find_links(html.slice(left_column_index_begin,left_column_index_end))

// second column
var second_column_index_begin = -1
var second_column_index_end = -1

html.forEach(function(line, line_idx){
  if(line.includes('SECOND COLUMN BEGINS HERE')){
    second_column_index_begin = line_idx
  }
  if(line.includes('L I N K S      S E C O N D     C O L U M N')){
    second_column_index_end = line_idx
  }
})

console.log('second column links')
console.log(second_column_index_begin, second_column_index_end)
find_links(html.slice(second_column_index_begin,second_column_index_end))

// third column
// second column
var third_column_index_begin = -1
var third_column_index_end = -1

html.forEach(function(line, line_idx){
  if(line.includes('THIRD COLUMN STARTS HERE')){
    third_column_index_begin = line_idx
  }
  if(line.includes('L I N K S    A N D   S E A R C H E S     3 R D    C O L U M N')){
    third_column_index_end = line_idx
  }
})

console.log('third column links')
console.log(third_column_index_begin, third_column_index_end)
find_links(html.slice(third_column_index_begin,third_column_index_end))
