//function Estabilish connection to database
var async = require('async');
let connection;
estcon();
//Estabilish connection to database
function estcon(){
  var mysql      = require('mysql');
  connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'resto-man-db'
  });
}

// estabilises connection from sql
connection.connect(function(err){
  if(err){
    console.log('Error connecting to Db');
    return;
  }
  console.log('Connection established');
});

// calls query
connection.query('SELECT * FROM bill order by bill_no desc',function(err,rows){
  if(err) throw err;
// Fetch to console
  console.log('Data received from Db:\n');
  console.log(rows);
// Print row to table
  printtable(rows,"myTable", 0);
});

function printOrderTable(bill_no){
  async.waterfall([
    function (callback){
      table = document.getElementById("orderTable");
      while(table.rows.length > 1) {
        table.deleteRow(1);
      }
      callback(null);
    },
    function(callback){
  document.getElementById("bns").innerHTML=bill_no;
  connection.query('SELECT * FROM orders WHERE bill_no = ?', bill_no, function(err, res){
    var json=res;
    for (var i = json.length-1 ; i >= 0; i--) {
      // Find a <table> element with id="myTable":
      var table = document.getElementById("orderTable");
      // Create an empty <tr> element and add it to the 1st position of the table:
      var row = table.insertRow(1);
      // Insert new cells (<td> elements) at the 1st and 2nd position of the "new" <tr> element:
      var cell1 = row.insertCell(0);
      var cell2 = row.insertCell(1);
      var cell3 = row.insertCell(2);
      var cell4 = row.insertCell(3);
      // Add some text to the new cells:
      cell1.innerHTML = i+1;
      cell2.innerHTML = json[i].name;
      cell3.innerHTML = json[i].quantity;
      cell4.innerHTML = json[i].price;
    }
      callback(null);
  });
}
]);
}

function printtable(json, tablename, subtype){
  console.log(subtype);
      for (var i = json.length-1 ; i >= 0; i--) {
        // Find a <table> element with id="myTable":
        var table = document.getElementById(tablename);
        // Create an empty <tr> element and add it to the 1st position of the table:
        var row = table.insertRow(1);
        // Insert new cells (<td> elements) at the 1st and 2nd position of the "new" <tr> element:
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
        var cell4 = row.insertCell(3);
        // Add some text to the new cells:
        cell1.innerHTML = json[i].bill_no;
        cell1.onclick = function(){printOrderTable(this.innerHTML)};
        if(subtype==0 || subtype==1){
          cell2.innerHTML = json[i].price;
          cell3.innerHTML = (json[i].date).toDateString();
          cell4.innerHTML = json[i].time;
          document.getElementById('col2').innerHTML = "Price";
          document.getElementById('col3').innerHTML = "Date";
          document.getElementById('col4').innerHTML = "Time";
        }
        else if (subtype==2) {
          cell2.innerHTML = json[i].name;
          cell3.innerHTML = json[i].price;
          cell4.innerHTML = (json[i].date).toDateString();
          document.getElementById('col2').innerHTML = "Item";
          document.getElementById('col3').innerHTML = "Price";
          document.getElementById('col4').innerHTML = "Date";
        }
    }
}

function gsbill(){
  async.waterfall([
    function(callback){
      table = document.getElementById("stable");
      while(table.rows.length > 1) {
        table.deleteRow(1);
      }
      // window.location.reload();
      callback(null);
    },
    function(callback){
      //(new Date()).toISOString().substring(0, 10) //2015-07-23
      var srd = document.getElementById('startdate').value;
      var std = document.getElementById('stopdate').value;
      var cat = document.getElementById('category').value;
      if(cat == "all"){
        connection.query('select * from bill where date between ? and ?', [srd, std], function(err, row){
          if(err) console.log("err"+err);
          printtable(row, "stable", 1);
          callback(null);
        });
      }
      else{

         connection.query('select * from orders inner join menu on orders.name=menu.name where category= ? and bill_no in (select bill_no from bill where date between ? and ? );', [cat, srd, std], function(err, row){
           if(err) console.log("err"+err);
           console.log("here");
           printtable(row, "stable", 2);
           callback(null);
         });
      }
    }
  ]);
}

// terminates connection
function endcon(){
  connection.end();
}
