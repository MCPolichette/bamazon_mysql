// var mysql = require("mysql");
// var inquirer = require("inquirer");
// var columnify = require('columnify');


// // amount of characters that form the width of the content box:
// boxWidth = 65;

// var connection = mysql.createConnection({
//     host: "localhost",

//     // Your port; if not 3306
//     port: 3307,

//     // Your username
//     user: "root",

//     // Your password
//     password: "root",
//     database: "bamazon_DB"
// });

// connection.connect(function (err) {
//     if (err) throw err;

//     console.log("\n===========================  Welcome to  ========================\n    \n    BBBBB     AA    MM     MM    AA    ZZZZZZ  OOOO   NN   NN\n    BB  BB   AAAA   MMM   MMM   AAAA      ZZ  OO  OO  NNN  NN\n    BBBBB   AA  AA  MMMM MMMM  AA  AA    ZZ   OO  OO  NNNN NN\n    BB  BB  AAAAAA  MM MMM MM  AAAAAA   ZZ    OO  OO  NN NNNN\n    BBBBBB  AA  AA  MM  M  MM  AA  AA  ZZZZZZ  OOOO   NN  NNN \n    ");
//     console.log("=================================================================")
//     console.log("    You are connected to BAMAZON_DB as an inventory Manager number " + connection.threadId + "\n\n");
//     start();
// })
// function start() {
//     console.log("start function")
//     var columns = columnify(resultsults);
//     console.log(columns)
// }

var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 330y,
    user: "root",
    password: "root",
    database: "bamazon_DB"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("\n");
    console.log("************************************ BAMAZON MANAGER VIEW **************************************************")
    console.log("You are connected to bamazonDB as a Bamazon Manager id: " + connection.threadId);
    managerSearch();
});

function managerSearch() {
    inquirer
        .prompt({
            name: "action",
            type: "list",
            message: "What would you like to do?",
            choices: ["Find products for sale on Bamazon", "View products with low inventory", "Return products back into inventory", "Add a new product",],
        })
        .then(function (answer) {
            switch (answer.action) {
                case "Find products for sale on Bamazon":
                    displayInventory();
                    break;

                case "View products with low inventory":
                    inventoryView();
                    break;

                case "Return products back into inventory":
                    returnItem();
                    break;

                case "Add a new product":
                    addProduct();
                    break;
            }
        });
}

// DISPLAY INVENTORY FUNCTION:
function displayInventory() {
    // console.log("Product Search View");
    connection.query("SELECT * FROM Products ", function (err, results) {
        if (err) throw err;
        console.log("\n");
        console.log("                            CURRENT BAMAZON PRODUCTS                                    ");
        console.log("****************************************************************************************");
        for (var i = 0; i < results.length; i++) {
            console.log("id: " + results[i].id + " || " + results[i].item_name + " || Price: " + results[i].item_price + " ea." + " || Qty in Stock: " + results[i].stock_qty);
        }
        console.log("****************************************************************************************");
        console.log("\n");
    });
    connection.end();
}

//   LOW INVENTORY FUNCTION:
function inventoryView() {
    // console.log("Low Inventory View");
    var query = "SELECT * FROM Products WHERE stock_qty < 25";
    connection.query(query, function (err, results) {
        if (err) throw err;
        console.log("\n");
        console.log("                            LOW INVENTORY ON BAMAZON                                  ");
        console.log("****************************************************************************************");
        for (var i = 0; i < results.length; i++) {
            console.log("id: " + results[i].id + " || " + results[i].item_name + " || Price: " + results[i].item_price + " ea." + " || Qty in Stock: " + results[i].stock_qty);
        }
        console.log("****************************************************************************************");
        console.log("\n");
    });
    connection.end();
}

// RETURN ITEM FUNCTION:
function returnItem() {
    console.log("Return Item View");
}

// ADD PRODUCT FUNCTION:
function addProduct() {
    console.log("Add Product View");
    inquirer.prompt([
        {
            type: "input",
            name: "item",
            message: "What is the name of the new product?"
        },
        {
            type: "input",
            name: "department",
            message: "What department does the new product belong to?",
        },
        {
            type: "input",
            name: "price",
            message: "What is the price per unit?"
            // validate: 
        },
        {
            type: "input",
            name: "stock_qty",
            message: "How many items are being added to inventory?"
            // validate:
        }]).then(function (input) {
            console.log('Adding new Item: \n item_name = ' + input.product_name + '\n' + 'price = ' + input.product.price + '\n' + ' stock_qty = ' + input.stock_qty);

            var query = 'INSERT INTO Product SET ?';
            connection.query(query, input, function (err, results) {
                if (err) throw err;
                console.log("test adding new item");
            });
        })
}
