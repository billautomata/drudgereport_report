var Moment = require('moment')
var d3 = window.d3

console.log('suuuup')

window.fdocs = require('../local_data/fdocs.json')
console.log(fdocs.length)

// var parse_hosts = require('../data_tools/parse_hosts.js')
// parse_hosts(fdocs)

var more = linksvtime(fdocs)
var term = 'trump'
// more('trump', 'rgba(255,0,0,0.3)')
more('email', 'rgba(255,255,0,1)')
// more('hillary', 'rgba(255,0,255,0.3)')
// linksvtime(fdocs.filter(function (o) { return o.text.toLowerCase().includes(term)}))
// linksvtime(fdocs.filter(function (o) { return o.text.toLowerCase().includes('hillary')}))

function linksvtime (docs) {
  var w = 1024
  var h = 256

  var element_height = h / 30

  // dot chart, plot chart
  // x is the day of the year
  // y is the hour of the day
  var data = []
  docs.forEach(function (d) {
    var date = new Moment.utc(d.capture_time).utcOffset(-5)
    // console.log(date.dayOfYear())
    data.push({
      x: date.dayOfYear(),
      y: date.hour()
    })
  })

  var max_x = d3.max(data, function (d) {return d.x})
  var min_x = d3.min(data, function (d) {return d.x})

  var margins = {
    left: 20,
    right: 10,
    top: 14,
    bottom: 20
  }

  var scale_x_dayofyear = d3.scaleLinear().domain([min_x, max_x]).range([margins.left, w - margins.right - margins.left])
  var scale_y_hourofday = d3.scaleLinear().domain([0, 23]).range([margins.top, h - margins.bottom - margins.top])

  var svg = d3.select('div#linksvtime').append('svg')
    .attr('width', '100%')
    .attr('viewBox', [0, 0, w, h].join(' '))
    .attr('preserveApsectRatio', 'xMidYMid')
    .style('outline', '1px solid rgb(244,244,244)')

  // draw scale lines
  d3.range(1, 24, 2).forEach(function (hr) {
    svg.append('line')
      .attr('x1', 0)
      .attr('y1', scale_y_hourofday(hr))
      .attr('x2', w)
      .attr('y2', scale_y_hourofday(hr))
      .attr('stroke', 'rgba(0,0,0,0.1)')
      .attr('stroke-width', element_height)
      .attr('fill', 'none')

    svg.append('text').text(hr)
      .attr('x', 2)
      .attr('y', scale_y_hourofday(hr))
      .attr('dy', '0.33em')
      .attr('stroke', 'none')
      .attr('fill', 'rgba(0,0,0,0.5)')
      .style('font-size', (element_height * 0.9) + 'px')

  })

  add_elements('', 'rgba(0,0,0,0.15)')

  function add_elements (term, color) {

    // mogrify data
    var data = []
    docs.forEach(function (d) {
      var date = new Moment.utc(d.capture_time).utcOffset(-5)
      // console.log(date.dayOfYear())
      if (d.text.toLowerCase().includes(term)) {
        data.push({
          x: date.dayOfYear(),
          y: date.hour()
        })
      }
    })

    console.log(data)

    data.forEach(function (d) {
      svg.append('circle')
        .attr('cx', scale_x_dayofyear(d.x))
        .attr('cy', scale_y_hourofday(d.y))
        .attr('r', element_height * 0.5)
        .attr('fill', function () {
          if (term !== '') {
            return color
          } else {
            return 'none'
          }
        })
        .attr('stroke', function () {
          if (term !== '') {
            return 'none'
          } else {
            return color
          }
        })
        .attr('stroke-width', '0.5pxs')
    })
  }

  return add_elements
}
