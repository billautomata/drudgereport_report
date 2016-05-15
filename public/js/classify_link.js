console.log(d3)

$.get('/one_to_classify').then(function(d){
  console.log(d)

  $('div.container').prepend(['<div id=id_', d._id,'></div>'].join(''))
  var parent = d3.select('div#'+'id_'+d._id).append('div').attr('class', 'col-md-12')

  var text = parent.append('h4').html(d.text)
  var href = parent.append('h6').append('a').attr('href', d.href).html(d.href)

  ;['who', 'where', 'tags'].forEach(function(type){
    var div = parent.append('div').attr('class','col-md-12')

    div.append('h5').attr('class', 'col-md-2 text-right').html(type)

    var input = div.append('input')
      .attr('id', type)
      .attr('type', 'text')
      .attr('class', 'col-md-4')

    input.on('keyup', function(){
      // console.log(input.node().value)
      var split = String(input.node().value).split(',')
      split=split.map(function(d){ return d.trim() })
      split=split.filter(function(d){ return d.length !== 0 })
      // console.log(split)
      input.datum(split)
      indicator.selectAll('*').remove()
      split.forEach(function(d){
        indicator.append('span').html(d)
          .style('outline', '1px solid black')
          .style('padding', '2px')
          .style('margin-right', '5px')
      })
    })
    var indicator = div.append('div')
      .attr('id', type)
      .attr('class', 'col-md-6')
  })

  // sentiment buttons
  // submit
  var div_sentiment = parent.append('div').attr('class','col-md-12')
  div_sentiment.append('h5').attr('class', 'col-md-2 text-right').html('sentiment')
  ;['negative', 'neutral', 'positive'].forEach(function(news_type){
    var btn = div_sentiment.append('div').attr('class', 'btn btn-default').html(news_type)
    btn.on('click', function(d){
      div_sentiment.datum({
        sentiment: news_type
      })      
      btn.attr('class', 'btn btn-primary')
    })
  })

  // submit button
  parent.append('hr').attr('class', 'col-md-12')
  var div_submit = parent.append('div').attr('class', 'col-md-12 btn btn-success').html('submit')

  div_submit.on('click', function(){
    var who_array = d3.select('input#who').datum()
    var where_array = d3.select('input#where').datum()
    var tags_array = d3.select('input#tags').datum()
    console.log(who_array,where_array,tags_array)
    console.log(div_sentiment.datum())
  })

})
