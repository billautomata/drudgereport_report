module.exports = function(documents){
  // build hashtable by capture_time
  // build object with arrays for each section (topleft, second, headline)
  var capture_lut = {}
  documents.forEach(function(d){
    if(capture_lut[d.capture_time] === undefined){
      capture_lut[d.capture_time] = {}
    }
    if(capture_lut[d.capture_time][d.section] === undefined){
      capture_lut[d.capture_time][d.section] = []
    }
    capture_lut[d.capture_time][d.section].push(d)
  })
  // sort it all
  Object.keys(capture_lut).forEach(function(lut_value){
    var o = capture_lut[lut_value]
    Object.keys(o).forEach(function(section_name){
      o[section_name].sort(function(a,b){ return a.index - b.index })
    })
  })
  console.log(Object.keys(capture_lut).length,'hours captured')
  console.log(JSON.stringify(capture_lut[Object.keys(capture_lut)[0]],null,2))
}
