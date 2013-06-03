var express = require ('express');

var app = express();

app.get ('/url',function(req,res){
	res.send([{name:'url1'},{name:'url2'}]);
});
app.get('/url/:url', function(req,res){
	res.send({url:req.params.url, name: "The Url", description: "description"});
});

app.listen(8080);
console.log('Listening on port 8080...');