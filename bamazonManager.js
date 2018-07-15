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
    console.log("    You are connected to BAMAZON_DB as an inventory Manager number " + connection.threadId + "\n\n");
    start();
})

function start() {
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
    connection.query("SELECT * FROM Products", function (err, results) {
        if (err) throw err;
        server = results;
        // dress up columnify to align prices and  quantity integers on the right.
        var columns = columnify(results, {
            config: {
                item_price: {
                    align: 'right'
                },
                stock_qty: {
                    align: 'right'
                }
            },
        });
        console.log(columns + "\n-----------------------------------------------------------------\n")
        continue_working();
    })
}
//   LOW INVENTORY FUNCTION:
function inventoryView() {
    // console.log("Low Inventory View");
    var query = "SELECT * FROM Products WHERE stock_qty < 25";
    connection.query(query, function (err, results) {
        if (err) throw err;
        console.log("\n");
        console.log("                    LOW INVENTORY ON BAMAZON                 ");
        console.log("*************************************************************");
        var columns = columnify(results, {
            config: {
                item_price: {
                    align: 'right'
                },
                stock_qty: {
                    align: 'right'
                }
            },
        });
        console.log(columns + "\n-----------------------------------------------------------------\n");
        continue_working();
    });
}

// RETURN ITEM FUNCTION:
function returnItem() {
    console.log("Return Item View");
    connection.query("SELECT * FROM Products", function (err, results) {
        if (err) throw err;

        inquirer.prompt([{
            name: "item",
            type: "list",
            message: "Which product would you like to return?",
            choices: function () {

                var item_array = [];
                for (var i = 0; i < results.length; i++) {
                    item_array.push(results[i].item_name);
                }
                return item_array;
            }
        }, {
            name: "return_qty",
            type: "input",
            message: "How many would you like to return?"
        }]).then(function (answer) {
            var chosenItem;
            for (var i = 0; i < results.length; i++) {
                // console.log(results[i]);
                if (results[i].item_name === answer.item) {
                    chosenItem = results[i];
                }
            }
            // Takes new object and creates new variables for it.
            chosenItem.return = answer.return_qty;
            chosenItem.total_price = answer.return_qty * chosenItem.item_price
            adjust_inventory(chosenItem);
            continue_working();
        })
    })
};

// ADD PRODUCT FUNCTION:
function addProduct() {
    console.log("Add Product View");
    inquirer.prompt([
        {
            type: "input",
            name: "item",
            message: "What is the name of the new product?"
        }, {
            type: "input",
            name: "department",
            message: "What department does the new product belong to?",
        }, {
            type: "input",
            name: "price",
            message: "What is the price per unit?"
            // validate: 
        }, {
            type: "input",
            name: "stock_qty",
            message: "How many items are being added to inventory?"
            // validate:
        }]).then(function (input) {
            console.log('Adding new Item: \n item_name = ' + input.product_name + '\n' + 'price = ' + input.product.price + '\n' + ' stock_qty = ' + input.stock_qty);

            connection.query(query, input, function (err, results) {
                var query = 'INSERT INTO Product SET ?';
                if (err) throw err;
                console.log("test adding new item");
            });
        })
    continue_working();
}

function adjust_inventory(chosenItem) {
    chosenItem.total_price = chosenItem.return * chosenItem.item_price
    // confirm purchase with a printout
    console.log("#################################################################\n");
    // console.log(chosenItem)
    console.log("\n\n  RETURNING " + chosenItem.item_name + " x " + chosenItem.return + " For a grand total of $" + chosenItem.total_price + "\n");
    console.log("#################################################################\n")

    console.log("Return Confirmed!\n")
    difference = chosenItem.stock_qty + chosenItem.return
    connection.query(
        "UPDATE Products SET ? WHERE ?", [{
            stock_qty: difference
        },
        {
            id: chosenItem.id
        }],
        function (error) {
            if (error) throw error;
            console.log("Return Complete");
            var columns = columnify(chosenItem, {
                config: {
                    item_price: {
                        align: 'right'
                    },
                    stock_qty: {
                        align: 'right'
                    }
                },
            })
            continue_working()
        }
    )
}
// } else if (!answer.return) {




function continue_working() {
    inquirer.prompt([{
        name: "start_over",
        type: "confirm",
        message: "Would you like to do something else??",
    }]).then(function (answer) {
        if (answer.start_over) {
            start();
        } else {
            console.log("\n=================================================================\n\n        GGGGG   OOOO   OOOO  DDDDD     BBBBB  YY  YY EEEEE  \n       GG      OO  OO OO  OO DD  DD    BB  BB  YYYY  EE     \n       GG  GGG OO  OO OO  OO DD   DD   BBBBB    YY   EEEE   \n       GG   GG OO  OO OO  OO DD   DD   BB  BB   YY   EE     \n        GGGGG   OOOO   OOOO  DDDDDD    BBBBBB   YY   EEEEEE \n      \n===================  Thanks for visiting =========================")
            connection.end();
        }
    })
}
