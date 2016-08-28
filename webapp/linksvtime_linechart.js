var Moment = require('moment')
var d3 = window.d3

var color_values = d3.scaleOrdinal(d3.schemeCategory10)

module.exports = function linksvtime (docs, parent, options) {
  if (options === undefined) {
    options = {
      h: 96
    }
  }

  console.log('hello links from time chart')
  var w = 1024
  var h = options.h

  // dot chart, plot chart
  // x is the day of the year
  // y is the number of links in that day
  var data = []
  var day_data = []

  var day_data_lut = {}
  var data_lut = {}
  window.fdocs.forEach(function (doc) {
    var date = new Moment.utc(doc.capture_time).utcOffset(-5)
    if (day_data_lut[date.dayOfYear()] === undefined) {
      day_data_lut[date.dayOfYear()] = 0
    }
    day_data_lut[date.dayOfYear()] += 1
  })
  Object.keys(day_data_lut).forEach(function (name) {
    day_data.push({
      day: Number(name),
      value: data_lut[name]
    })
  })

  docs.forEach(function (doc) {
    var date = new Moment.utc(doc.capture_time).utcOffset(-5)
    if (data_lut[date.dayOfYear()] === undefined) {
      data_lut[date.dayOfYear()] = 0
    }
    data_lut[date.dayOfYear()] += 1
  })
  Object.keys(data_lut).forEach(function (name) {
    data.push({
      day: Number(name),
      value: data_lut[name]
    })
  })
  // console.log(data)
  var min_day = d3.min(day_data, function (d) { return d.day })
  var max_day = d3.max(day_data, function (d) { return d.day })

  var max_value = d3.max(data, function (d) { return d.value })
  // console.log(min_day, max_day, max_value)

  var margins = {
    top: 10,
    bottom: 20,
    left: 20,
    right: 10
  }

  var scale_x_dayofyear = d3.scaleLinear()
    .domain([min_day, max_day])
    .range([margins.left, w - margins.right])

  var scale_y_value = d3.scaleLinear()
    .domain([0, max_value])
    .range([h - margins.bottom, margins.top])

  parent.style('padding-bottom', '20px')

  var svg = parent.append('svg')
    .attr('width', '100%')
    .attr('viewBox', [0, 0, w, h].join(' '))
    .attr('preserveApsectRatio', 'xMidYMid')
    .style('background-color', 'rgb(250,250,250)')
    // .style('outline', '1px solid black')

  // draw y scale lines
  d3.range(0, max_value + 1, Math.ceil(max_value / 3)).forEach(function (v) {
    // console.log(v)
    svg.append('line')
      .attr('x1', margins.left)
      .attr('y1', scale_y_value(v))
      .attr('x2', w - margins.right)
      .attr('y2', scale_y_value(v))
      .attr('stroke', 'rgba(128,128,128,0.5)')
      .attr('stroke-width', '0.5px')

    svg.append('text').text(v)
      .attr('x', margins.left - 2)
      .attr('y', scale_y_value(v))
      .attr('dy', '0.33em')
      .attr('text-anchor', 'end')
      .attr('fill', 'rgba(0,0,0,0.5)')
      .style('font-size', '10px')
  })

  // draw x scale lines
  d3.range(min_day, max_day + 1, 1).forEach(function (day_number) {
    var date = new Moment().dayOfYear(day_number)
    // console.log(date.date())
    if (date.date() === 1) {
      svg.append('line')
        .attr('x1', scale_x_dayofyear(day_number))
        .attr('y1', margins.top)
        .attr('x2', scale_x_dayofyear(day_number))
        .attr('y2', h - margins.bottom)
        .attr('stroke', 'rgba(128,128,128,0.5)')
        .attr('stroke-width', '0.5px')

      svg.append('text').text(date.format('MMM'))
        .attr('x', scale_x_dayofyear(day_number))
        .attr('y', h - margins.bottom + 10)
        .attr('text-anchor', 'start')
        .attr('fill', 'rgba(0,0,0,0.5)')
        .style('font-size', '10px')

    } else if (date.date() % 7 === 0) {
      svg.append('text').text(date.date())
        .attr('x', scale_x_dayofyear(day_number))
        .attr('y', h - margins.bottom + 10)
        .attr('text-anchor', 'middle')
        .attr('fill', 'rgba(0,0,0,0.5)')
        .style('font-size', '10px')

      svg.append('line')
        .attr('x1', scale_x_dayofyear(day_number))
        .attr('y1', margins.top)
        .attr('x2', scale_x_dayofyear(day_number))
        .attr('y2', h - margins.bottom)
        .attr('stroke', 'rgba(0,0,0,0.2)')
        .attr('stroke-dash', '1 2')
        .attr('stroke-width', '0.5px')
    }

  })

  var div_labels = parent.append('div').attr('class', 'col-md-12')

  var n_elements = 0
  function add_elements (term, do_label) {
    color = color_values(n_elements)
    if (do_label === undefined) {
      do_label = true
    }
    if (do_label) {
      div_labels.append('div').attr('class', 'btn').text(function () {
        if (term === '') {
          return 'all links'
        } else {
          return term
        }
      })
        .style('background-color', color)
        .style('color', 'white')
    }

    n_elements += 1
    console.log('adding lines for term', term)

    var data = []
    var data_lut = {}
    d3.range(min_day, max_day + 1, 1).forEach(function (day) { data_lut[day] = 0 })
    var docs = require('./filter_for_term.js')(term)
    docs.forEach(function (doc) {
      var date = new Moment.utc(doc.capture_time).utcOffset(-5)
      if (data_lut[date.dayOfYear()] === undefined) {
        data_lut[date.dayOfYear()] = 0
      }
      data_lut[date.dayOfYear()] += 1
    })
    d3.range(min_day, max_day + 1, 1).forEach(function (day) {
      data.push({
        day: day,
        value: 0
      })
    })
    data.forEach(function (d) {
      d.value = data_lut[d.day]
    // console.log(d.value)
    })

    // draw the lines
    data.forEach(function (d, idx) {
      if (idx === data.length - 1) {
        return
      } else {
        var day = d.day
        var v = d.value
        // console.log(day)
        svg.append('line')
          .attr('x1', scale_x_dayofyear(day))
          .attr('y1', scale_y_value(v))
          .attr('x2', scale_x_dayofyear(day + 1))
          .attr('y2', scale_y_value(data[idx + 1].value))
          .attr('stroke', color)
          .attr('stroke-width', '3')
          .attr('stroke-opacity', '0.5')
          .attr('fill', 'none')
      }
    })
  }
  return add_elements

}
