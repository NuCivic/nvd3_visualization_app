# ES2SQL
Javascript library to translate elastic search queries to sql

# Usage
```javascript
import * as Es2sql from 'src/modules/es2sql.js';

const esQuery = {
  filters: {...},
  table: 'my-table',
  from: 10,
  size: 100
};

const sqlQuery = Es2sql.translate(esQuery);
```

# Test
``npm test``

# Build
``npm build``

# Attribution
Built using the wonderful [react-es6-webpack-karma-boilerplate project](https://github.com/mvader/react-es6-webpack-karma-boilerplate)
