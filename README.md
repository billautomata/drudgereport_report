```bash
# copy the scrape directories to ./output/
nvm use 4
node populate_links.js
node populate_classify.js
node server_classify.js
open http://localhost:60000/classify_link.html
sh scripts/dump_databases.sh # backup
```
