var async = require('async');
let connection;
var incc = 0;
var vorder_no = 0;

document.getElementById('namelist').innerHTML = "uno<option>Tea</option>	<option>Tea Special</option>	<option>Coffee</option>	<option>Milk</option>	<option>Butter Milk</option>	<option>Limboo Sharbat</option>	<option>Cold Coffee</option>	<option>Rose</option>	<option>Mango</option>	<option>Vanilla</option>	<option>Badam Thandai</option>	<option>Butterscotch</option>	<option>Anjeer</option>	<option>Straberry</option>	<option>Chikoo</option>	<option>Apple</option>	<option>Cold Chocolate</option>	<option>Orange</option>	<option>Mosabi</option>	<option>Pineapple</option>	<option>Watermelon</option>	<option>Tomato Soup</option>	<option>Veg Soup</option>	<option>Gajar Soup</option>	<option>Plain Maggi</option>	<option>Masala Maggi</option>	<option>Egg Maggi</option>	<option>Cheese Maggi</option>	<option>Egg Chesse Maggi</option>	<option>Masala Cheese Maggi</option>	<option>Boil Eggs 1</option>	<option>Boil Eggs 2</option>	<option>Omlet (2 Eggs and 2 Bread</option>	<option>Bhurji (2 Eggs and 2 Brea</option>	<option>Extra slice</option>	<option>Parle G Biscuits</option>	<option>Cream Roll</option>	<option>Pattice</option>	<option>Pani Puri (6 pcs)</option>	<option>Dry Masala Puri (6 pcs)</option>	<option>Oli Bhel</option>	<option>Shev Puri (6 pcs)</option>	<option>Dahi Puri (6 pcs)</option>	<option>Samosa Chaat</option>	<option>Alu Tikki Chaat</option>	<option>Veg Sandwich</option>	<option>Grill Sandwich</option>	<option>Cheese Sandwich</option>	<option>Cheese Grill Sandwich</option>	<option>Mayonnaise Sandwich</option>	<option>Samosa</option>	<option>Vada Pav</option>	<option>Pohe</option>	<option>Upma</option>	<option>Bread Pattice/ Roll</option>	<option>Idli Sambar</option>	<option>Medu Wada Sambar</option>	<option>Plain Dosa</option>	<option>Masala Dosa</option>	<option>Onion Uttapa</option>	<option>Misal Pav</option>	<option>Pav Bhaji</option>	<option>Chole Bature</option>	<option>Alu Paratha</option>	<option>Gobi Paratha</option>	<option>Methi Paratha</option>	<option>Paneer Paratha</option>	<option>Veg Biryani</option>	<option>Pulao</option>	<option>Masala Rice</option>	<option>Egg Biryani</option>	<option>Puri Bhaji (5 Puri)</option>	<option>Veg Roll</option>	<option>Aloo Roll</option>	<option>Cheese Roll</option>	<option>Paneer Roll</option>	<option>Cheese Paneer Roll</option>	<option>Egg Roll</option>	<option>Egg Paneer Roll</option>	<option>Double Egg Cheese Roll</option>	<option>Double Egg Roll</option>	<option>Aloo Cheese Roll</option>	<option>Veg Fried Rice</option>	<option>Manchurian Fried Rice</option>	<option>Shejhwan Fried Rice</option>	<option>Veg Shejhwan Noodles</option>	<option>Veg Manchurian Noodles</option>	<option>Veg Tripple Noodles</option>	<option>Manchurian Dry</option>	<option>Manchurian Gravy</option>	<option>Egg Fried Rice</option>";

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
                var sum = 0;
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
                    sum += json[i].price;
                    cell5.innerHTML = 'X';
                    cell5.value = json[i].order_no;
                    cell5.onclick = function() {
                        delItem(this.value)
                    };
                }
                document.getElementById("totam").innerHTML = sum;
                callback(null);
            });
        },
        function(callback){
          connection.query('select bill_no from bill order by bill_no desc limit 1', function(err, res){
            console.log(res[0].bill_no);
            callback(null, res[0].bill_no);
          });
        },
        function(prev_bill_no, callback){
            document.getElementById("prev_bill").style.display = "block";
          connection.query('SELECT * FROM orders WHERE bill_no = ?', prev_bill_no, function(err, rows) {
              console.log('last bill det:\n');
              console.log(rows);
              json = rows;
              for (var i = json.length - 1; i >= 0; i--) {
                  // Find a <table> element with id="myTable":
                  var table = document.getElementById("prev_bill");
                  // Create an empty <tr> element and add it to the 1st position of the table:
                  var row = table.insertRow(1);
                  // Insert new cells (<td> elements) at the 1st and 2nd position of the "new" <tr> element:
                  var cell1 = row.insertCell(0);
                  var cell2 = row.insertCell(1);
                  var cell3 = row.insertCell(2);
                  var cell4 = row.insertCell(3);

                  cell1.innerHTML = i + 1;
                  cell2.innerHTML = json[i].name;
                  cell3.innerHTML = json[i].quantity;
                  cell4.innerHTML = json[i].price;
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
        function (temp,res, callback){
            connection.query('select CURDATE(), CURTIME()',function(err,rt){
                  dt = rt[0]["CURDATE()"];
                  tt = rt[0]["CURTIME()"];
                  callback(null, temp, res, dt, tt);
            });
        },
        function(temp, res, dt, tt, callback) {
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
                    price: p,
                    date:dt
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
        function (callback) {
          table = document.getElementById('prev_bill');
          while(table.rows.length > 1){
            table.deleteRow(1);
          }
          callback(null);
        },

        function(callback){
          document.getElementById("prev_bill").style.display = "block";
          connection.query('SELECT * FROM temp_orders', function(err, rows) {
              console.log('Data received from Db (1):\n');
              console.log(rows);
              json = rows;
              for (var i = json.length - 1; i >= 0; i--) {
                  // Find a <table> element with id="myTable":
                  var table = document.getElementById("prev_bill");
                  // Create an empty <tr> element and add it to the 1st position of the table:
                  var row = table.insertRow(1);
                  // Insert new cells (<td> elements) at the 1st and 2nd position of the "new" <tr> element:
                  var cell1 = row.insertCell(0);
                  var cell2 = row.insertCell(1);
                  var cell3 = row.insertCell(2);
                  var cell4 = row.insertCell(3);

                  cell1.innerHTML = i + 1;
                  cell2.innerHTML = json[i].name;
                  cell3.innerHTML = json[i].quantity;
                  cell4.innerHTML = json[i].price;
              }
              callback(null, connection);
          });
          console.log('last bill print');
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
