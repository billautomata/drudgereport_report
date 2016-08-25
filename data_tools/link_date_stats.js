var moment = require('moment')
module.exports = function(docs){
  var day_of_week_lut = {}
  docs.forEach(function(doc){
    var dow = moment(doc.capture_time).day()
    if(day_of_week_lut[dow] === undefined){
      day_of_week_lut[dow] = 0
    }
    day_of_week_lut[dow] += 1
  })
  console.log(day_of_week_lut)

  var hour_of_day_lut = {}
  docs.forEach(function(doc){
    var hod = moment(doc.capture_time).hour()
    if(hour_of_day_lut[hod] === undefined){
      hour_of_day_lut[hod] = 0
    }
    hour_of_day_lut[hod] += 1
  })
  console.log(hour_of_day_lut)

  var day_of_year_lut = {}
  docs.forEach(function(doc){
    var doy = moment(doc.capture_time).dayOfYear()
    if(day_of_year_lut[doy] === undefined){
      day_of_year_lut[doy] = 0
    }
    day_of_year_lut[doy] += 1
  })
  console.log(day_of_year_lut)
}
