
## bayes_classify.js
* [ ] automatically classify links
  * [ ] pull link from collection with no machine tags
  * [ ] perform a classification routine for each tag with link + href
  * [ ] save each positive tag hit in array
  * [ ] $set machine_tags: Array

## lib/parse_index_html.js
* parse index.html
  * [x] links
    * [x] href
    * [x] text
    * [x] identify sections
      * [x] top left
      * [x] headline
      * [x] first column
      * [x] second column
      * [x] third column
      * [x] nth link in section
  * [x] find <hr> elements in columns to identify story groups (by uuid)
  * [x] find <img
    * [x] associate with the story immediately after the image

## populate_links.js

> Store unique instances of pairs of href and capture time.

* mongo collection schema ( links )
  * href - String
  * text - String
  * date_captured - String
  * section - String
  * section index - Number
  * associated_image - String
  * story_group - String

* [x] iterate over each link
  * [x] find capture_time & href in db, if zero results, store the link

## populate_classify.js

> Store unique instances of href strings to associate tags

* [x] populate links
  * [x] pull link record from ( links ) collection
    * [x] if href is missing from the classifications collection
      * [x] add to classifications data base

* mongo collection schema ( classifications )
  * href - String
  * tags - Array
  * who / what - String (ex. Beyonce, Big Ben)
  * where - String (ex. Arizona, Orbit, Mars, Washington DC)
  * sentiment - String (ex. positive, negative, neutral)

## server_classify.js
* [x] discover links to classify
  * [x] pull link from the collection with no sentiment marked
  * [x] render to website where you can update the meta data
  * [ ] add buttons to add default tags

* [x] mass classify by story group

* [ ] search for classifications by text or href
* [ ] edit existing classification
* [ ] mass rename tag
  * [ ] find all instances of a tag in all classifications and change it

* [x] raw stats on tags

## cli_mining.js
* [ ] age of each link
* [x] build classifier for each tag, store in nets


### data handling
* [x] mongodump script
* [x] setup backup to git
