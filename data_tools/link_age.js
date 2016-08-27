module.exports = function link_age(docs){

  var results_lut = {}
  // {
  //   href: 'http://...',
  //   age: 30000
  // }

  docs.forEach(function(doc){
    // find first time
    if(results_lut[doc.href] === undefined){
      results_lut[doc.href] = {
        d: doc,
        href: doc.href,
        first_seen: doc.capture_time,
        age: 0
      }
      var first_age = doc.capture_time
      var all_like_this = docs.filter(function(o){ return o.href === doc.href})
      // console.log(all_like_this.length)
      if((all_like_this[0].capture_time > all_like_this[all_like_this.length-1].capture_time)){
        // wrong parse
        console.log(doc)
      } else {
        results_lut[doc.href].age = Math.abs((all_like_this[0].capture_time - all_like_this[all_like_this.length-1].capture_time))
      }
    }
  })

  var keys = Object.keys(results_lut)
  console.log(results_lut[keys[0]])
  console.log(Object.keys(results_lut).length)
  console.log('done')
}
