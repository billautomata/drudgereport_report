var fs = require('fs')

var date_string = '2016-05-11-0728'
var html = fs.readFileSync('./' + date_string + '/www.drudgereport.com/index.html')

var parse_index_html = require('./parse_index_html.js')
parse_index_html(html)
