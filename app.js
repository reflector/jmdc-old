var express = require('express');


var app = express();

// var ghost = require('ghost');

// ghost(app);

app.use('/', express.static(__dirname  + '/_site'));

app.listen(8000);
