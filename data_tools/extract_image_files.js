var assert = require('assert')
var fs = require('fs')
var moment = require('moment')
var leftpad = require('left-pad')
var fse = require('fs-extra')
var async = require('async')

module.exports = function(docs){
  // docs = docs.reverse()
  var headlines = []
  var fns = []

  fns.push(function(next){next()})

  docs.forEach(function(d,idx){
    console.log('doc idx', idx)
    fns.push(function(next){
	    console.log('from inside', d)
	    if(d.image.length > 0 || (d.image.indexOf('png') !== -1 || d.image.indexOf('jpg') !== -1)){
	      console.log(idx, d.image, d.capture_time)
	      var begin_idx = d.image.toLowerCase().indexOf('img src="')
	      assert(begin_idx > 0, true)
	      var end_idx = d.image.toLowerCase().indexOf('"', begin_idx+10)
	      assert(end_idx > 0, true)
	      var image_substring = d.image.substring(begin_idx+9, end_idx).split('../')[1]
	      if(image_substring === undefined){
	        return
	      }
	      // console.log(d.image.substring(begin_idx+9, end_idx), d.capture_time)
	      var t = new moment.utc(d.capture_time)
	      // var t_non_utc = new moment.utc(d.capture_time)
	      // console.log(t.toString(), t.month()+1, t.date(), t.year(), leftpad(t.hour(),2,0), leftpad(t.minute(),2,0))
	      var file_name = [t.year(), leftpad(t.month()+1,2,0), leftpad(t.date(),2,0), leftpad(t.hour(),2,0) + leftpad(t.minute(),2,0), 'UTC'].join('-')
	      console.log(file_name, image_substring)

	      var full_path = '/home/bill/drudgereport_report/output/'+file_name+'/'+image_substring

	      // console.log(image_substring)
	      // console.log(image_substring.split('/'))
	      var just_image_name = image_substring.split('/')[image_substring.split('/').length-1]

	      var file_found = false
	      fs.access(full_path, fs.constants.F_OK, function(err){
        	if(err){
	          console.log('bad', full_path)
	        } else {
	          console.log(full_path, just_image_name)
		        headlines.push({ text: d.text, href: d.href, t: d.capture_time, img: d.capture_time+'-'+just_image_name  })
	          fse.copySync(full_path, '/home/bill/drudgereport_report/local_data/images/'+d.capture_time+'-'+just_image_name)
	        }
	  	    return next()
	      })
	    } else {
        next()
      }
    })
    if(idx === docs.length-1){
      console.log('got to the end!')
      fns.push(function(next){
        fs.writeFileSync('/home/bill/drudgereport_report/local_data/images/desc.json', JSON.stringify(headlines))
	      console.log('done!')
        return next()
      })
      console.log('n fns', fns.length)
      async.series(fns)
    }
  })

}
