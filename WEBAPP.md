# web application

A search tool where the user inputs keywords and a series of graphs render

* [x] search box
  * [x] combine search terms
* [x] line chart, links vs time, #linksvtimeline
  * [x] axes
* [x] dot chart, links vs time, #linksvtime
  * [-] collapse and expand to show the by-the-hours breakdown
* [x] bar chart, who is linked
  * [ ] collapse and expand to show the others  
* [ ] list links for each search term
* [ ] image collage
* [ ] polish

```
node populate_links.js
node mongo_to_local_json.js
node pivot_generate_data.js
```
