# gisd-summer-collection-frontend

> Vue Frontend for GISD Summer Collection Webapp

## Build Setup

```bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

    TODO
    [/] check username/email for uniques
    [X] limit title length
    [X] limit description length
    [] Make error message for invalid length
    [] create admin panel to approve/reject submissions
    [] redo home that shows top builds in each category
    [/] figure how to keep top builds 'fresh'
    [] limit builds/day or max builds
    [] Pagination
    [/] vanguard images
    [X] all vanguard weapons
    [X] basic censoring
    [X] Whats new section (Home)
    [X] Beta message!
    [] Update Voting/Favoriting System

Ranking System...

    Reddit: # Rewritten code from /r2/r2/lib/db/\_sorts.pyx

    	from datetime import datetime, timedelta
    	from math import log

    	epoch = datetime(1970, 1, 1)

    	def epoch_seconds(date):
    			td = date - epoch
    			return td.days * 86400 + td.seconds + (float(td.microseconds) / 1000000)

    	def score(ups, downs):
    			return ups - downs

    	def hot(ups, downs, date):
    			s = score(ups, downs)
    			order = log(max(abs(s), 1), 10)
    			sign = 1 if s > 0 else -1 if s < 0 else 0
    			seconds = epoch_seconds(date) - 1134028003
    			return round(sign * order + seconds / 45000, 7)
