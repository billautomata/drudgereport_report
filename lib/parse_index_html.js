var find_links = require('./find_links.js')
var find_fontsize = require('./find_fontsize.js')
var assert = require('assert')

module.exports = function parse_index_html(html) {

  html = html.toString().split('\r\n')
  html = html.filter(function (a) {
    return a.length !== 0
  })

  // find top left
  var top_left_index_begin = -1
  var top_left_index_end = -1
  html.forEach(function (line, line_idx) {
    if (line.includes('TOP LEFT STARTS HERE')) {
      top_left_index_begin = line_idx
    }
    if (line.includes('app_mainheadline')) {
      top_left_index_end = line_idx
    }
  })

  assert(top_left_index_begin !== -1, 'checking parse indexes')
  assert(top_left_index_end !== -1, 'checking parse indexes')

  var top_left_links = find_links(html.slice(top_left_index_begin, top_left_index_end))
  top_left_links.forEach(function(d,i){d.section = 'topleft'; d.index = i})

  // find headline
  var headline_begin = top_left_index_end
  var headline_end = -1
  html.forEach(function (line, line_idx) {
    if (line.includes('<!-- Main headlines links END --->')) {
      headline_end = line_idx
    }
  })

  assert(headline_begin !== -1, 'checking parse indexes')
  assert(headline_end !== -1, 'checking parse indexes')

  var headline_links = find_links(html.slice(headline_begin, headline_end))
  headline_links.forEach(function(d,i){d.section = 'headline'; d.index = i})

  // left column
  var left_column_index_begin = -1
  var left_column_index_end = -1

  html.forEach(function (line, line_idx) {
    if (line.includes('FIRST COLUMN STARTS HERE')) {
      left_column_index_begin = line_idx
    }
    if (line.includes('L I N K S    F I R S T    C O L U M N')) {
      left_column_index_end = line_idx
    }
  })

  assert(left_column_index_begin !== -1, 'checking parse indexes')
  assert(left_column_index_end !== -1, 'checking parse indexes')

  var first_column_links = find_links(html.slice(left_column_index_begin, left_column_index_end))
  first_column_links.forEach(function(d,i){d.section = 'first'; d.index = i})

  // second column
  var second_column_index_begin = -1
  var second_column_index_end = -1

  html.forEach(function (line, line_idx) {
    if (line.includes('SECOND COLUMN BEGINS HERE')) {
      second_column_index_begin = line_idx
    }
    if (line.includes('L I N K S      S E C O N D     C O L U M N')) {
      second_column_index_end = line_idx
    }
  })

  assert(second_column_index_begin !== -1, 'checking parse indexes')
  assert(second_column_index_end !== -1, 'checking parse indexes')

  var second_column_links = find_links(html.slice(second_column_index_begin, second_column_index_end))
  second_column_links.forEach(function(d,i){d.section = 'second'; d.index = i})

  var third_column_index_begin = -1
  var third_column_index_end = -1

  html.forEach(function (line, line_idx) {
    if (line.includes('THIRD COLUMN STARTS HERE')) {
      third_column_index_begin = line_idx
    }
    if (line.includes('L I N K S    A N D   S E A R C H E S     3 R D    C O L U M N')) {
      third_column_index_end = line_idx
    }
  })

  assert(third_column_index_begin !== -1, 'checking parse indexes')
  assert(third_column_index_end !== -1, 'checking parse indexes')

  var third_column_links = find_links(html.slice(third_column_index_begin, third_column_index_end))
  third_column_links.forEach(function(d,i){d.section = 'third'; d.index = i})

  var links = []
  links = links.concat(top_left_links, headline_links, first_column_links, second_column_links, third_column_links)
  return links
}
