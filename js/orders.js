var async = require('async');
let connection;
var incc = 0;
var vorder_no = 0;
async.waterfall([
        function(callback) {
            var mysql = require('mysql');
            console.log('0');
            connection = mysql.createConnection({
                host: 'localhost',
                user: 'root',
                password: '',
                database: 'resto-man-db'
            });
            callback(null, connection);
        },
        function(conn, callback) {
            connection = conn;
            console.log('first' + connection);
            connection.connect(function(err) {
                if (err) {
                    console.log('Error connecting to Db');
                    console.log(err);
                    callback(err, null);
                }
                console.log('Connection established');
            });
            callback(null, connection);
        },
        function(conn, callback) {
            connection = conn;
            connection.query('SELECT * FROM temp_orders', function(err, rows) {
                console.log('Data received from Db (1):\n');
                console.log(rows);
                json = rows;
                for (var i = json.length - 1; i >= 0; i--) {
                    // Find a <table> element with id="myTable":
                    var table = document.getElementById("order_table");
                    // Create an empty <tr> element and add it to the 1st position of the table:
                    var row = table.insertRow(1);
                    // Insert new cells (<td> elements) at the 1st and 2nd position of the "new" <tr> element:
                    var cell1 = row.insertCell(0);
                    var cell2 = row.insertCell(1);
                    var cell3 = row.insertCell(2);
                    var cell4 = row.insertCell(3);
                    var cell5 = row.insertCell(4);

                    cell1.innerHTML = i + 1;
                    cell2.innerHTML = json[i].name;
                    cell3.innerHTML = json[i].quantity;
                    cell4.innerHTML = json[i].price;
                    cell5.innerHTML = 'X';
                    cell5.value = json[i].order_no;
                    cell5.onclick = function() {
                        delItem(this.value)
                    };
                }
                callback(null, connection);
            });
        }
    ], function(error, success) {
        if (error) {
            console.log(error);
        }
        console.log(success);
    }

);
// delete item from database
function delItem(index) {
    console.log(index + 'Deleted');
    connection.query(
        'DELETE FROM temp_orders WHERE order_no = ?',
        index,
        function(err, result) {
            if (err) throw err;
            console.log('Deleted ' + result.affectedRows + ' rows');
        }
    );
    window.location.reload();
    return;
}

function printbill() {
    async.waterfall([
        function(callback) {
            var mysql = require('mysql');
            console.log('0');
            connection = mysql.createConnection({
                host: 'localhost',
                user: 'root',
                password: '',
                database: 'resto-man-db'
            });
            callback(null, connection);
        },
        function(conn, callback) {
            connection = conn;
            console.log('first' + connection);
            connection.connect(function(err) {
                if (err) {
                    console.log('Error connecting to Db');
                    console.log(err);
                    callback(err, null);
                }
                console.log('Connection established');
            });
            callback(null, connection);
        },
        function(conn, callback) {
            connection = conn;
            connection.query('select bill_no from bill order by bill_no desc LIMIT 1', function(err, res) {
                //      console.log(res[0].bill_no);
                if(res.length == 0){
                    temp = 1;
                    callback(null, temp);
                }
                else{
                  var temp = res[0].bill_no;
                  temp++;
                  callback(null, temp);
                }
            });
        },
        function(temp, callback) {
            connection.query('select * from temp_orders', function(err, res) {
                callback(null, temp, res);
            });
        },
        function(temp, res, callback) {
            var bno = temp;
            for (var i = 0; i < res.length; i++) {
                var ono = res[i].order_no;
                var name = res[i].name;
                var q = res[i].quantity;
                var p = res[i].price;
                console.log('bc');
                console.log(bno, ono, name, q, p);
                var itementry = {
                    bill_no: bno,
                    order_no: ono,
                    name: name,
                    quantity: q,
                    price: p
                };
                connection.query('INSERT INTO orders SET ?', itementry, function(err, res) {
                    console.log('entry success');
                });
            }
            callback(null, temp);
        },
        function(temp,callback){
          console.log('doifn sum');
          connection.query('select sum(price) from temp_orders',function(err,res){
              var r = res[0]["sum(price)"];
              callback(null,temp,r);
          });
        },
        function (temp,r, callback){
            connection.query('select CURDATE(), CURTIME()',function(err,res){
                  dt = res[0]["CURDATE()"];
                  tt = res[0]["CURTIME()"];
                  callback(null, temp, r, dt, tt);
            });
        },
        function(temp,r,dt,tt,callback){
          console.log("sum is");
          var bno = temp;
          var tot = r;
      //    var date = dt;
          var itementry = {
              bill_no: bno,
              price: tot,
              date : dt,
              time : tt
          };
          connection.query('INSERT INTO bill SET ?', itementry, function(err, res) {
            console.log('bill me');
          });
          callback(null);
        },
        function (callback) {
          table = document.getElementById('order_table');
          while(table.rows.length > 1){
            table.deleteRow(1);
          }
          callback(null);
        },

        function(callback){
          connection.query('delete from temp_orders');
          console.log('deleted temp_orders');
          callback(null);
        }
    ]);
}



function addtomenu() {
    async.waterfall([
            function(callback) {
                var mysql = require('mysql');
                console.log('0');
                connection = mysql.createConnection({
                    host: 'localhost',
                    user: 'root',
                    password: '',
                    database: 'resto-man-db'
                });
                callback(null, connection);
            },
            function(conn, callback) {
                connection = conn;
                console.log('first' + connection);
                connection.connect(function(err) {
                    if (err) {
                        console.log('Error connecting to Db');
                        console.log(err);
                        callback(err, null);
                    }
                    console.log('Connection established');
                });
                callback(null, connection);
            },
            function(ono, callback) {
                var ono;
                connection.query('select order_no from temp_orders order by order_no desc LIMIT 1', function(err, res) {
                    //var temp = res[0].order_no;
                    console.log(res)
                    if (res.length == 0) {
                        ono = 1;
                    } else {
                        ono = res[0].order_no + 1;
                    }
                    callback(null, ono);
                });
            },

            function(ono, callback) {
                var vname = document.getElementById("name").value;
                var vquant = document.getElementById("quantity").value;
                connection.query('select price from menu where name = ? ', vname, function(err, res) {
                    var p = vquant * res[0].price;
                    var itementry = {
                        order_no: ono,
                        name: vname,
                        quantity: vquant,
                        price: p
                    };
                    var updateitem = {
                        name: vname,
                        quantity: vquant,
                        price: p
                    };
                    connection.query('INSERT INTO temp_orders SET ? ON DUPLICATE KEY UPDATE ?', [itementry, updateitem], function(err, res) {
                        console.log("success");
                        connection.query('select * from temp_orders', function(err, res) {
                            console.log("Wow");
                            window.location.reload();
                        });
                    });
                });
            }
        ], function(error, success) {
            if (error) {
                console.log(error);
            }
            console.log(success);
        }

    );
}
