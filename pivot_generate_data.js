var documents = JSON.parse(require('fs').readFileSync('./local_data/docs.json'))
console.log('total documents',documents.length)

console.log('example document')
console.log(documents[documents.length-1])

documents = documents.sort(function(a,b){
  return a.capture_time - b.capture_time
})

var known = {}
var fdocs = documents.filter(function(a){
  var k
  if(known[a.href] === undefined){
    known[a.href] = 1
    k = true
  } else {
    k = false
  }
  return k
})

console.log('unique documents', fdocs.length)

require('./data_tools/convert_to_json.js')(fdocs, 'fdocs.json')
// require('./data_tools/extract_image_files.js')(fdocs)

// console.log('begin data processing')

// var parse_hosts = require('./data_tools/parse_hosts.js')(fdocs)
// require('./data_tools/link_date_stats.js')(fdocs)
// require('./data_tools/link_age.js')(documents)
// require('./data_tools/dvr.js')(documents)
// require('./data_tools/image_search.js')(documents)

// require('./data_tools/convert_to_csv.js')(fdocs, 'unique_links.tsv')
// require('./data_tools/convert_to_csv.js')(documents, 'all_links.tsv')
