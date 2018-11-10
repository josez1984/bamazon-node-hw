var inquirer = require('inquirer');
var mysql = require('mysql');

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "bamazon"
});

function validate(value, validIds, itemsReal) {
    var pass = validateInputNumeric(value);
    if(pass !== true) {
        return pass;
    }

    pass = isIdValid(value, validIds);
    if(pass !== true) {
        return pass;
    } 

    for(var i = 0; i < itemsReal.length; i++) {
        if(value == itemsReal[i].item_id) {
            if(itemsReal[i].stock_quantity < 1) {
                return 'There is no stock left for this product';
            }            
        }
    } 

    return true;
}

function isIdValid(id, validIds) {    
    for(var i = 0; i < validIds.length; i++) {        
        if(validIds[i] == id) {
            return true;
        }
    }
    return 'Please enter a valid ID';
}

function validateInputNumeric(value) {
    if(value) {
        if(isNaN(value)){
            return 'Please Enter a number';
        }else{
            return true;
        }
    }
    return 'Please enter a value';
}

function validateQuantity(value, item_id, items) {
    var pass = validateInputNumeric(value);
    if(pass !== true) {
        return pass;
    }

    var currentQuantity = items[item_id];
    if(currentQuantity < value) {
        return 'There is not enough stock. Available: ' + currentQuantity;
    }
    return true;
}

function startShopping() {
        var query = connection.query(
            `SELECT * FROM products`,
            {},
            function(err, res) {
                var itemsReal = res;
                var validIds = [];
                var items = {};
                var itemString = 'ID | Product Information\n';
                itemString = itemString + '-----------------------------------------';
                console.log(itemString);
                for(var i = 0; i < res.length; i++) {
                    console.log(res[i].item_id + ' | ' + res[i].product_name + ', $' + res[i].price + ', ' + res[i].stock_quantity);                
                    validIds.push(res[i].item_id);
                    items[res[i].item_id] = res[i].stock_quantity; 
                }             
                console.log('\n');
                inquirer.prompt([
                    {
                        type: "input",
                        message: "Enter the 'Product ID' of the item you'd like to purchase",
                        name: "product_id",
                        validate: function(value) {
                            return validate(value, validIds, itemsReal);                        
                        }
                    }      
                ]).then(function(res){       
                    var item_id = res.product_id;
                    inquirer.prompt([
                        {
                            type: "input",
                            message: "How many units are you purchasing?",
                            name: "quantity",
                            validate: function(value) {                        
                                return validateQuantity(value, item_id, items);                            
                            }                    }      
                    ]).then(function(res){                           
                        console.log('We are processing your order... Please hold...')
                        var intervalId = setInterval(function(){
                            console.log('.');
                        }, 25);                    
                        var price = 0;
                        var name = '';
                        var quantity = res.quantity;
                        for(var i = 0; i < itemsReal.length; i++) {
                            if(itemsReal[i].item_id == item_id) {
                                price = itemsReal[i].price;
                                name = itemsReal[i].product_name;
                                break;
                            }
                        }       
                        var total = quantity * price;

                        var query = connection.query(
                            `UPDATE products SET stock_quantity = stock_quantity - ${res.quantity}`,
                            {},
                            function(err, res) {
                                clearInterval(intervalId);
                                if(err) throw err
                                else {                                    
                                    console.log("Your order has been placed.");
                                    console.log("Product: " + name);
                                    console.log("Quantity: " + quantity);
                                    console.log("Price (each): $" + price);
                                    console.log("Total: $" + total);
                                    console.log("Thanks for shopping with us.");                    
                                    

                                    inquirer.prompt([{
                                        type: "confirm",
                                        message: "Do you want to continue shopping",
                                        name: "confirm",
                                        default: true                }      
                                    ]).then(function(res){
                                        if(res.confirm === true) {
                                            startShopping();
                                        } else {
                                            connection.end();                                        
                                        }
                                    });
                                }
                            }
                        );
                    });    
                }
            );
        });
}

connection.connect(function(err) {
    startShopping();
});
