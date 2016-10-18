'use strict';

require("babel-register")({
  "presets": ["es2015-node5"],
  "plugins": [
    "transform-async-to-generator",
    "syntax-async-functions"
  ]
});

const app = require('./app');

app.listen(3001)

