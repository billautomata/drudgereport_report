module.exports = function find_links(line_array){
  var a = []
  line_array.forEach(function(line){
    if(line.includes('<A HREF=') && line.includes('</A>')){
      var link_begin = line.indexOf('<A HREF=\"')
      var link_end = line.indexOf('\">', link_begin)
      var link_close = line.indexOf('</A>', link_end)
      // console.log(line)
      console.log('link', '\t', line.slice(link_begin + 9, link_end))
      console.log('text', '\t', line.slice(link_end + 2, link_close))
    }
  })
}
