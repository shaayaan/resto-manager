var mysql      = require('mysql');
var http = require('http');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'shayan',
  database : 'resto'
});

connection.connect();

connection.query('SELECT * from bill', function(err, rows, fields) {
  if (err) throw err;

  console.log('Connection Success');
});

connection.query('use resto');
  var strQuery = 'select * from bill';

  connection.query( strQuery, function(err, rows){
  	if(err)	{
  		throw err;
  	}else{
  		console.log( rows );
  	}
  });

connection.end();
