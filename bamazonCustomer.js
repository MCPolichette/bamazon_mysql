var mysql = require("mysql");
var inquirer = require("inquirer");
// console table packages:
const cTable = require('console.table');
var columnify = require('columnify');
var shopping_cart = [];
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
                item_price: {
                    align: 'right'
                },
                stock_qty: {
                    align: 'right'
                }
            },
        });
        console.log(columns + "\n**********************************************************************************************\n"
        )

        shopping();
    })
};
// shopping function lets user add items to their shopping cart. at the end.  prompts them to continue, or checkout
function shopping() {
    connection.query("SELECT * FROM Products", function (err, results) {
        if (err) throw err;

        console.log("You have " + shopping_cart.length + " items in your shopping cart")

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
        },
        {
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
            //  console.log(chosenItem)

            // May come back to this point and attempt to make a new REPEATABLE function to clean up and validate inputs
            if (chosenItem.stock_qty < answer.cart_qty) {
                console.log("Sorry, We only have " + chosenItem.stock_qty + " in stock.\nPlease adjust your qty:");
                inquirer.prompt([{
                    name: "new_cart_qty",
                    type: "input",
                    message: "How many would you like to add to your cart?"
                }]).then(function (new_answer) {
                    // console.log(new_answer);
                    chosenItem.cart = new_answer.new_cart_qty;
                    chosenItem.total_price = new_answer.new_cart_qty * chosenItem.item_price
                })
                shopping_cart.push(chosenItem);
                continue_prompt();
            } else chosenItem.cart = answer.cart_qty;
            shopping_cart.push(chosenItem);
            console.log("shopping cart" + shopping_cart);
            continue_prompt();
        }
        )
    }
    )
};
function shopping_cart_function() {
    console.log("\n\n###################################################\n##                                               ##                             \n##            -\______    SHOPPING               ##\n##             -\_____|     CART                 ##     \n##               o---o    CONTENTS :             ##\n##                                               ##  \n###################################################")
    console.log("shoppingcart")
    // var table = cTable.shopping_cart
    // console.table
    column = columnify(shopping_cart, {
        columns: [item_name, department_name, item_price, cart, total_price],
        config: [{
            item_price: {
                align: right
            }
        }]
    })
    console.log(column);
    connection.end();
};

function continue_prompt() {
    inquirer.prompt([{
        name: "continue",
        type: "list",
        message: "What would you like to do next?",
        choices: ["Continue Shopping", "Check Out / See my Shopping Cart"],
    }]).then(function (answer) {
        switch (answer.action) {
            case "Continue Shopping":
                shopping();
                break;
            case "Check Out / See my Shopping Cart":
                shopping_cart_function();
                break;
        }
    })
}
// Customer'spurchases::
// connection.query(
//     "UPDATE auctions SET ? WHERE ?", [{
//         highest_bid: answer.bid
//     },
//     {
//         id: chosenItem.id
//     }
//     ],
//     function (error) {
//         if (error) throw err;
//         console.log("Bid placed successfully!");
//         start();
//     }
// );
