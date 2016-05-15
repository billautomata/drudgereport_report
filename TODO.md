## parse_index_html.js
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

## store_to_mongo.js
* mongo database schema ( links )
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
* [x] populate links
  * [x] pull link record from ( links ) database
    * [x] if href is missing from the classifications database
      * [x] add to classifications data base

* mongo database schema ( classifications )
  * href - String
  * tags - Array
  * who / what - String (ex. Beyonce, Big Ben)
  * where - String (ex. Arizona, Orbit, Mars, Washington DC)
  * sentiment - String (ex. positive, negative, neutral)

## server_classify.js
* [x] classify links
  * [x] pull link from the database with no sentiment marked
  * [x] render to website where you can update the metadata
* [ ] add buttons to add default tags

### data handling
* [x] mongodump script
* [x] setup backup to git
