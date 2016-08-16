var express = require('express'),
	bodyParser = require('body-parser');


app = express();

// this will allow us to fetch the url encoded params...
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


var router = require('./routes');

app.use('/',router);

app.listen(3000, function(){
 console.log('Example app listening on port 3000');
});
