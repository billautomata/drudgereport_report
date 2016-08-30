d3.json('../images/desc.json', function(d){
  console.log(d)
  d.sort(function(a,b){return b.t-a.t})
  console.log(d[0])

  var parent = d3.select('div#main')

  var img_nodes = []
  function add_image(){
    if(img_nodes.length >= d.length){
      return
    }
    var local_div = parent.append('div')
      .style('height', '200px').style('display', 'inline-block')
      .style('position', 'relative')
      .style('cursor', 'pointer')

    var img = local_div.append('a').attr('href', d[img_nodes.length].href).append('img')
    .style('position', 'relative')
    .style('top', '0px').style('left', '0px')
      .attr('height', '200px')
      .attr('src', ['../images/', d[img_nodes.length].img.split('?')[0]].join(''))
      .style('opacity', '1')

    var div_info = local_div.append('div')
      .style('position', 'absolute')
      .style('top', '0px').style('left', '0px')
      .style('padding', '10px')
      .style('z-index', 2)
      .style('opacity', 0)
      .style('color', 'black')

    div_info.append('h4')
      .attr('class', 'text-center')
      .text(d[img_nodes.length].text)

    local_div.on('mouseover', function(){
      div_info.transition().style('opacity', 1)
      img.transition().style('opacity', 0.1)
    })
    local_div.on('mouseout', function(){
      div_info.transition().style('opacity', 0)
      img.transition().style('opacity', 1)
    })


    img_nodes.push(img)
  }

  for(var i = 0; i < 20; i++){
    add_image()
  }

  $(window).scroll(function() {
     if($(window).scrollTop() + $(window).height() == $(document).height()) {
         console.log("bottom!");
         for(var i = 0; i < 10; i++){
           add_image()
         }
     }
  });

})
