var express = require('express');


var app = express();

var ghost = require('./ghost/core'),
    errors = require('./ghost/core/server/errorHandling');

ghost(app);

app.use('/', express.static(__dirname  + '/_site'));

app.listen(8000);