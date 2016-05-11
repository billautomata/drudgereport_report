## parse
* find all images
  * image collage

* parse index.html
  * [ ] links
    * [x] href
    * [x] text
    * [x] identify sections
      * [x] top left
      * [x] headline
      * [x] first column
      * [x] second column
      * [x] third column
      * [ ] nth link in section
  * [x] find <hr> elements in columns to identify story groups (by uuid)
  * [x] image tags
    * [ ] associate with the story immediately after the image

## store
* mongo database schema ( links )
  * href - String
  * text - String
  * date_captured - String
  * section - String
  * section index - Number
  * associated_image - String
  * story_group - String

## classify
* [ ] pull link record from ( links ) database
* [ ] if href is missing from the classifications database
  * [ ] classify each headline with multiple tags

* mongo database schema ( classifications )
  * href - String
  * tags - Array
