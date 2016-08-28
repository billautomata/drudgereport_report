module.exports = function filter_for_term (term) {
  var terms = term.split('|')
  var filter_docs = window.fdocs.filter(function (o) {
    var found = false
    terms.forEach(function (t) {
      t = t.trim()
      if (o.raw_line.toLowerCase().includes(t)) {
        // if (o.text.toLowerCase().includes(t)) {
        found = true
      }
    })
    return found
  })
  return filter_docs
}
