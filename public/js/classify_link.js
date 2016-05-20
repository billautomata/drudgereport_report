var $ = window.$
var d3 = window.d3

$.get('/many_to_classify').then(function (many_data) {
  console.log('many data', many_data)

  // draw master tag controller
  var master_box = make_box({
    text: '------ // ------',
    href: ''
  })

  master_box.inputs.forEach(function (input, input_idx) {
    input.on('keyup', function () {
      var value = input.node().value
      console.log(value)

      window.boxes.forEach(function (box) {
        box.inputs[input_idx].node().value = value
        box.update()
      })
    })
  })

  // returns references to selectors, update functions, and click functions
  window.boxes = []
  many_data.forEach(function (d) {
    window.boxes.push(make_box(d))
  })
})

function make_box (d) {
  var inputs = []
  var updates = []
  var parent = d3.select('div.container').append('div').attr('class', 'col-md-12')

  parent.datum(d)
  parent.append('h4').html(d.text)
  parent.append('h6').append('a').attr('href', d.href).html(d.href)

  ;['who', 'where', 'tags'].forEach(function (type) {
    var div = parent.append('div').attr('class', 'col-md-12 inputs')
    div.type = type

    div.append('h5').attr('class', 'col-md-2 text-right').html(function () {
      if (type === 'who') {
        return 'who / what'
      } else {
        return type
      }
    })
    var input = div.append('input')
      .attr('id', type)
      .attr('type', 'text')
      .attr('class', 'col-md-4')
    inputs.push(input)
    var indicator = div.append('div').attr('class', 'indicator')
      .attr('id', type)
      .attr('class', 'col-md-6')

    function update () {
      // var id = input.attr('id')
      console.log(input.node().value)
      var split = String(input.node().value).split(',')
      split = split.map(function (d) {
        return d.trim()
      })
      split = split.filter(function (d) {
        return d.length !== 0
      })
      // console.log(split)
      input.datum(split)
      indicator.selectAll('*').remove()
      split.forEach(function (d) {
        indicator.append('span').html(d)
          .style('outline', '1px solid black')
          .style('padding', '2px')
          .style('margin-right', '5px')
      })
    }

    updates.push(update)

    input.on('keyup', function () {
      update()
    })
  })

  function update () {
    updates.forEach(function (d) {
      d()
    })
  }

  // sentiment buttons
  // submit
  var div_sentiment = parent.append('div').attr('class', 'col-md-12')
  div_sentiment.style('margin-bottom', '4px')
  div_sentiment.append('h5').attr('class', 'col-md-2 text-right').html('sentiment')
  ;['negative', 'neutral', 'positive'].forEach(function (news_type) {
    var btn = div_sentiment.append('div').attr('class', 'btn btn-default').html(news_type)
    btn.on('click', function (d) {
      div_sentiment.selectAll('div.btn').attr('class', 'btn btn-default')
      div_sentiment.datum({
        sentiment: news_type
      })
      console.log(div_sentiment.datum())
      btn.attr('class', 'btn btn-primary')
    })
  })

  // submit button
  var div_submit = parent.append('div').attr('class', 'col-md-6 btn btn-success').html('submit')
  parent.append('hr').attr('class', 'col-md-12')

  div_submit.on('click', clicked)

  function clicked () {
    var who_array = inputs[0].datum()
    var where_array = inputs[1].datum()
    var tags_array = inputs[2].datum()
    if (d._id === undefined) {
      console.log('no data present')
      return
    }
    var data_to_send = {
      _id: d._id,
      who: who_array,
      where: where_array,
      tags: tags_array,
      sentiment: div_sentiment.datum().sentiment
    }
    console.log(d.text, data_to_send)
    $.ajax({
      type: 'post',
      url: '/classify',
      data: JSON.stringify(data_to_send),
      contentType: 'application/json',
      success: function (d) {
        console.log('done posting')
        console.log(d)
        div_submit.attr('class', 'col-md-6 btn btn-default')
      // window.location.reload()
      },
      error: function (d) {
        console.log('error', d)
      }
    })
  }

  return {
    parent: parent,
    inputs: inputs,
    update: update,
    click: clicked
  }
}
