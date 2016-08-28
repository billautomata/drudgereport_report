var Moment = require('moment')
var d3 = window.d3

var filter_for_term = require('./filter_for_term.js')
var linksvtime = require('./linksvtime_linechart.js')
var hosts_bar_chart = require('./host_bar_chart.js')

// data
window.fdocs = require('../local_data/fdocs.json')
console.log(window.fdocs.length)

var master_search = 'trump,hillary,email,race'

var terms = master_search.split(',')

console.log('terms', terms)

var override = false
if (terms.filter(function (o) { return o.length === 0}).length === 0) {
  // terms = terms.join('|')
  override = true
}

console.log(terms, override)

// var more = linksvtime(fdocs)
// more('trump', 'rgba(255,0,0,0.3)')
// more('', 'rgba(0,0,0,1)')
// more('email', 'rgba(255,0,0,1)')
// more('trump', 'rgba(0,255,0,1)')
// more('hillary', 'rgba(255,0,255,0.3)')

var more

if (override) {
  more = linksvtime(filter_for_term(terms.join('|')), d3.select('div#linksvtime'))
} else {
  more = linksvtime(window.fdocs, d3.select('div#linksvtime'))
}

terms.forEach(function (t, idx) {
  more(t, 'black')
})

terms.forEach(function (t) {
  hosts_bar_chart(t)
})
// more('', 'black')
// more('trump', 'rgba(255,0,0,1)')
// more('poll', 'rgba(255,255,0,1)')
// more('nytimes', 'rgba(255,0,255,1)')

// var more = linksvtime(filter_for_term('hillary|clinton|trump'), d3.select('div#linksvtime'))
// more('trump', 'rgba(255,0,0,1)')
// more('hillary|clinton', 'rgba(0,255,0,1)')

// hosts_bar_chart('')
// hosts_bar_chart('trump')
// hosts_bar_chart('hillary')
// hosts_bar_chart(fdocs, 'breitbart')
// hosts_bar_chart(fdocs, 'box office')
// hosts_bar_chart('tsa')
// hosts_bar_chart('facebook')
// hosts_bar_chart(fdocs, 'box office')
// hosts_bar_chart(fdocs, 'hillary|box office')
// hosts_bar_chart(fdocs, 'judicialwatch')
// hosts_bar_chart(fdocs, 'streisand')
// hosts_bar_chart(fdocs, 'box office')
// hosts_bar_chart(fdocs, 'poll')
// hosts_bar_chart(fdocs, 'shock poll')
