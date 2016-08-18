var request = require('request');
require('dotenv').load();

var base_url = process.env.BASEURL;

describe("Test Braintree REST API end points ", function() {
	
	describe("Get /client_token1", function() {
		it("returns a status code of 200", function(done) {
			request.get(base_url+'/client_token', function(error, response, body) {
				//console.log(response.statusCode);
				expect(response.statusCode).toBe(200);
				done();
			})	
			
		})
	});

	// //should return a 400 if required paramters are not present
	describe("POST /customer without all parameters", function() {
		it("Returns a 400 if all paramaters are not present", function(done) {
			request.post(base_url+'/customer', function(error, response, body) {
				//console.log(response.statusCode);
				expect(response.statusCode).toBe(400);
				done();
			})	
		})
		
	});

	// //should return a 400 if required paramters are not present
	describe("POST /customer with all parameters", function() {
		it("Returns a 201 if customer is created", function(done) {
			request.post(base_url+'/customer', function(error, response, body) {
				//console.log(response.statusCode);
				expect(response.statusCode).toBe(201);
				done();
			})	
		})
		
	});


});