//function Estabilish connection to database
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
connection.query('SELECT * FROM menu',function(err,rows){
  if(err) throw err;
// Fetch to console
  console.log('Data received from Db:\n');
  console.log(rows);
// Print row to table
  printtable(rows);
});

function printtable(json){
  for (var i = json.length-1 ; i >= 0; i--) {
    // Find a <table> element with id="myTable":
    var table = document.getElementById("myTable");
    // Create an empty <tr> element and add it to the 1st position of the table:
    var row = table.insertRow(1);
    // Insert new cells (<td> elements) at the 1st and 2nd position of the "new" <tr> element:
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    // Add some text to the new cells:
    cell1.innerHTML = json[i].item_code;
    cell2.innerHTML = json[i].name;
    cell3.innerHTML = json[i].price;
  }
}

// Add a new item to menu
function addtomenu(){
  //Estabilish connection
  estcon();
  // get values from form
  var vitem_code = document.getElementById("item_code").value;
  var vname = document.getElementById("name").value;
  var vprice = document.getElementById("price").value;
  var itementry = { item_code: vitem_code, name: vname, price: vprice };
  var q = connection.query('INSERT INTO menu SET ?', itementry, function(err,res){
  if(err) throw err;
    console.log('Last insert ID:', res.insertId);
    connection.query('SELECT * FROM menu',function(err,rows){
      if(err) throw err;
    // Fetch to console
      console.log('Data received from Db:\n');
      console.log(rows);
    // Print row to table
      printtable(rows);
    });
  });
  return;
}

// terminates connection
connection.end();
