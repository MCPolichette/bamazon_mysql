var mysql = require("mysql");
var inquirer = require("inquirer");
var columnify = require('columnify');


// amount of characters that form the width of the content box:
boxWidth = 65;

var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3307,

    // Your username
    user: "root",

    // Your password
    password: "root",
    database: "bamazon_DB"
});

connection.connect(function (err) {
    if (err) throw err;

    console.log("\n===========================  Welcome to  ========================\n    \n    BBBBB     AA    MM     MM    AA    ZZZZZZ  OOOO   NN   NN\n    BB  BB   AAAA   MMM   MMM   AAAA      ZZ  OO  OO  NNN  NN\n    BBBBB   AA  AA  MMMM MMMM  AA  AA    ZZ   OO  OO  NNNN NN\n    BB  BB  AAAAAA  MM MMM MM  AAAAAA   ZZ    OO  OO  NN NNNN\n    BBBBBB  AA  AA  MM  M  MM  AA  AA  ZZZZZZ  OOOO   NN  NNN \n    ");
    console.log("=================================================================")
    console.log("    You are connected to BAMAZON_DB as guest: " + connection.threadId + "\n\n");
    start();
});
function start() {
    connection.query("SELECT * FROM Products", function (err, results) {
        if (err) throw err;

        var columns = columnify(results);
        console.log(columns)
        connection.end();
    })
}





