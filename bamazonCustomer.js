var mysql = require("mysql");
var inquirer = require("inquirer");
// console table packages:
const cTable = require('console.table');
var columnify = require('columnify');
var server = [];
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
        server = results;
        // dress up columnify to align prices and  quantity integers on the right.
        var columns = columnify(results, {
            config: {
                id: {
                    align: 'center'
                },
                item_price: {
                    align: 'right'
                },
                stock_qty: {
                    align: 'right'
                }
            },
        });
        console.log(columns + "\n-----------------------------------------------------------------\n")
        shopping();
    })
};
// shopping function lets user add items to their shopping cart. at the end.  prompts them to continue, or checkout
function shopping() {
    connection.query("SELECT * FROM Products", function (err, results) {
        if (err) throw err;

        inquirer.prompt([{
            name: "item",
            type: "list",
            message: "What Item would you like to purchase?",
            choices: function () {

                var item_array = [];
                for (var i = 0; i < results.length; i++) {
                    item_array.push(results[i].item_name);
                }
                return item_array;
            }
        }, {
            name: "cart_qty",
            type: "input",
            message: "How many would you like to add to your cart?"
        }]).then(function (answer) {
            var chosenItem;
            for (var i = 0; i < results.length; i++) {
                // console.log(results[i]);
                if (results[i].item_name === answer.item) {
                    chosenItem = results[i];
                }
            }
            // Takes new object and creates new variables for it.
            chosenItem.cart = answer.cart_qty;
            chosenItem.total_price = answer.cart_qty * chosenItem.item_price
            confirm_purchase(chosenItem);
        })
    })
};
function confirm_purchase(chosenItem) {
    if (chosenItem.cart < 0) {
        console.log("You cannot purchase negative quantities.\n  Please retry your order\n\n")
        inquirer.prompt([{
            name: "new_cart_qty",
            type: "input",
            message: "How many would you like to order?"
        }]).then(function (answer) {
            // console.log(answer);
            chosenItem.cart = answer.new_cart_qty;
            console.log(chosenItem)
            confirm_purchase(chosenItem);
        })
    } else if (chosenItem.stock_qty < chosenItem.cart) {
        console.log("Sorry, We only have " + chosenItem.stock_qty + " in stock.\nPlease adjust your qty:");
        inquirer.prompt([{
            name: "new_cart_qty",
            type: "input",
            message: "How many would you like to add to your cart?"
        }]).then(function (answer) {
            // console.log(answer);
            chosenItem.cart = answer.new_cart_qty;

            confirm_purchase(chosenItem);
        })
    } else if (chosenItem.stock_qty >= chosenItem.cart) {
        chosenItem.total_price = chosenItem.cart * chosenItem.item_price
        console.log("\n\n#################################################################\n##                                                             ##\n##                  ______7 -     SHOPPING                     ##\n##                 |_____/ --      CART                        ##\n##                  o---o ---     CONTENTS :                   ##\n##                                                             ##\n#################################################################\n\n"
            + chosenItem.item_name + " x " + chosenItem.cart + " For a grand total of $" + chosenItem.total_price + "\n");
        console.log("#################################################################\n")
        // confirm purchase with a printout
        inquirer.prompt([{
            name: "purchase",
            type: "confirm",
            message: "are you ready to purchase?",
        }]).then(function (answer) {
            if (answer.purchase) {
                //    adjust inventory and restart the computer.
                console.log("Purchase Confirmed!\n")
                difference = chosenItem.stock_qty - chosenItem.cart
                connection.query(
                    "UPDATE Products SET ? WHERE ?", [{
                        stock_qty: difference
                    },
                    {
                        id: chosenItem.id
                    }],
                    function (error) {
                        if (error) throw error;
                        console.log("Purchase Complete");
                        start();
                    });
            } else {
                inquirer.prompt([{
                    name: "start_over",
                    type: "confirm",
                    message: "Would you like to purchase something else??",
                }]).then(function (answer) {
                    if (answer.start_over) {
                        start();
                    } else {
                        console.log("\n=================================================================\n\n        GGGGG   OOOO   OOOO  DDDDD     BBBBB  YY  YY EEEEE  \n       GG      OO  OO OO  OO DD  DD    BB  BB  YYYY  EE     \n       GG  GGG OO  OO OO  OO DD   DD   BBBBB    YY   EEEE   \n       GG   GG OO  OO OO  OO DD   DD   BB  BB   YY   EE     \n        GGGGG   OOOO   OOOO  DDDDDD    BBBBBB   YY   EEEEEE \n      \n===================  Thanks for visiting =========================")
                        connection.end();
                    }
                })
            };
        })
    };
};


