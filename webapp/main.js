var Moment = require('moment')
var d3 = window.d3

console.log('suuuup')

window.fdocs = require('../local_data/fdocs.json')
console.log(fdocs.length)

var linksvtime = require('./linksvtime.js')
// var more = linksvtime(fdocs)
// more('trump', 'rgba(255,0,0,0.3)')
// more('', 'rgba(0,0,0,1)')
// more('email', 'rgba(255,0,0,1)')
// more('trump', 'rgba(0,255,0,1)')
// more('hillary', 'rgba(255,0,255,0.3)')

hosts_bar_chart(fdocs, '')
hosts_bar_chart(fdocs, 'trump')
hosts_bar_chart(fdocs, 'hillary')

function hosts_bar_chart (docs, term) {
  console.log('term', term)
  var parse_hosts = require('../data_tools/parse_hosts.js')
  var hosts = parse_hosts(docs.filter(function (o) { return o.raw_line.includes(term) }))

  var average = d3.sum(hosts, function (o) {return o.value}) / hosts.length

  // average *= 2
  var limit = 20
  other_hosts = hosts.filter(function (o, idx) { return idx >= limit })
  hosts = hosts.filter(function (o, idx) { return idx < limit })
  var others_aggregate = {
    key: 'others',
    value: 0
  }
  other_hosts.forEach(function (o) {
    others_aggregate.value += o.value
  })
  console.log(others_aggregate)
  hosts.push(others_aggregate)

  console.log(hosts[hosts.length - 1], hosts[0])

  var w = 1024
  var box_height = 10
  var h = box_height * hosts.length

  var color = d3.scaleOrdinal(d3.schemeCategory10)

  var svg = d3.select('div#linksvtime').append('svg')
    .attr('width', '100%')
    .attr('viewBox', [0, 0, w, h].join(' '))
    .attr('preserveApsectRatio', 'xMidYMid')
    .style('outline', '1px solid rgb(244,244,244)')

  var k = d3.sum(hosts, function (o) {return o.value})
  var scale_x_count = d3.scaleLinear().domain([0, k]).range([0, w])

  var running_x = 0
  hosts.forEach(function (host, idx) {
    var box_width = scale_x_count(host.value)
    var g = svg.append('g').attr('transform', ['translate(', running_x, ' ', (box_height * idx), ')'].join(''))
    g.append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', box_width)
      .attr('height', box_height)
      .attr('fill', color(idx))
    g.append('text').text(host.key)
      .attr('x', function () {
        if (host.key === 'others') {
          return 4
        } else {
          return box_width + 2
        }
      })
      .attr('y', box_height * 0.5)
      .attr('dy', '0.33em')
      // .attr('text-anchor', function () {
      //   if (host.key === 'others') {
      //     return 'end'
      //   } else {
      //     return 'none'
      //   }
      // })
      .style('font-size', box_height * 0.5)

    // count
    g.append('text').text(Math.floor(100 * host.value / d3.sum(hosts, function (o) {return o.value})) + '%')
      .attr('x', function () {
        if (host.key === 'others') {
          return box_width - 4
        } else {
          return 2
        }
      })
      .attr('y', box_height * 0.5)
      .attr('dy', '0.33em')
      .attr('text-anchor', function () {
        if (host.key === 'others') {
          return 'end'
        } else {
          return 'none'
        }
      })
      .style('font-size', box_height * 0.5)

    running_x += box_width
  })

}
