var Moment = require('moment')
var d3 = window.d3

console.log('suuuup')

window.fdocs = require('../local_data/fdocs.json')
console.log(fdocs.length)

// var linksvtime = require('./linksvtime.js')
// var more = linksvtime(fdocs)
// more('trump', 'rgba(255,0,0,0.3)')
// more('', 'rgba(0,0,0,1)')
// more('email', 'rgba(255,0,0,1)')
// more('trump', 'rgba(0,255,0,1)')
// more('hillary', 'rgba(255,0,255,0.3)')

var hosts_bar_chart = require('./host_bar_chart.js')

// hosts_bar_chart(fdocs, '')
// hosts_bar_chart(fdocs, 'trump')
hosts_bar_chart(fdocs, 'hillary')
hosts_bar_chart(fdocs, 'breitbart')
hosts_bar_chart(fdocs, 'box office')
hosts_bar_chart(fdocs, 'tsa')
// hosts_bar_chart(fdocs, 'box office')
// hosts_bar_chart(fdocs, 'hillary|box office')
// hosts_bar_chart(fdocs, 'judicialwatch')
// hosts_bar_chart(fdocs, 'streisand')
// hosts_bar_chart(fdocs, 'box office')
// hosts_bar_chart(fdocs, 'poll')
// hosts_bar_chart(fdocs, 'shock poll')
