var async = require('async');
//Estabilish connection to database
var connection;
var options;
    async.waterfall([
        function (callback){
            var mysql      = require('mysql');
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
          console.log('first'+connection);
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
          console.log('1');
          connection.query('SELECT * FROM stock',function(err, rows){
            console.log('2');
            // if(err) console.log(err);;
          // Fetch to console
            console.log('Data received from Db:\n');
            console.log(rows);
            var json = rows;
            for (var i = json.length-1 ; i >= 0; i--) {
              // Find a <table> element with id="myTable":
              var table = document.getElementById("myTable");
              // Create an empty <tr> element and add it to the 1st position of the table:
              var row = table.insertRow(1);
              // Insert new cells (<td> elements) at the 1st and 2nd position of the "new" <tr> element:
              var cell1 = row.insertCell(0);
              var cell2 = row.insertCell(1);
              var cell3 = row.insertCell(2);
              var cell4 = row.insertCell(3);
              var cell5 = row.insertCell(4);
              var cell6 = row.insertCell(5);
              // Add some text to the new cells:
              cell1.innerHTML = json[i].stock_code;
              cell2.innerHTML = json[i].name;
              cell3.innerHTML = json[i].category;
              cell4.innerHTML = json[i].price;
              cell5.innerHTML = json[i].quant;
              cell6.value = json[i].stock_code;
              cell6.innerHTML = "x";
              cell6.onclick = function(){delStockItem(this.value)};
              }
              console.log('2.5');
              console.log('second'+connection);
                  var mysql      = require('mysql');
              connection = mysql.createConnection({
                host     : 'localhost',
                user     : 'root',
                password : '',
                database : 'resto-man-db'
              });
              callback(null, connection);
            });
              // callback(null, connection);
        }
        ,
          function (conn, callback){
            connection = conn;
            connection.query('SELECT name FROM menu', function(err, r){
              rows = r;
              console.log('3'); 
            var mylist = [];
            for(var i in rows)
              mylist.push([rows[i].name]);
                options = '';
                for(var i = 0; i < mylist.length; i++)
                  options += '<option>'+mylist[i]+'</option>	';
                  console.log("hi");
                  callback(null, options);
            });
          },
        function (opt, callback){
          options=opt;
          console.log('uno'+options);
          document.getElementById('namelist').innerHTML = "uno<option>Aata</option>	<option>parle g</option>	<option>bachcha</option>"	;
          console.log('duos');
          callback(null, connection);
              // callback(null, options);
        },
        function (conn, callback){
          connection = conn;
          connection.end();
          console.log("done");
          callback(null, 'success')
        }
    ], function (error, success) {
        if (error) { console.log(error); }
        console.log(success);

    });
// // estabilises connection from sql
function estcon(){
  var mysql      = require('mysql');
  connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'resto-man-db'
  });
  connection.connect(function(err){
    if(err){
      console.log('Error connecting to Db');
      console.log(err);
    }
    console.log('Connection established');
  });

}


// delete item from database
function delStockItem(index){
  estcon();
  console.log(index + 'Deleted');
  connection.query(
    'DELETE FROM stock WHERE stock_code = ?',
    index,
    function (err, result) {
      if (err) throw err;
      console.log('Deleted ' + result.affectedRows + ' rows');
    }
  );
window.location.reload();
  return;
}

// Add a new item to stock
function addtostock(){
  //Estabilish connection
  estcon();
  // get values from form
  var vstock_code = document.getElementById("stock_code").value;
  var vname = document.getElementById("name").value;
  var vcat = document.getElementById("category").value;
  var vprice = document.getElementById("price").value;
  var vquant = document.getElementById("quant").value;
  var itementry = { stock_code: vstock_code, name: vname, category: vcat, price: vprice, quant: vquant };
  var updateitem = { stock_code: vstock_code, price: vprice, quant: vquant};
  var q = connection.query('INSERT INTO stock SET ? ON DUPLICATE KEY UPDATE ?', [itementry, updateitem], function(err,res){
  if(err) throw err;
    console.log('Last insert ID:', res.insertId);
    printtable();
  });
  return;
}
