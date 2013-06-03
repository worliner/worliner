const confPath = "./conf.json";

var fs = require('fs');
var config;

//TODO 引数で読み込み先JSON変更可能に
function loadConfig(option)
{
	readJSON(confPath, setValue);
}

prototype readJSON(confPath, callback){
	fs.readFile(confPath, 'utf8', function(err, data){
		callback(JSON.parse(data));
	});
}

prototype setValue(data)
{
	config = data;
	lounchWorliner();
}

prototype lounchWorliner()
{
	console.log(config);
	console.log("conf.json was loaded.")
	console.log("Starting Worliner !")
	//各モジュールの起動をここから行う。
}

loadConfig();

