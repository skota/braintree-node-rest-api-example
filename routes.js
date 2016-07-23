"use strict"

var express = require("express");
var router = express.Router();
var _ = require('lodash');
var util = require('util'),
    braintree = require('braintree');

//configure and load barintree gateway object
var braintree = require("./lib/bt.js");


// begin end points--------------------
//---use this client token when attempting to toeknise credit cards from the front end
router.get("/client_token", function (req, res) {
  braintree.clientToken.generate({}, function (err, response) {
    res.status(200).send(response.clientToken);
  });
});


// end point to create  new customer
router.post('/customer', function(req, res) {
	//validate that required data is present...
	var fName = req.body.fname || undefined,
		lName = req.body.lname  || undefined,
		cardNonce = req.body.paymentmethodnonce || undefined; 

	if (fName === undefined || lName === undefined || cardNonce === undefined)	{
		res.status(400).json({'Error': 'Some patameters are missing. All parameters are required'});			
	}

	braintree.customer.create({
		  	firstName: fName,
		  	lastName: lName,
		  	paymentMethodNonce: cardNonce,
		}, function (err, result) {
		  if (result.success) {
		  	res.status(201).json({'customerId': result.customer.id});	
		  } else {
		  	res.status(200).json({'error': err});		
		  }
	});	
});


// transactions endpoints -- 1- sale
router.post('/sale', function(req,res) {
	var token 		= req.body.token || undefined,
		amount 		= req.body.amount  || undefined,
		settleNow 	= req.body.settlement || true; 

	if ( token === undefined || amount === undefined  )	 {
		res.status(400).json({'Error': 'Some patameters are missing. All parameters are required'});			
	}	return -1;

	braintree.transaction.sale({
  		amount: amount,
  		paymentMethodToken: token,
  		options: {
    		submitForSettlement: settleNow
  			}
		}, function (err, result) {
			if (result.success) {
				var transactionId = result.transaction.id,
                	transactionStatus = result.transaction.status;

 				res.status(201).json({'transactionId': transactionId, "status":transactionStatus});			
			} else {
				res.status(200).json({'Error': 'Oh no...Something went wrong....'});						
			}
		});
});

// 2- settle transaction
router.get('/settle/:transactionId', function(req, res) {
	var transactionId 	= req.body.transactionId || undefined,
		amount 			= req.body.amount  || undefined; 
	
	if (transactionId === undefined ) {
		res.status(400).json({'Error': 'Transaction id  is missing.'});
		return;			
	}	

	// amount is optional...if not provided...amount authorized is settled....

	// only authorized transactions can be submitted for settlement
	// settlement amount cannot be greater than authorized amount -  check for this
	// also check for invalid transaction id 
	braintree.transaction.submitForSettlement( transactionId, amount, function (err, result) {
	
	});

	// if (result.success || result.transaction) {
 //      res.redirect('checkouts/' + result.transaction.id);
 //    } else {
 //      transactionErrors = result.errors.deepErrors();
 //      req.flash('error', {msg: formatErrors(transactionErrors)});
 //      res.redirect('checkouts/new');
 //    }
});

// 3 - refund transaction
router.get('/refund/:transactionId', function(req, res) {
	var transactionId 	= req.params.transactionId || undefined;

	if(transactionId === undefined) {
		res.status(400).json({'Error': 'Transaction id is missing.'});
		return;
	}

	braintree.transaction.refund(transactionId, function (err, result) {
		if (result.success) {
		  res.status(200).json({"Success": "Refunded successfully"});
		} else {
		  res.status(200).json({"Error": result.message});
		}	
	});
});


// 4 - void transaction
router.get('/void/:transactionId', function(req, res) {
	var transactionId 	= req.params.transactionId;

	if(transactionId === undefined) {
		res.status(400).json({'Error': 'Transaction id is missing.'});
		return;
	}

	braintree.transaction.void(transactionId, function (err, result) {
		if (result.success) {
		  res.status(200).json({"Success": "Voided successfully"});
		} else {
		  // check errors
		  res.status(200).json({"Error": result.message});
		}	
	});
});


// router.get('/transaction/{transactionId}', function(req, res) {
// 	//give transaction id, find card used for transaction
// })

// router.get('/transaction/{paymentsvcId}', function(req, res) {
// 	// given 
// });

// router.get('/transactiondetails/{paymentsvcId}', function(req, res) {
// 	//given trsanction id, get card token used for transaction
// }) ;

//Card end points
// customer can have multiple cards..find out which cards (tokens only--) we have on file
router.get('/cards/:customerId', function(req, res) {
	var customerId 	= req.params.customerId || undefined;

	if(customerId === undefined) {
		res.status(400).json({'Error': 'Customer id is missing.'});
		return;
	}

	//get list of cards for customer
	braintree.customer.find(customerId, function(err, customer) {
		if (customer !== null) {
			res.status(200).json({"result": customer.creditCards})	
		} else {
			res.status(200).json({"Error": "Customer not found"})	
		}
	});
});


// add a new card for an existing customer.....
router.post('/card', function(req, res) {
	//if body doesnt contain required data reject	
	//add new card for existing customer
});



// new Paypal Transaction
router.post('/charge/paypal', function(req, res) {
	//validate that required data is present...
	//attempt to post

	//return data
});

// //partial settlement
// Route::post('/partialsettlement', 'CardController@partialSettlement');

module.exports = router;