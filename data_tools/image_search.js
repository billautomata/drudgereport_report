module.exports = function(documents){
  documents.forEach(function(d){
    if(d.image.length > 0){
      if(d.image.toLowerCase().includes('siren')){
          console.log(d)
      }
    }
  })
}
