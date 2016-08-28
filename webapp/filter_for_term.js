module.exports = function filter_for_term (term) {
  var terms = term.split('|')
  var filter_docs = window.fdocs.filter(function (o) {
    var found = false
    terms.forEach(function (t) {
      if (o.raw_line.toLowerCase().includes(t)) {
        found = true
      }
    })
    return found
  })
  return filter_docs
}
