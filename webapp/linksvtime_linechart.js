var Moment = require('moment')

module.exports = function linksvtime (docs) {
  console.log('hello links from time chart')
  var w = 1024
  var h = 256

  // dot chart, plot chart
  // x is the day of the year
  // y is the number of links in that day
  var data = []
  var data_lut = {}
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
  var min_day = d3.min(data, function (d) { return d.day })
  var max_day = d3.max(data, function (d) { return d.day })

  var max_value = d3.max(data, function (d) { return d.value })
  console.log(min_day, max_day, max_value)

  var scale_x_dayofyear = d3.scaleLinear().domain([min_day, max_day]).range([0, w])
  var scale_y_value = d3.scaleLinear().domain([0, max_value]).range(h, 0)

}
