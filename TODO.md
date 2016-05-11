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
  * [x] find <hr> elements in columns to identify story groups (by uuid)
  * [x] image tags
    * [ ] assign section (topleft, headline, first, second, third)
    * [ ] associate to story-group
  * [ ] initial tags
    * [ ] section

## store
* mongo database schema
  * date captured - String 
  * associated image - String
  * story group uuid - String
  * href - String
  * text - String
  * tags - Array

## classify
* classify each headline with multiple tags
* sections
  * [ ] detect image in each section
  * [x] headline
  * [x] above the headline section
  * siren?
  * all caps
  * italics
  * grouping by tags
  * different color
  * what is in scare quotes
