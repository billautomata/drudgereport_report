var Moment = require('moment')

module.exports = function hosts_bar_chart (term) {
  console.log('term', term)
  var parse_hosts = require('../data_tools/parse_hosts.js')

  var docs = require('./filter_for_term.js')(term)

  var hosts = parse_hosts(docs)

  var average = d3.sum(hosts, function (o) {return o.value}) / hosts.length
  var limit = 8
  if (hosts.length <= limit) {
    limit = 3
  }
  other_hosts = hosts.filter(function (o, idx) { return idx >= limit })
  hosts = hosts.filter(function (o, idx) { return idx < limit })
  var others_aggregate = {
    key: 'others',
    value: 0
  }
  other_hosts.forEach(function (o) {
    others_aggregate.value += o.value
  })
  // console.log(others_aggregate)
  if (others_aggregate.value > 0) {
    hosts.push(others_aggregate)
  }

  // console.log(hosts[hosts.length - 1], hosts[0])

  var w = 1024
  var box_height = 30
  var h = box_height * hosts.length

  var color = d3.scaleOrdinal(d3.schemeCategory10)

  var parent = d3.select('div#breakout')
    .append('div')
    // .style('border', '1px solid black')
    .style('margin-bottom', '10px')

  parent.append('hr')

  var header = parent.append('div').attr('class', 'col-md-12')

  // add the line chart
  var div_linechart = parent.append('div').attr('class', 'col-md-12')
  var linksvtime = require('./linksvtime_linechart.js')
  var filter = require('./filter_for_term.js')
  console.log('prechck', term)
  var more = linksvtime(filter(term), div_linechart)
  more(term, false)

  header.append('h1').html(function () {
    if (term === '') {
      return 'all links'
    } else {
      return term.split('|').join(' or ')
    }
  })
  header.append('h5').html([hosts.length + other_hosts.length, 'hosts,', docs.length, 'links'].join(' '))

  var svg = parent.append('svg')
    .attr('width', '100%')
    .attr('viewBox', [0, 0, w, h].join(' '))
    .attr('preserveApsectRatio', 'xMidYMid')
    .style('outline', '1px solid rgb(244,244,244)')

  var div_links = parent.append('div')
    .attr('class', 'col-md-12')

  var btn = div_links.append('button').attr('class', 'btn btn-default btn-sm pull-right').html('show links')
  btn.on('click', function () {
    docs.forEach(function (doc) {
      var p = div_links.append('div').attr('class', 'col-md-12')
      p.append('span').attr('class', 'col-md-2 text-center').html(new Moment.utc(doc.capture_time).format('MMMM Do')).style('font-family', 'monospace')
      p.append('a').attr('href', doc.href).text(doc.text)
    })
  })

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

    var label_left_align = ((running_x + box_width) < (w * 0.5))

    // console.log(host.key, label_left_align)
    g.append('text').text(host.key)
      .attr('x', function () {
        if (label_left_align) {
          return box_width + 5
        } else {
          if (running_x === 0) {
            return box_width - 5
          } else {
            return -5
          }
        }
      })
      .attr('text-anchor', function () {
        if (label_left_align) {
          return 'start'
        } else {
          return 'end'
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
            return 5
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
