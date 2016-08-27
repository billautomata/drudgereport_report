module.exports = function hosts_bar_chart (docs, term) {
  console.log('term', term)
  var parse_hosts = require('../data_tools/parse_hosts.js')
  var hosts = parse_hosts(docs.filter(function (o) { return o.raw_line.toLowerCase().includes(term) }))

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
  if (others_aggregate.value > 0) {
    hosts.push(others_aggregate)
  }

  console.log(hosts[hosts.length - 1], hosts[0])

  var w = 1024
  var box_height = 30
  var h = box_height * hosts.length

  var color = d3.scaleOrdinal(d3.schemeCategory10)

  var parent = d3.select('div#linksvtime')
    .append('div')
    .attr('class', 'container')
    .style('border', '1px solid black')
    .style('margin-bottom', '10px')

  var header = parent.append('div').attr('class', 'col-md-12')

  header.append('h1').html(term)
  header.append('h5').html([hosts.length, 'hosts,', docs.filter(function (o) { return o.raw_line.toLowerCase().includes(term) }).length, 'links'].join(' '))

  var svg = parent.append('svg')
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
        if (idx === hosts.length - 1) {
          return 4
        } else {
          return box_width + 2
        }
      })
      .attr('y', box_height * 0.5)
      .attr('dy', '0.33em')
      .style('font-size', box_height * 0.5)

    // count
    if (Math.floor(100 * host.value / d3.sum(hosts, function (o) {return o.value})) > 1) {
      g.append('text').text(Math.floor(100 * host.value / d3.sum(hosts, function (o) {return o.value})) + '%')
        .attr('x', function () {
          if (idx === hosts.length - 1) {
            return box_width - 4
          } else {
            return 4
          }
        })
        .attr('y', box_height * 0.5)
        .attr('dy', '0.33em')
        .attr('text-anchor', function () {
          if (idx === hosts.length - 1) {
            return 'end'
          } else {
            return 'none'
          }
        })
        .attr('fill', 'white')
        .style('font-size', box_height * 0.4)
    }

    running_x += box_width
  })
}
