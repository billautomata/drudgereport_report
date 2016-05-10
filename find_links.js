module.exports = function find_links(line_array){
  var a = []
  line_array.forEach(function(line, line_idx){
    // find links where the line contains the link entirely
    if(line.includes('<A HREF=') && line.includes('</A>')){
      var link_begin = line.indexOf('<A HREF=\"')
      var link_end = line.indexOf('\">', link_begin)
      var link_close = line.indexOf('</A>', link_end)
      // console.log(line)
      console.log('link', '\t', line.slice(link_begin + 9, link_end))
      console.log('text', '\t', line.slice(link_end + 2, link_close))
    }
    if(line.includes('<A HREF=') && !line.includes('</A>')){
      // console.log('found a link with a linebreak')
      var try_line = line + line_array[line_idx+1]
      if(try_line.includes('<A HREF=') && try_line.includes('</A>')){
        var link_begin = try_line.indexOf('<A HREF=\"')
        var link_end = try_line.indexOf('\">', link_begin)
        var link_close = try_line.indexOf('</A>', link_end)
        // console.log(line)
        console.log('link', '\t', try_line.slice(link_begin + 9, link_end))
        console.log('text', '\t', try_line.slice(link_end + 2, link_close))
      }
    }
  })
}
