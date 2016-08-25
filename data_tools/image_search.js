module.exports = function(documents){
  documents.forEach(function(d){
    if(d.image.length > 0){
      console.log(d)
    }
  })
}
