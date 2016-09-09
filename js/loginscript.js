var connection;
var async = require('async');
var mysql = require('mysql');

function adminlogin(){
  async.waterfall([
      function (callback){
          console.log('0');
          connection = mysql.createConnection({
            host     : 'localhost',
            user     : 'root',
            password : '',
            database : 'resto-man-db'
          });
          callback(null, connection);
      },
      function (conn, callback){
        connection = conn;
        console.log('1');
        connection.connect(function(err){
          if(err){
            console.log('Error connecting to Db');
            console.log(err);
            callback(err, null);
          }
          console.log('Connection established');
        });
      callback(null, connection);
      },
      function (conn, callback){
        connection = conn;
        var lid = document.getElementById('loginid').value;
        var pass = document.getElementById('password').value;
        console.log(lid);
        connection.query('SELECT * FROM admindata WHERE loginid = ?', lid, function(err, row){
          console.log('3');
            console.log(row);
          if(row.length == 0){
            console.log("user not found");
          }else if (row[0].password == pass) {
            console.log("correct password");
          }
          else {
            console.log("wrong password");
          }
        });
      }
    ], function (error, success) {
        if (error) { console.log(error); }
        console.log(success);

    });
}
