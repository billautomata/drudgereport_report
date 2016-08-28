var d3 = window.d3

var filter_for_term = require('./filter_for_term.js')
var linksvtime = require('./linksvtime_linechart.js')
var hosts_bar_chart = require('./host_bar_chart.js')

// data
window.fdocs = require('../local_data/fdocs.json')
console.log(window.fdocs.length)

var master_search = 'trump,hillary,infowars'
go()

function go () {
  d3.select('div#linksvtime').selectAll('*').remove()
  d3.select('div#breakout').selectAll('*').remove()

  var terms = master_search.split(',')
  console.log('terms', terms)

  // header
  var override = false
  if (terms.filter(function (o) { return o.length === 0}).length === 0) {
    // terms = terms.join('|')
    override = true
  }

  console.log(terms, override)

  var more

  var new_h = 256
  if (override) {
    more = linksvtime(filter_for_term(terms.join('|')), d3.select('div#linksvtime'), { h: new_h })
  } else {
    more = linksvtime(window.fdocs, d3.select('div#linksvtime'), { h: new_h })
  }

  // add lines to header
  terms.forEach(function (t, idx) {
    more(t)
  })

  // broken out for each term
  terms.forEach(function (t) {
    hosts_bar_chart(t)
  })
}

d3.select('input#user_input_search').property('value', master_search)

d3.select('input#user_input_search').on('keydown', function () {
  if (d3.event.keyCode === 13) {
    master_search = d3.select(this).property('value')
    go()
  }
})
