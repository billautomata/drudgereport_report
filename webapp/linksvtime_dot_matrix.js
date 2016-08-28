var Moment = require('moment')

module.exports = function linksvtime (docs) {
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

  // default
  // add_elements('', 'rgba(0,0,0,1)')

  function add_elements (term, color) {

    // mogrify data
    var data = []
    docs = require('./filter_for_term.js')(term)
    docs.forEach(function (d) {
      var date = new Moment.utc(d.capture_time).utcOffset(-5)
      // console.log(date.dayOfYear())
      data.push({
        x: date.dayOfYear(),
        y: date.hour()
      })
    })

    // reduce
    var max_found = 0
    var o = {}
    data.forEach(function (d) {
      if (o[d.x + '_' + d.y] === undefined) {
        o[d.x + '_' + d.y] = {
          v: 0
        }
      }
      o[d.x + '_' + d.y].v += 1
      if (o[d.x + '_' + d.y].v > max_found) {
        max_found = o[d.x + '_' + d.y].v
      }
    })

    var scale_radius = d3.scaleLinear()
      .domain([ 1, max_found ])
      .range([ element_height * 0.1, element_height * 0.5 ])

    console.log(data)

    data.forEach(function (d) {
      if (o[d.x + '_' + d.y].hit === undefined) {
        o[d.x + '_' + d.y].hit = true
        svg.append('circle')
          .attr('cx', scale_x_dayofyear(d.x))
          .attr('cy', scale_y_hourofday(d.y))
          .attr('r', scale_radius(o[d.x + '_' + d.y].v))
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
          .attr('stroke-width', '0.5px')
      } else {
        console.log('bailed out')
      }
    })
  }

  return add_elements
}
