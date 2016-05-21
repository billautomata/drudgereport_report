module.exports = function find_fontsize(line_array){
  var a = []
  line_array.forEach(function(line){
    if(line.includes('<font size=\"')){
      // console.log('found fontsize')
      var link_begin = line.indexOf('<font size=')
      var link_end = line.indexOf('\">', link_begin)
      // console.log(line)
      console.log('fontsize', '\t', Number(line.slice(link_begin + 12, link_end)))
    }
  })
}
