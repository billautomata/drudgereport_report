var uuid = require('uuid')
var assert = require('assert')

module.exports = function find_links(line_array){
  var a = []

  var current_image = ''
  var current_story_group = uuid.v4()

  line_array.forEach(function(line, line_idx){

    var link_found = false
    var link_text = ''
    var link_href = ''
    var link_begin = -1
    var link_end = -1
    var link_close = -1

    if(line.toLowerCase().includes('<hr>')){
      // reset the status of the story group to associate links
      current_story_group = uuid.v4()
      // console.log(line)
    }
    if(line.toLowerCase().includes('<img') && !line.toLowerCase().includes('noscript')){
      // set the status of the current image to associate with the next link
      current_image = line
      // console.log(line)
    }
    // find links where the line contains the link entirely
    if(line.includes('<A HREF=') && line.includes('</A>')){
      link_found = true
      link_begin = line.indexOf('<A HREF=\"')
      link_end = line.indexOf('\">', link_begin)
      link_close = line.indexOf('</A>', link_end)

      assert(link_begin !== -1, 'checking multi-line link indexes')
      assert(link_end !== -1, 'checking multi-line link indexes')
      assert(link_close !== -1, 'checking multi-line link indexes')
    }
    if(line.includes('<A HREF=') && !line.includes('</A>')){
      // console.log('found a link with a linebreak')
      line = line + line_array[line_idx+1]
      if(line.includes('<A HREF=') && line.includes('</A>')){
        link_found = true
        link_begin = line.indexOf('<A HREF=\"')
        link_end = line.indexOf('\">', link_begin)
        link_close = line.indexOf('</A>', link_end)
        assert(link_begin !== -1, 'checking multi-line link indexes')
        assert(link_end !== -1, 'checking multi-line link indexes')
        assert(link_close !== -1, 'checking multi-line link indexes')
      }
    }

    if(link_found === true){

      link_text = line.slice(link_end + 2, link_close)
      link_href = line.slice(link_begin + 9, link_end)

      var o = {
        raw_line: line,
        href: link_href,
        text: link_text,
        image: current_image,
        story_group: current_story_group
      }
      // console.log(o)
      assert(o.href.length > 0, 'bad parse no link')
      assert(o.text.length > 0, 'bad parse no text')
      assert(o.text.length > 0, 'bad parse no story group')

      a.push(o)

      // reset the status of the current image
      current_image = ''
    }
  })

  return a
}
